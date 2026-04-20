import prisma from "@/lib/prismadb";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ ratings: [] });
    }

    const ratings = await prisma.rating.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderId: true,
        productId: true,
        rating: true,
        review: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ratings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message || "Failed to fetch ratings." },
      { status: 400 },
    );
  }
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const { orderId, productId, rating, review } = await request.json();
    const normalizedReview = review?.trim();
    const numericRating = Number(rating);

    if (!orderId || !productId) {
      return NextResponse.json(
        { error: "Order and product are required." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5." },
        { status: 400 },
      );
    }

    if (!normalizedReview || normalizedReview.length < 5) {
      return NextResponse.json(
        { error: "Write a short review." },
        { status: 400 },
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        status: "DELIVERED",
        orderItems: {
          some: { productId },
        },
      },
      select: { id: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Only delivered purchases can be reviewed." },
        { status: 403 },
      );
    }

    const savedRating = await prisma.rating.upsert({
      where: {
        userId_productId_orderId: {
          userId,
          productId,
          orderId,
        },
      },
      update: {
        rating: numericRating,
        review: normalizedReview,
      },
      create: {
        userId,
        productId,
        orderId,
        rating: numericRating,
        review: normalizedReview,
      },
      select: {
        id: true,
        orderId: true,
        productId: true,
        rating: true,
        review: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ rating: savedRating });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message || "Failed to save rating." },
      { status: 400 },
    );
  }
}
