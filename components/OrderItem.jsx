"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useMemo, useState } from "react";
import RatingModal from "./RatingModal";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderItem = ({ order }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";
  const [ratingModal, setRatingModal] = useState(null);
  const { ratings } = useSelector((state) => state.rating);

  const orderDate = useMemo(
    () => new Date(order.createdAt).toDateString(),
    [order.createdAt],
  );

  return (
    <>
      <article className="rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Order placed
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-800">
              {orderDate}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {order.address.name}, {order.address.city}, {order.address.state}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                Total
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {currency}
                {order.total}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                Payment
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {order.paymentMethod}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                Status
              </p>
              <div className="mt-2">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
          <div className="space-y-4">
            {order.orderItems.map((item, index) => {
              const existingRating = ratings.find(
                (rating) =>
                  order.id === rating.orderId &&
                  item.product.id === rating.productId,
              );

              return (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:flex-row md:items-center"
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Image
                      className="h-16 w-auto object-contain"
                      src={item.product.images[0]}
                      alt="product_img"
                      width={70}
                      height={70}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-base font-semibold text-slate-800">
                      {item.product.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {currency}
                      {item.price} · Qty {item.quantity}
                    </p>

                    <div className="mt-3">
                      {existingRating ? (
                        <div className="flex flex-wrap items-center gap-3">
                          <Rating value={existingRating.rating} />
                          <button
                            onClick={() => setRatingModal(existingRating)}
                            className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
                          >
                            Edit review
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setRatingModal({
                              orderId: order.id,
                              productId: item.product.id,
                            })
                          }
                          className={`text-sm font-medium text-emerald-600 transition hover:text-emerald-700 ${
                            order.status !== "DELIVERED" ? "hidden" : ""
                          }`}
                        >
                          Rate Product
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5 text-sm text-slate-600">
            <h3 className="text-base font-semibold text-slate-800">
              Delivery details
            </h3>
            <div className="mt-4 space-y-2 leading-6">
              <p>
                {order.address.name}, {order.address.street}
              </p>
              <p>
                {order.address.city}, {order.address.state}, {order.address.zip}
                , {order.address.country}
              </p>
              <p>{order.address.phone}</p>
            </div>
          </aside>
        </div>
      </article>

      {ratingModal && (
        <RatingModal
          ratingModal={ratingModal}
          setRatingModal={setRatingModal}
        />
      )}
    </>
  );
};

export default OrderItem;
