import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prismadb";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(request) {
  if (!stripe || !stripeWebhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 },
    );
  }

  try {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature." },
        { status: 400 },
      );
    }

    const payload = await request.text();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeWebhookSecret,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderIds =
        session.metadata?.orderIds
          ?.split(",")
          .map((id) => id.trim())
          .filter(Boolean) ?? [];

      if (orderIds.length > 0) {
        await prisma.order.updateMany({
          where: {
            id: { in: orderIds },
          },
          data: {
            isPaid: true,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Stripe webhook failed." },
      { status: 400 },
    );
  }
}
