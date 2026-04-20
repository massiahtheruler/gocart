import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId, has } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const { code } = await request.json();
    const normalizedCode = code?.trim().toUpperCase();

    if (!normalizedCode) {
      return NextResponse.json(
        { error: "Coupon code is required." },
        { status: 400 },
      );
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: normalizedCode,
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

    if (coupon.forMember) {
      const hasPlusPlan = has?.({ plan: "plus" }) ?? false;

      if (!hasPlusPlan) {
        return NextResponse.json(
          { error: "Coupon only valid for members." },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}
