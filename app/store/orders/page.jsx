"use client";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

export default function StoreOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("PROCESSING");
  const { getToken } = useAuth();

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderIds, status) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/store/orders",
        {
          orderIds: Array.isArray(orderIds) ? orderIds : [orderIds],
          status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setOrders((prev) =>
        prev.map((order) =>
          (Array.isArray(orderIds) ? orderIds : [orderIds]).includes(order.id)
            ? { ...order, status }
            : order,
        ),
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const toggleSelectedOrder = (orderId) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const toggleSelectAll = () => {
    setSelectedOrderIds((prev) =>
      prev.length === orders.length ? [] : orders.map((order) => order.id),
    );
  };

  const applyBulkStatus = async () => {
    if (selectedOrderIds.length === 0) {
      toast.error("Select at least one order");
      return;
    }

    await updateOrderStatus(selectedOrderIds, bulkStatus);
    setSelectedOrderIds([]);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <h1 className="mb-5 text-2xl text-slate-500">
        Store <span className="font-medium text-slate-800">Orders</span>
      </h1>
      {orders.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
          <p className="text-sm text-slate-600">
            {selectedOrderIds.length} selected
          </p>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="filter-control rounded-full px-4 py-2 text-sm text-slate-700 outline-none"
          >
            <option value="ORDER_PLACED">ORDER_PLACED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
          <button
            type="button"
            onClick={() =>
              toast.promise(applyBulkStatus(), {
                loading: "Updating orders...",
              })
            }
            className="control-button control-button--primary rounded-full px-4 py-2 text-sm font-medium text-white"
          >
            Apply to selected
          </button>
        </div>
      )}
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white/85 shadow-sm">
          <table className="w-full min-w-[1080px] text-left text-sm text-gray-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-gray-700">
              <tr>
                {[
                  "",
                  "Sr. No.",
                  "Customer",
                  "Products",
                  "Total",
                  "Payment",
                  "Paid",
                  "Coupon",
                  "Status",
                  "Date",
                ].map((heading, i) => (
                  <th key={i} className="px-4 py-3">
                    {heading === "" ? (
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.length === orders.length}
                        onChange={toggleSelectAll}
                        aria-label="Select all orders"
                      />
                    ) : (
                      heading
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="cursor-pointer transition-colors duration-150 hover:bg-gray-50"
                  onClick={() => openModal(order)}
                >
                  <td
                    className="px-4 py-3"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.includes(order.id)}
                      onChange={() => toggleSelectedOrder(order.id)}
                      aria-label={`Select order ${order.id}`}
                    />
                  </td>
                  <td className="pl-6 text-green-600">{index + 1}</td>
                  <td className="px-4 py-3">{order.user?.name}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-3">
                      {order.orderItems.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                            <Image
                              src={
                                item.product.images?.[0]?.src ||
                                item.product.images?.[0]
                              }
                              alt={item.product?.name || "Product"}
                              width={48}
                              height={48}
                              className="h-10 w-auto rounded-lg object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-800">
                              {item.product?.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Qty {item.quantity} · ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.orderItems.length > 2 && (
                        <p className="text-xs font-medium text-slate-500">
                          +{order.orderItems.length - 2} more item
                          {order.orderItems.length - 2 === 1 ? "" : "s"}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    ${order.total}
                  </td>
                  <td className="px-4 py-3">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.isPaid ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {order.isCouponUsed ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        {order.coupon?.code}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div className="flex min-w-40 flex-col gap-2">
                      <OrderStatusBadge
                        status={order.status}
                        className="cursor-pointer ring-1 ring-slate-200 transition hover:ring-blue-300"
                      />
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        className="cursor-pointer rounded-md border border-blue-200 bg-blue-50/70 text-sm text-slate-700 focus:ring focus:ring-blue-200"
                      >
                        <option value="ORDER_PLACED">ORDER_PLACED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedOrder && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-sm text-slate-700 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-lg"
          >
            <h2 className="mb-4 text-center text-xl font-semibold text-slate-900">
              Order Details
            </h2>

            <div className="mb-4">
              <h3 className="mb-2 font-semibold">Customer Details</h3>
              <p>
                <span className="text-green-700">Name:</span>{" "}
                {selectedOrder.user?.name}
              </p>
              <p>
                <span className="text-green-700">Email:</span>{" "}
                {selectedOrder.user?.email}
              </p>
              <p>
                <span className="text-green-700">Phone:</span>{" "}
                {selectedOrder.address?.phone}
              </p>
              <p>
                <span className="text-green-700">Address:</span>{" "}
                {`${selectedOrder.address?.street}, ${selectedOrder.address?.city}, ${selectedOrder.address?.state}, ${selectedOrder.address?.zip}, ${selectedOrder.address?.country}`}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-semibold">Products</h3>
              <div className="space-y-2">
                {selectedOrder.orderItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded border border-slate-100 p-2 shadow"
                  >
                    <img
                      src={
                        item.product.images?.[0].src || item.product.images?.[0]
                      }
                      alt={item.product?.name}
                      className="h-16 w-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-slate-800">{item.product?.name}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p>
                <span className="text-green-700">Payment Method:</span>{" "}
                {selectedOrder.paymentMethod}
              </p>
              <p>
                <span className="text-green-700">Paid:</span>{" "}
                {selectedOrder.isPaid ? "Yes" : "No"}
              </p>
              {selectedOrder.isCouponUsed && (
                <p>
                  <span className="text-green-700">Coupon:</span>{" "}
                  {selectedOrder.coupon.code} ({selectedOrder.coupon.discount}%
                  off)
                </p>
              )}
              <p>
                <span className="text-green-700">Status:</span>{" "}
                <OrderStatusBadge status={selectedOrder.status} className="ml-2" />
              </p>
              <p>
                <span className="text-green-700">Order Date:</span>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="rounded bg-slate-200 px-4 py-2 hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
