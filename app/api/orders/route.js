import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
export async function POST(request) {
  try {
    const { userId, has } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const { addressId, items, couponCode, paymentMethod } =
      await request.json();

    if (
      !addressId ||
      !paymentMethod ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing order details." },
        { status: 400 },
      );
    }

    if (!["COD", "STRIPE"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method." },
        { status: 400 },
      );
    }

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Selected address not found." },
        { status: 404 },
      );
    }

    const requestedItems = items
      .map((item) => ({
        productId: item?.id,
        quantity: Number(item?.quantity),
      }))
      .filter((item) => item.productId && Number.isFinite(item.quantity));

    if (
      requestedItems.length === 0 ||
      requestedItems.some((item) => item.quantity <= 0)
    ) {
      return NextResponse.json(
        { error: "Invalid order items." },
        { status: 400 },
      );
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: requestedItems.map((item) => item.productId) },
        inStock: true,
      },
    });

    if (products.length !== requestedItems.length) {
      return NextResponse.json(
        { error: "Some products are unavailable." },
        { status: 400 },
      );
    }

    let coupon = null;
    const normalizedCouponCode = couponCode?.trim().toUpperCase();
    const hasPlusPlan = has?.({ plan: "plus" }) ?? false;

    if (normalizedCouponCode) {
      coupon = await prisma.coupon.findFirst({
        where: {
          code: normalizedCouponCode,
          expiresAt: { gt: new Date() },
        },
      });

      if (!coupon) {
        return NextResponse.json(
          { error: "Coupon not found or expired." },
          { status: 404 },
        );
      }

      if (coupon.forNewUser) {
        const userOrders = await prisma.order.findMany({ where: { userId } });

        if (userOrders.length > 0) {
          return NextResponse.json(
            { error: "Coupon only valid for new users." },
            { status: 400 },
          );
        }
      }

      if (coupon.forMember && !hasPlusPlan) {
        return NextResponse.json(
          { error: "Coupon only valid for members." },
          { status: 400 },
        );
      }
    }

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );
    const storeGroups = new Map();

    for (const item of requestedItems) {
      const product = productMap.get(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: "Some products are unavailable." },
          { status: 400 },
        );
      }

      const existingItems = storeGroups.get(product.storeId) ?? [];
      existingItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
      storeGroups.set(product.storeId, existingItems);
    }

    const freeShippingThreshold = 50;
    const shippingFee = 5;

    const orders = await prisma.$transaction(
      Array.from(storeGroups.entries()).map(([storeId, orderItems]) => {
        const subtotal = orderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        const discountAmount = coupon ? (coupon.discount / 100) * subtotal : 0;
        const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
        const shipping = hasPlusPlan
          ? 0
          : discountedSubtotal >= freeShippingThreshold
            ? 0
            : shippingFee;
        const total = discountedSubtotal + shipping;

        return prisma.order.create({
          data: {
            total,
            userId,
            storeId,
            addressId,
            paymentMethod,
            isPaid: false,
            isCouponUsed: Boolean(coupon),
            coupon: coupon
              ? {
                  code: coupon.code,
                  description: coupon.description,
                  discount: coupon.discount,
                  forMember: coupon.forMember,
                  forNewUser: coupon.forNewUser,
                }
              : {},
            orderItems: {
              create: orderItems,
            },
          },
          include: {
            orderItems: true,
          },
        });
      }),
    );

    await prisma.user.update({
      where: { id: userId },
      data: { cart: {} },
    });

    if (paymentMethod === "STRIPE") {
      if (!stripe) {
        return NextResponse.json(
          { error: "Stripe is not configured on the server." },
          { status: 500 },
        );
      }

      const origin = request.headers.get("origin") || request.nextUrl.origin;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${origin}/orders?success=true`,
        cancel_url: `${origin}/cart?canceled=true`,
        metadata: {
          userId,
          orderIds: orders.map((order) => order.id).join(","),
        },
        line_items: orders.map((order) => ({
          price_data: {
            currency: process.env.STRIPE_CURRENCY || "usd",
            product_data: {
              name: `GoCart order ${order.id.slice(0, 8)}`,
              description: `Payment for ${order.orderItems.length} item(s) from store ${order.storeId.slice(0, 8)}`,
            },
            unit_amount: Math.round(order.total * 100),
          },
          quantity: 1,
        })),
      });

      return NextResponse.json({
        message: "Stripe checkout created successfully",
        session: { url: session.url },
        orders,
      });
    }
    return NextResponse.json({
      message: "Order placed successfully",
      orders,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message || "Failed to place order." },
      { status: 400 },
    );
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        address: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message || "Failed to fetch orders." },
      { status: 400 },
    );
  }
}
