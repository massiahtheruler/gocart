import imagekit, { buildImageKitUrl } from "@/config/imagekit";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import {
  parseProductCategories,
  serializeProductCategories,
} from "@/lib/productCategories";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const categories = parseProductCategories(formData.getAll("categories"));
    const images = formData.getAll("images");

    if (
      !name ||
      !description ||
      !mrp ||
      !price ||
      categories.length < 1 ||
      images.length < 1
    ) {
      return NextResponse.json(
        { error: "missing product details" },
        { status: 400 },
      );
    }
    const imagesUrl = await Promise.all(
      images.map(async (image) => {
        const response = await imagekit.files.upload({
          file: image,
          fileName: image.name || `${name}-image`,
          folder: "/gocart/products",
        });
        const url = buildImageKitUrl(response.filePath, [
          { quality: "auto" },
          { format: "webp" },
          { width: "1024" },
        ]);
        return url;
      }),
    );

    await prisma.product.create({
      data: {
        name,
        description,
        mrp,
        price,
        category: serializeProductCategories(categories),
        images: imagesUrl,
        storeId,
      },
    });
    return NextResponse.json({ message: "Product added successfully" });
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
    const productId = request.nextUrl.searchParams.get("id");

    if (productId) {
      const product = await prisma.product.findFirst({
        where: { id: productId, storeId },
      });

      if (!product) {
        return NextResponse.json(
          { error: "product not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ product });
    }

    const products = await prisma.product.findMany({ where: { storeId } });
    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const productId = formData.get("productId");
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const categories = parseProductCategories(formData.getAll("categories"));
    const existingImages = formData.getAll("existingImages").map(String);
    const imageSlots = [0, 1, 2, 3].map((index) => ({
      existing: existingImages[index] || "",
      file: formData.get(`imageSlot${index + 1}`),
    }));

    if (
      !productId ||
      !name ||
      !description ||
      !mrp ||
      !price ||
      categories.length < 1
    ) {
      return NextResponse.json(
        { error: "missing product details" },
        { status: 400 },
      );
    }

    const existingProduct = await prisma.product.findFirst({
      where: { id: productId, storeId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "product not found" },
        { status: 404 },
      );
    }

    let imagesUrl = existingProduct.images;

    imagesUrl = await Promise.all(
      imageSlots.map(async (slot, index) => {
        const incomingFile =
          slot.file && typeof slot.file === "object" && "name" in slot.file
            ? slot.file
            : null;

        if (incomingFile && incomingFile.size > 0) {
          const response = await imagekit.files.upload({
            file: incomingFile,
            fileName: incomingFile.name || `${name}-image-${index + 1}`,
            folder: "/gocart/products",
          });
          return buildImageKitUrl(response.filePath, [
            { quality: "auto" },
            { format: "webp" },
            { width: "1024" },
          ]);
        }

        return slot.existing || existingProduct.images[index] || "";
      }),
    );

    imagesUrl = imagesUrl.filter(Boolean);

    if (imagesUrl.length < 1) {
      return NextResponse.json(
        { error: "Please keep or upload at least one image." },
        { status: 400 },
      );
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        mrp,
        price,
        category: serializeProductCategories(categories),
        images: imagesUrl,
      },
    });

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}
