"use client";
import Image from "next/image";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderItem = ({ order }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";
  const [ratingModal, setRatingModal] = useState(null);

  const { ratings } = useSelector((state) => state.rating);

  return (
    <>
      <tr className="text-sm">
        <td className="text-left">
          <div className="flex flex-col gap-6">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                  <Image
                    className="h-14 w-auto"
                    src={item.product.images[0]}
                    alt="product_img"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="flex flex-col justify-center text-sm">
                  <p className="font-medium text-slate-600 text-base">
                    {item.product.name}
                  </p>
                  <p>
                    {currency}
                    {item.price} Qty : {item.quantity}{" "}
                  </p>
                  <p className="mb-1">
                    {new Date(order.createdAt).toDateString()}
                  </p>
                  <div>
                    {ratings.find(
                      (rating) =>
                        order.id === rating.orderId &&
                        item.product.id === rating.productId,
                    ) ? (
                      <div className="flex items-center gap-3">
                        <Rating
                          value={
                            ratings.find(
                              (rating) =>
                                order.id === rating.orderId &&
                                item.product.id === rating.productId,
                            ).rating
                          }
                        />
                        <button
                          onClick={() =>
                            setRatingModal(
                              ratings.find(
                                (rating) =>
                                  order.id === rating.orderId &&
                                  item.product.id === rating.productId,
                              ),
                            )
                          }
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
                        className={`text-green-500 hover:bg-green-50 transition ${order.status !== "DELIVERED" && "hidden"}`}
                      >
                        Rate Product
                      </button>
                    )}
                  </div>
                  {ratingModal && (
                    <RatingModal
                      ratingModal={ratingModal}
                      setRatingModal={setRatingModal}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </td>

        <td className="text-center max-md:hidden">
          {currency}
          {order.total}
        </td>

        <td className="text-left max-md:hidden">
          <p>
            {order.address.name}, {order.address.street},
          </p>
          <p>
            {order.address.city}, {order.address.state}, {order.address.zip},{" "}
            {order.address.country},
          </p>
          <p>{order.address.phone}</p>
        </td>

        <td className="text-left space-y-2 text-sm max-md:hidden">
          <OrderStatusBadge status={order.status} />
        </td>
      </tr>
      {/* Mobile */}
      <tr className="md:hidden">
        <td colSpan={5}>
          <p>
            {order.address.name}, {order.address.street}
          </p>
          <p>
            {order.address.city}, {order.address.state}, {order.address.zip},{" "}
            {order.address.country}
          </p>
          <p>{order.address.phone}</p>
          <br />
          <div className="flex items-center">
            <OrderStatusBadge status={order.status} className="mx-auto" />
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          <div className="border-b border-slate-300 w-6/7 mx-auto" />
        </td>
      </tr>
    </>
  );
};

export default OrderItem;
