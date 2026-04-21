"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Check,
  Copy,
  Lock,
  Sparkles,
  TicketPercent,
} from "lucide-react";
import {
  getSelectedDealCode,
  setSelectedDealCode,
} from "@/lib/selectedDeal";

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const statusClasses = {
  active: "bg-emerald-100 text-emerald-700",
  upcoming: "bg-sky-100 text-sky-700",
  expired: "bg-slate-200 text-slate-600",
};

const statusCopy = {
  active: "Active now",
  upcoming: "Starts soon",
  expired: "Expired",
};

const ActiveDeals = ({ limit = 3, showHeader = true, compact = false }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDealCode, setSelectedDealCodeState] = useState("");

  useEffect(() => {
    setSelectedDealCodeState(getSelectedDealCode());

    const fetchDeals = async () => {
      try {
        const { data } = await axios.get("/api/coupon");
        setCoupons(data.coupons || []);
      } catch (error) {
        toast.error(error?.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  useEffect(() => {
    const syncSelectedDeal = () => {
      setSelectedDealCodeState(getSelectedDealCode());
    };

    window.addEventListener("gocart:selected-deal", syncSelectedDeal);
    return () =>
      window.removeEventListener("gocart:selected-deal", syncSelectedDeal);
  }, []);

  const orderedCoupons = useMemo(() => {
    const rank = { active: 0, upcoming: 1, expired: 2 };
    const sorted = [...coupons].sort((a, b) => {
      if (rank[a.status] !== rank[b.status]) {
        return rank[a.status] - rank[b.status];
      }
      return new Date(a.startsAt) - new Date(b.startsAt);
    });

    return limit ? sorted.slice(0, limit) : sorted;
  }, [coupons, limit]);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Copied ${code}`);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const selectDeal = (coupon) => {
    setSelectedDealCode(coupon.code);
    toast.success(`${coupon.code} saved for checkout`);
  };

  return (
    <section className={compact ? "px-6 my-20 max-w-6xl mx-auto" : "mx-6"}>
      <div className={compact ? "" : "max-w-7xl mx-auto"}>
        {showHeader && (
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">
                Deal Board
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-800">
                Past, current, and upcoming coupons
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Guests can browse every public deal here. Current offers create
                urgency, upcoming campaigns create anticipation, and expired
                deals keep the promo surface feeling alive.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                View deal board
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/shop?sale=1"
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700"
              >
                Browse discounted products
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
            Loading deal board...
          </div>
        ) : orderedCoupons.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-10 text-center text-slate-500">
            No public deals yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {orderedCoupons.map((coupon) => (
              <article
                key={coupon.code}
                className={`rounded-3xl border p-6 shadow-sm ${
                  coupon.status === "active"
                    ? "border-emerald-100 bg-gradient-to-br from-white to-emerald-50"
                    : coupon.status === "upcoming"
                      ? "border-sky-100 bg-gradient-to-br from-white to-sky-50"
                      : "border-slate-200 bg-gradient-to-br from-white to-slate-100"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        {coupon.discount}% off
                      </p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[coupon.status]}`}
                      >
                        {statusCopy[coupon.status]}
                      </span>
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-800">
                      {coupon.code}
                    </h3>
                  </div>

                  <span className="rounded-full bg-white p-3 text-slate-700 shadow-sm">
                    {coupon.status === "upcoming" ? (
                      <CalendarClock size={18} />
                    ) : coupon.status === "expired" ? (
                      <Lock size={18} />
                    ) : (
                      <TicketPercent size={18} />
                    )}
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-600">
                  {coupon.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  {coupon.forNewUser && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                      New users
                    </span>
                  )}
                  {coupon.forMember && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                      Plus members
                    </span>
                  )}
                  {coupon.status === "upcoming" && (
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">
                      Starts {formatDate(coupon.startsAt)}
                    </span>
                  )}
                  {coupon.status === "active" && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                      Expires {formatDate(coupon.expiresAt)}
                    </span>
                  )}
                  {coupon.status === "expired" && (
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-700">
                      Expired {formatDate(coupon.expiresAt)}
                    </span>
                  )}
                </div>

                <div className="mt-6 rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-500">
                  {coupon.status === "upcoming" && (
                    <p>
                      This coupon is scheduled. Sign in and check back once it
                      goes live.
                    </p>
                  )}
                  {coupon.status === "active" && (
                    <p>
                      Redeem at checkout. If it is member-only or first-order
                      only, the checkout will validate that automatically.
                    </p>
                  )}
                  {coupon.status === "expired" && (
                    <p>
                      This one has ended, but it still signals the kind of deals
                      customers can expect.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => copyCode(coupon.code)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                  >
                    <Copy size={15} />
                    Copy code
                  </button>
                  {coupon.status === "active" ? (
                    <button
                      type="button"
                      onClick={() => selectDeal(coupon)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                        selectedDealCode === coupon.code
                          ? "cursor-default border border-emerald-300 bg-emerald-100 text-emerald-800"
                          : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100"
                      }`}
                      disabled={selectedDealCode === coupon.code}
                    >
                      {selectedDealCode === coupon.code ? (
                        <>
                          <Check size={15} />
                          Saved
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} />
                          Save for checkout
                        </>
                      )}
                    </button>
                  ) : (
                    <Link href="/deals" className="text-sm font-medium text-emerald-700">
                      View details
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ActiveDeals;
