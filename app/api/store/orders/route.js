import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);
    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const { orderId, orderIds, status } = await request.json();

    const ids = Array.isArray(orderIds)
      ? orderIds.filter(Boolean)
      : orderId
        ? [orderId]
        : [];

    if (!status || ids.length === 0) {
      return NextResponse.json(
        { error: "order ids and status are required" },
        { status: 400 },
      );
    }

    await prisma.order.updateMany({
      where: { id: { in: ids }, storeId },
      data: { status },
    });

    return NextResponse.json({ message: "order status updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const orders = await prisma.order.findMany({
      where: { storeId },
      include: {
        user: true,
        address: true,
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}
