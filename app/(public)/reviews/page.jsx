"use client";

import PageTitle from "@/components/PageTitle";
import Rating from "@/components/Rating";
import { MessageSquareText, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function ReviewsPage() {
  const products = useSelector((state) => state.product.list);
  const [sort, setSort] = useState("latest");
  const [minRating, setMinRating] = useState("");

  const reviews = useMemo(() => {
    const flattened = products
      .flatMap((product) =>
        product.rating.map((item) => ({
          ...item,
          product: {
            id: product.id,
            name: product.name,
            category: product.category,
            image: product.images?.[0],
            store: product.store,
          },
        })),
      );

    let nextReviews = [...flattened];

    if (minRating) {
      nextReviews = nextReviews.filter((review) => review.rating >= Number(minRating));
    }

    if (sort === "highest") {
      nextReviews.sort((a, b) => b.rating - a.rating);
    } else if (sort === "lowest") {
      nextReviews.sort((a, b) => a.rating - b.rating);
    } else {
      nextReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return nextReviews;
  }, [products, sort, minRating]);

  return (
    <div className="mx-6 min-h-[70vh]">
      <div className="mx-auto my-20 max-w-7xl">
        <PageTitle
          heading="Customer Reviews"
          text={`Showing ${reviews.length} published reviews across ${products.length} products`}
          linkText="Explore products"
          href="/shop?sort=rating"
        />

        <div className="mt-8 flex flex-col gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-slate-600">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none"
            >
              <option value="latest">Latest</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-slate-600">Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none"
            >
              <option value="">Any rating</option>
              <option value="4">4 stars & up</option>
              <option value="3">3 stars & up</option>
              <option value="2">2 stars & up</option>
            </select>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {reviews.map((review, index) => (
              <article
                key={review.id}
                className="motion-section glass-lift rounded-[1.6rem] p-5"
                style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={review.user.image}
                      alt={review.user.name}
                      width={56}
                      height={56}
                      className="size-12 rounded-full object-cover ring-1 ring-white/80"
                    />
                    <div>
                      <p className="font-medium text-slate-800">
                        {review.user.name}
                      </p>
                      <p className="text-sm text-slate-400">
                        {new Date(review.createdAt).toDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full bg-white/75 px-3 py-1 text-slate-600 shadow-[0_10px_18px_rgba(148,163,184,0.12)]">
                    <Rating value={review.rating} />
                  </div>
                </div>

                <p className="mt-5 flex items-start gap-2 text-sm leading-7 text-slate-600">
                  <MessageSquareText
                    size={16}
                    className="mt-1 shrink-0 text-emerald-500"
                  />
                  <span>{review.review}</span>
                </p>

                <div className="mt-6 flex items-center gap-4 rounded-[1.35rem] border border-white/75 bg-white/68 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_18px_36px_rgba(148,163,184,0.12)]">
                  <div className="product-stage flex size-18 items-center justify-center rounded-[1.2rem]">
                    <Image
                      src={review.product.image}
                      alt={review.product.name}
                      width={80}
                      height={80}
                      className="floating-product max-h-12 w-auto"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {review.product.category}
                    </p>
                    <p className="mt-1 truncate font-medium text-slate-800">
                      {review.product.name}
                    </p>
                    <Link
                      href={`/product/${review.product.id}`}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-emerald-600"
                    >
                      View product
                      <Star size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-14 rounded-[2rem] border border-dashed border-slate-200 bg-white/70 px-6 py-14 text-center text-slate-400">
            No reviews yet.
          </div>
        )}
      </div>
    </div>
  );
}
