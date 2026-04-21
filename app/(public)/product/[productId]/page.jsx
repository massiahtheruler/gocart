"use client";
import ProductCard from "@/components/ProductCard";
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { ArrowRight, TicketPercent } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  getPrimaryProductCategory,
  parseProductCategories,
} from "@/lib/productCategories";

export default function Product() {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const products = useSelector((state) => state.product.list);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter((item) => item.id !== product.id)
      .filter((item) => {
        const productCategories = parseProductCategories(product.category);
        const itemCategories = parseProductCategories(item.category);
        return (
          itemCategories.some((category) =>
            productCategories.includes(category),
          ) || item.storeId === product.storeId
        );
      })
      .sort((a, b) => {
        const aScore = a.rating.length
          ? a.rating.reduce((sum, item) => sum + item.rating, 0) /
            a.rating.length
          : 0;
        const bScore = b.rating.length
          ? b.rating.reduce((sum, item) => sum + item.rating, 0) /
            b.rating.length
          : 0;
        return bScore - aScore;
      })
      .slice(0, 4);
  }, [product, products]);

  const fetchProduct = async () => {
    const product = products.find((product) => product.id === productId);
    setProduct(product);
  };

  useEffect(() => {
    if (products.length > 0) {
      fetchProduct();
    }
    scrollTo(0, 0);
  }, [productId, products]);

  return (
    <div className="mx-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-5 mt-8 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <div>
            Home / Products /{" "}
            {product ? getPrimaryProductCategory(product.category) : ""}
          </div>
          <Link
            href="/deals"
            className="control-button control-button--soft glass-sheen inline-flex items-center gap-2 self-start rounded-full px-4 py-2.5 text-sm font-medium"
          >
            <TicketPercent size={15} />
            Available Deals
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Product Details */}
        {product && <ProductDetails product={product} />}

        {/* Description & Reviews */}
        {product && <ProductDescription product={product} />}

        {relatedProducts.length > 0 && (
          <div className="my-20 items-center justify-center">
            <div className="mb-8 items-center justify-center">
              <h2 className="text-2xl font-semibold text-slate-800">
                Related products
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Similar picks based on category and product ratings.
              </p>
            </div>
            <div className="flex gap-6 items-center justify-center sm:flex sm:flex-wrap xl:gap-12">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
