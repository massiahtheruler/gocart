"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowRight, Copy, TicketPercent } from "lucide-react";

const formatExpiry = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const ActiveDeals = ({ limit = 3, showHeader = true, compact = false }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const visibleCoupons = useMemo(
    () => (limit ? coupons.slice(0, limit) : coupons),
    [coupons, limit],
  );

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Copied ${code}`);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  if (!loading && coupons.length === 0) {
    return null;
  }

  return (
    <section className={compact ? "px-6 my-20 max-w-6xl mx-auto" : "mx-6"}>
      <div className={compact ? "" : "max-w-7xl mx-auto"}>
        {showHeader && (
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">
                Active Deals
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-800">
                Public coupon codes
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Apply these codes at checkout. Public deals are visible here so
                customers do not need to find them externally.
              </p>
            </div>
            <Link
              href="/shop?sale=1"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700"
            >
              Browse discounted products
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
            Loading active deals...
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleCoupons.map((coupon) => (
              <article
                key={coupon.code}
                className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                      {coupon.discount}% off
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-800">
                      {coupon.code}
                    </h3>
                  </div>
                  <span className="rounded-full bg-white p-3 text-emerald-600 shadow-sm">
                    <TicketPercent size={18} />
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
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                    Expires {formatExpiry(coupon.expiresAt)}
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => copyCode(coupon.code)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                  >
                    <Copy size={15} />
                    Copy code
                  </button>
                  <Link
                    href="/cart"
                    className="text-sm font-medium text-emerald-700"
                  >
                    Use at checkout
                  </Link>
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
