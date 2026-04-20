"use client";

import Loading from "@/components/Loading";
import Rating from "@/components/Rating";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { MessageSquareText, Search, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function StoreReviewsPage() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [sort, setSort] = useState("latest");
  const [minRating, setMinRating] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get("/api/store/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRatings(data.dashboardData.ratings || []);
      } catch (error) {
        toast.error(error?.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [getToken]);

  const filteredRatings = useMemo(() => {
    let nextRatings = [...ratings];

    if (search) {
      const normalizedSearch = search.toLowerCase();
      nextRatings = nextRatings.filter(
        (item) =>
          item.product?.name?.toLowerCase().includes(normalizedSearch) ||
          item.user?.name?.toLowerCase().includes(normalizedSearch) ||
          item.review?.toLowerCase().includes(normalizedSearch),
      );
    }

    if (minRating) {
      nextRatings = nextRatings.filter((item) => item.rating >= Number(minRating));
    }

    if (sort === "highest") {
      nextRatings.sort((a, b) => b.rating - a.rating);
    } else if (sort === "lowest") {
      nextRatings.sort((a, b) => a.rating - b.rating);
    } else {
      nextRatings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return nextRatings;
  }, [ratings, sort, minRating, search]);

  if (loading) return <Loading />;

  return (
    <div className="mb-28 text-slate-500">
      <h1 className="text-2xl">
        Store <span className="font-medium text-slate-800">Reviews</span>
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Manage product feedback, track customer sentiment, and jump to reviewed products.
      </p>

      <div className="motion-section mt-6 flex flex-col gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
          <Search size={16} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, buyer, or review"
            className="bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none"
          >
            <option value="latest">Latest</option>
            <option value="highest">Highest rated</option>
            <option value="lowest">Lowest rated</option>
          </select>

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

      <div className="mt-8 space-y-4">
        {filteredRatings.map((review, index) => (
          <article
            key={review.id}
            className="motion-section rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 shadow-sm"
            style={{ animationDelay: `${90 + index * 60}ms` }}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <Image
                  src={review.user.image}
                  alt={review.user.name}
                  width={64}
                  height={64}
                  className="size-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-slate-800">{review.user.name}</p>
                  <p className="text-sm text-slate-400">
                    {new Date(review.createdAt).toDateString()}
                  </p>
                  <div className="mt-2">
                    <Rating value={review.rating} />
                  </div>
                </div>
              </div>

              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                {review.product?.category}
              </div>
            </div>

            <p className="mt-4 flex items-start gap-2 text-sm leading-7 text-slate-600">
              <MessageSquareText size={16} className="mt-1 shrink-0 text-emerald-500" />
              <span>{review.review}</span>
            </p>

            <div className="mt-5 flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/80 bg-slate-50/80 px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Product
                </p>
                <p className="truncate font-medium text-slate-800">
                  {review.product?.name}
                </p>
              </div>
              <a
                href={`/product/${review.product?.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600"
              >
                View product <Star size={14} />
              </a>
            </div>
          </article>
        ))}

        {filteredRatings.length === 0 && (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/70 px-6 py-14 text-center text-slate-400">
            No reviews match the current filter set.
          </div>
        )}
      </div>
    </div>
  );
}
