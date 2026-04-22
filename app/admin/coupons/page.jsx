"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { CalendarClock, DeleteIcon, Sparkles, TicketPercent } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

const statusClasses = {
  active: "bg-emerald-100 text-emerald-700",
  upcoming: "bg-sky-100 text-sky-700",
  expired: "bg-slate-200 text-slate-600",
};

export default function AdminCoupons() {
  const { getToken } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    discount: "",
    forNewUser: false,
    forMember: false,
    isPublic: true,
    startsAt: format(new Date(), "yyyy-MM-dd"),
    expiresAt: format(
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      "yyyy-MM-dd",
    ),
  });

  const couponSummary = useMemo(
    () => ({
      active: coupons.filter((coupon) => coupon.status === "active").length,
      upcoming: coupons.filter((coupon) => coupon.status === "upcoming").length,
      expired: coupons.filter((coupon) => coupon.status === "expired").length,
    }),
    [coupons],
  );

  const fetchCoupons = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/coupon", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoupons(data.coupons);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const payload = {
        ...newCoupon,
        discount: Number(newCoupon.discount),
      };

      const { data } = await axios.post(
        "/api/admin/coupon",
        { coupon: payload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(data.message);
      setNewCoupon({
        code: "",
        description: "",
        discount: "",
        forNewUser: false,
        forMember: false,
        isPublic: true,
        startsAt: format(new Date(), "yyyy-MM-dd"),
        expiresAt: format(
          new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
          "yyyy-MM-dd",
        ),
      });
      await fetchCoupons();
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const handleChange = (e) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  const deleteCoupon = async (code) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this coupon?",
      );
      if (!confirm) return;
      const token = await getToken();
      await axios.delete(`/api/admin/coupon?code=${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchCoupons();
      toast.success("Coupon deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [getToken]);

  return (
    <div className="mb-28 space-y-8 text-slate-500">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-700">
            Coupon <span className="text-slate-900">Control Center</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Create site-wide promotions, schedule future drops, and keep visible
            deal inventory alive even after a campaign expires.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
          <Sparkles size={16} />
          Scheduled promotions enabled
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Active
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {couponSummary.active}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Upcoming
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {couponSummary.upcoming}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-100/90 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Expired archive
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {couponSummary.expired}
          </p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form
          onSubmit={(e) =>
            toast.promise(handleAddCoupon(e), { loading: "Saving coupon..." })
          }
          className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">
                Create Coupon
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Set a start date and expiry so deals can be teased before they
                become redeemable. Expiry stays valid through the full selected
                day.
              </p>
            </div>
            <span className="rounded-2xl bg-slate-50 p-3 text-violet-600">
              <TicketPercent size={18} />
            </span>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Coupon code"
                className="filter-control w-full rounded-2xl px-4 py-3 text-slate-700 outline-none"
                name="code"
                value={newCoupon.code}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                placeholder="Discount (%)"
                min={1}
                max={100}
                className="filter-control w-full rounded-2xl px-4 py-3 text-slate-700 outline-none"
                name="discount"
                value={newCoupon.discount}
                onChange={handleChange}
                required
              />
            </div>

            <textarea
              placeholder="Coupon description"
              className="filter-control min-h-28 w-full rounded-2xl px-4 py-3 text-slate-700 outline-none"
              name="description"
              value={newCoupon.description}
              onChange={handleChange}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <CalendarClock size={16} />
                  Starts at
                </span>
                <input
                  type="date"
                  className="filter-control w-full rounded-2xl px-4 py-3 text-slate-700 outline-none"
                  name="startsAt"
                  value={newCoupon.startsAt}
                  onChange={handleChange}
                />
                <p className="text-xs text-slate-400">
                  Goes live at the start of this date.
                </p>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-600">
                  Expires at
                </span>
                <input
                  type="date"
                  className="filter-control w-full rounded-2xl px-4 py-3 text-slate-700 outline-none"
                  name="expiresAt"
                  value={newCoupon.expiresAt}
                  onChange={handleChange}
                />
                <p className="text-xs text-slate-400">
                  Remains usable through the end of this date.
                </p>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    New users
                  </span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-emerald-600"
                    checked={newCoupon.forNewUser}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        forNewUser: e.target.checked,
                      })
                    }
                  />
                </div>
              </label>

              <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    Plus members
                  </span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-emerald-600"
                    checked={newCoupon.forMember}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        forMember: e.target.checked,
                      })
                    }
                  />
                </div>
              </label>

              <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    Show publicly
                  </span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-emerald-600"
                    checked={newCoupon.isPublic}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        isPublic: e.target.checked,
                      })
                    }
                  />
                </div>
              </label>
            </div>
          </div>

          <button className="control-button control-button--primary mt-6 inline-flex rounded-full px-6 py-3 text-sm font-medium text-white">
            Save coupon
          </button>
        </form>

        <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-slate-800">
              Coupon Timeline
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Active, scheduled, and archived coupons stay visible here for
              campaign planning and content depth.
            </p>
          </div>

          <div className="space-y-4">
            {coupons.map((coupon) => (
              <article
                key={coupon.code}
                className="rounded-2xl border border-slate-200 bg-slate-50/75 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {coupon.code}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[coupon.status]}`}
                      >
                        {coupon.status}
                      </span>
                      {coupon.isPublic && (
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                          Public
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {coupon.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toast.promise(deleteCoupon(coupon.code), {
                        loading: "Deleting coupon...",
                      })
                    }
                    className="inline-flex items-center justify-center rounded-full border border-red-100 bg-white p-3 text-red-500 transition hover:border-red-200 hover:text-red-700"
                  >
                    <DeleteIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-700">
                    {coupon.discount}% off
                  </span>
                  {coupon.forNewUser && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">
                      New users
                    </span>
                  )}
                  {coupon.forMember && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
                      Plus members
                    </span>
                  )}
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-500 md:grid-cols-2">
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Starts
                    </p>
                    <p className="mt-2 text-slate-700">
                      {format(new Date(coupon.startsAt), "yyyy-MM-dd")}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Expires
                    </p>
                    <p className="mt-2 text-slate-700">
                      {format(new Date(coupon.expiresAt), "yyyy-MM-dd")}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
