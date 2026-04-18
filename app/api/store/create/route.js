import { getAuth } from "@clerk/nextjs/server";
import imagekit, { buildImageKitUrl } from "@/config/imagekit";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");

    if (
      !name ||
      !username ||
      !description ||
      !email ||
      !contact ||
      !address ||
      !image
    ) {
      return NextResponse.json(
        { error: "missing store info" },
        { status: 400 },
      );
    }

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { error: "store image is required" },
        { status: 400 },
      );
    }

    const existingStore = await prisma.store.findFirst({
      where: { userId },
    });

    if (existingStore) {
      return NextResponse.json(
        {
          error: "store already exists for this user",
          status: existingStore.status,
        },
        { status: 409 },
      );
    }

    const normalizedUsername = username.toString().trim().toLowerCase();

    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: normalizedUsername },
    });

    if (isUsernameTaken) {
      return NextResponse.json(
        { error: "username already taken" },
        { status: 400 },
      );
    }

    const uploadedLogo = await imagekit.files.upload({
      file: image,
      fileName: image.name || `${normalizedUsername}-logo`,
      folder: "/gocart/stores",
    });

    const optimizedImage = buildImageKitUrl(uploadedLogo.filePath, [
      { quality: "auto" },
      { format: "webp" },
      { width: "512" },
    ]);

    const newStore = await prisma.store.create({
      data: {
        userId,
        name: name.toString().trim(),
        description: description.toString().trim(),
        username: normalizedUsername,
        address: address.toString().trim(),
        logo: optimizedImage,
        email: email.toString().trim(),
        contact: contact.toString().trim(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "applied, waiting for approval",
        store: newStore,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("store create error", error);

    return NextResponse.json(
      { error: error?.message || "failed to create store" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findFirst({
      where: { userId },
    });

    return NextResponse.json({ store: store || null });
  } catch (error) {
    console.error("store fetch error", error);

    return NextResponse.json(
      { error: error?.message || "failed to fetch store" },
      { status: 500 },
    );
  }
}
