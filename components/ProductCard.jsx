'use client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductCard = ({ product }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const rating = product.rating.length
    ? Math.round(
        product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
          product.rating.length,
      )
    : 0;

  return (
    <Link href={`/product/${product.id}`} className="group block w-full">
      <div className="product-stage glass-sheen flex h-40 w-full items-center justify-center rounded-[1.4rem] px-4 min-[500px]:mx-auto sm:h-68 sm:w-60">
        <Image
          width={500}
          height={500}
          className="floating-product max-h-30 w-auto sm:max-h-40"
          src={product.images[0]}
          alt={product.name}
        />
      </div>
      <div className="w-full pt-3 text-sm text-slate-800 min-[500px]:max-w-60">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="line-clamp-2 font-medium text-slate-800 transition-colors duration-200 group-hover:text-slate-950">
              {product.name}
            </p>
            <div className="flex items-center gap-2">
              {Array(5)
                .fill("")
                .map((_, index) => (
                  <StarIcon
                    key={index}
                    size={14}
                    className="mt-0.5 text-transparent"
                    fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"}
                  />
                ))}
              <span className="rating-count-pill">
                {product.rating.length}
              </span>
            </div>
          </div>
          <p className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-slate-700 shadow-[0_10px_18px_rgba(148,163,184,0.14)] transition-transform duration-200 group-hover:-translate-y-0.5">
            {currency}
            {product.price}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard
