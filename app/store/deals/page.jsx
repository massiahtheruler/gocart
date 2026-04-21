"use client";

import ActiveDeals from "@/components/ActiveDeals";

export default function StoreDealsPage() {
  return (
    <div className="mb-28 text-slate-500">
      <div className="motion-section">
        <h1 className="text-2xl">
          Seller <span className="font-medium text-slate-800">Deals</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Public coupon codes currently available to shoppers. These are
          admin-managed offers customers can use at checkout.
        </p>
      </div>

      <div className="motion-section -mx-6 sm:-mx-0" style={{ animationDelay: "90ms" }}>
        <ActiveDeals limit={0} showHeader={false} compact />
      </div>
    </div>
  );
}
