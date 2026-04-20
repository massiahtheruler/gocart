import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawUsername = searchParams.get("username");

    if (!rawUsername) {
      return NextResponse.json({ error: "missing username" }, { status: 400 });
    }

    const username = rawUsername.toLowerCase();

    const store = await prisma.store.findFirst({
      where: { username, isActive: true, status: "approved" },
      include: { Product: { include: { rating: true } } },
    });

    if (!store) {
      return NextResponse.json({ error: "store not found" }, { status: 400 });
    }

    return NextResponse.json({ store });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}
