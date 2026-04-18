import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request) {
  try {
    const { searchParams } = new url(request.url);
    const username = searchParams.get("username").toLowerCase();

    if (!username) {
      return NextResponse.json({ error: "missing username" }, { status: 400 });
    }

    const store = await prisma.store.findUnique({
      where: { username, isActive: true },
      include: { product: { include: { rating: true } } },
    });

    if (!store) {
      return NextResponse.json({ error: "store not found" }, { status: 400 });
    }
    return NextResponse.json({ store });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.mesage },
      { status: 400 },
    );
  }
}
