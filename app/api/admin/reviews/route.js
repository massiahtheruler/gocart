import prisma from "@/lib/prismadb";
import authAdmin from "@/middlewares/authAdmin";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const ratings = await prisma.rating.findMany({
      include: {
        user: true,
        product: {
          include: {
            store: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ratings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message || "Failed to fetch reviews." },
      { status: 400 },
    );
  }
}
