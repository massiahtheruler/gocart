import authAdmin from "@/middlewares/authAdmin";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { inngest } from "@/inngest/client";

export async function POST(request) {
  try {
    const { userId } = await auth();
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const { coupon } = await request.json();
    const normalizedCoupon = {
      ...coupon,
      code: coupon.code.toUpperCase(),
      discount: Number(coupon.discount),
      startsAt: new Date(coupon.startsAt || new Date()),
      expiresAt: new Date(coupon.expiresAt),
    };

    if (Number.isNaN(normalizedCoupon.discount) || normalizedCoupon.discount <= 0) {
      return NextResponse.json({ error: "invalid coupon discount" }, { status: 400 });
    }

    if (normalizedCoupon.startsAt >= normalizedCoupon.expiresAt) {
      return NextResponse.json(
        { error: "Coupon start date must be before expiry date" },
        { status: 400 },
      );
    }

    await prisma.coupon.create({ data: normalizedCoupon }).then(async (coupon) => {
      await inngest.send({
        name: "app/coupon.expired",
        data: {
          code: coupon.code,
          expires_at: coupon.expiresAt,
        },
      });
    });

    return NextResponse.json({ message: "Coupon added successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { userId } = await auth();
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const { searchParams } = request.nextUrl;
    const code = searchParams.get("code");

    await prisma.coupon.delete({ where: { code } });
    return NextResponse.json({ message: "coupon deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      {
        status: 400,
      },
    );
  }
}
export async function GET() {
  try {
    const { userId } = await auth();
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const now = new Date();
    const coupons = await prisma.coupon.findMany({
      orderBy: [{ startsAt: "desc" }, { expiresAt: "desc" }],
    });
    return NextResponse.json({
      coupons: coupons.map((coupon) => ({
        ...coupon,
        status:
          coupon.startsAt > now
            ? "upcoming"
            : coupon.expiresAt < now
              ? "expired"
              : "active",
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      {
        status: 400,
      },
    );
  }
}
