import prisma from "@/lib/prismadb";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const orders = await prisma.order.count();
    const stores = await prisma.store.count();
    const products = await prisma.product.count();
    const allOrders = await prisma.order.findMany({
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const revenue = allOrders
      .reduce((total, order) => total + order.total, 0)
      .toFixed(2);

    return NextResponse.json({
      dashboardData: {
        orders,
        stores,
        products,
        revenue,
        allOrders,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}
