"use client";

import Loading from "@/components/Loading";
import { useAuth } from "@clerk/nextjs";
import {
  CircleDollarSignIcon,
  LayoutListIcon,
  MessageSquareText,
  ShoppingBasketIcon,
  SquarePenIcon,
  SquarePlusIcon,
  StarIcon,
  TagsIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { formatProductCategories } from "@/lib/productCategories";

export default function Dashboard() {
  const { getToken } = useAuth();
  const router = useRouter();
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalEarnings: 0,
    totalOrders: 0,
    ratings: [],
  });

  const dashboardCardsData = [
    {
      title: "Total Products",
      value: dashboardData.totalProducts,
      icon: ShoppingBasketIcon,
    },
    {
      title: "Total Earnings",
      value: `${currency}${dashboardData.totalEarnings}`,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Total Orders",
      value: dashboardData.totalOrders,
      icon: LayoutListIcon,
    },
    {
      title: "Total Ratings",
      value: dashboardData.ratings.length,
      icon: StarIcon,
    },
  ];

  const averageRating = useMemo(() => {
    if (!dashboardData.ratings.length) return 0;
    const total = dashboardData.ratings.reduce(
      (sum, item) => sum + item.rating,
      0,
    );
    return (total / dashboardData.ratings.length).toFixed(1);
  }, [dashboardData.ratings]);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(data.dashboardData);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="mb-28 space-y-8 text-slate-500">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-700">
            Seller <span className="text-slate-900">Dashboard</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Track your store performance, customer feedback, and the next actions
            that keep products moving.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          <StarIcon size={16} fill="currentColor" className="text-emerald-500" />
          Average rating {averageRating}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardCardsData.map((card, index) => (
          <div
            key={card.title}
            className="motion-section rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm"
            style={{ animationDelay: `${80 + index * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  {card.title}
                </p>
                <b className="text-3xl font-semibold text-slate-800">
                  {card.value}
                </b>
              </div>
              <card.icon
                size={42}
                className="rounded-2xl bg-slate-100 p-2.5 text-slate-400"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.9fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Recent Reviews
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest feedback from customers who purchased your products.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/store/reviews")}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-slate-200">
            {dashboardData.ratings.length > 0 ? (
              dashboardData.ratings.slice(0, 5).map((review, index) => (
                <div
                  key={review.id || index}
                  className="motion-section flex flex-col gap-5 py-5 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between"
                  style={{ animationDelay: `${220 + index * 70}ms` }}
                >
                  <div className="flex gap-4">
                    <Image
                      src={review.user.image}
                      alt=""
                      className="h-11 w-11 rounded-full object-cover"
                      width={100}
                      height={100}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-800">
                          {review.user.name}
                        </p>
                        <span className="text-xs text-slate-400">
                          {new Date(review.createdAt).toDateString()}
                        </span>
                      </div>
                      <p className="mt-2 max-w-xl leading-6 text-slate-500">
                        {review.review}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 lg:items-end">
                    <div className="flex flex-col lg:items-end">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                        {formatProductCategories(review.product?.category)}
                      </p>
                      <p className="font-semibold text-slate-700">
                        {review.product?.name}
                      </p>
                      <div className="mt-1 flex items-center">
                        {Array(5)
                          .fill("")
                          .map((_, starIndex) => (
                            <StarIcon
                              key={starIndex}
                              size={16}
                              className="mt-0.5 text-transparent"
                              fill={
                                review.rating >= starIndex + 1
                                  ? "#00C950"
                                  : "#D1D5DB"
                              }
                            />
                          ))}
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/product/${review.product.id}`)}
                      className="rounded-full bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center text-slate-400">
                <p className="text-lg font-medium text-slate-700">
                  No reviews yet
                </p>
                <p className="mt-2 text-sm">
                  Reviews from completed orders will appear here once customers
                  leave feedback.
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-slate-50/95 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Common seller tasks, without leaving the dashboard.
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => router.push("/store/add-product")}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                <span className="flex items-center gap-3">
                  <SquarePlusIcon size={18} className="text-emerald-500" />
                  Add Product
                </span>
                <span className="text-slate-400">Open</span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/store/manage-product")}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                <span className="flex items-center gap-3">
                  <SquarePenIcon size={18} className="text-sky-500" />
                  Manage Products
                </span>
                <span className="text-slate-400">Open</span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/store/orders")}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                <span className="flex items-center gap-3">
                  <LayoutListIcon size={18} className="text-violet-500" />
                  Review Orders
                </span>
                <span className="text-slate-400">Open</span>
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-100/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              Store Snapshot
            </h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="flex items-center gap-3">
                  <MessageSquareText size={17} className="text-amber-500" />
                  Review volume
                </span>
                <span className="font-semibold text-slate-800">
                  {dashboardData.ratings.length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="flex items-center gap-3">
                  <TagsIcon size={17} className="text-indigo-500" />
                  Catalog breadth
                </span>
                <span className="font-semibold text-slate-800">
                  {dashboardData.totalProducts > 0 ? "Active" : "Starting"}
                </span>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 px-5 py-5 text-white">
                <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                  Seller note
                </p>
                <p className="mt-3 text-sm leading-6 text-white/80">
                  Keep product details fresh and follow up on reviews. The
                  dashboard is strongest when products, reviews, and order
                  updates stay active together.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
