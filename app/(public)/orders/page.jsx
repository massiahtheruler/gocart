"use client";

import PageTitle from "@/components/PageTitle";
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setRatings } from "@/lib/features/rating/ratingSlice";
import { PackageCheck, Sparkles, Truck } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get("success") === "true";
    setPaymentSuccess(isSuccess);
    if (isSuccess) {
      toast.success("Payment completed successfully.");
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const [ordersResponse, ratingsResponse] = await Promise.all([
          axios.get("/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("/api/ratings", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setOrders(ordersResponse.data.orders);
        dispatch(setRatings(ratingsResponse.data.ratings || []));
      } catch (error) {
        toast.error(error?.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      if (user) {
        fetchOrders();
      } else {
        setLoading(false);
        router.push("/");
      }
    }
  }, [isLoaded, user, getToken, router, dispatch]);

  if (!isLoaded || loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-[70vh] px-6 pb-24">
      {orders.length > 0 ? (
        <div className="mx-auto my-16 max-w-7xl space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm">
            <PageTitle
              heading="My Orders"
              text={`Showing total ${orders.length} orders`}
              linkText={"Go to home"}
            />

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <PackageCheck className="text-emerald-500" size={18} />
                  <p className="text-sm font-medium text-slate-700">
                    Total orders
                  </p>
                </div>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {orders.length}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Truck className="text-sky-500" size={18} />
                  <p className="text-sm font-medium text-slate-700">
                    In progress
                  </p>
                </div>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {
                    orders.filter((order) =>
                      ["ORDER_PLACED", "PROCESSING", "SHIPPED"].includes(
                        order.status,
                      ),
                    ).length
                  }
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-violet-500" size={18} />
                  <p className="text-sm font-medium text-slate-700">
                    Delivered
                  </p>
                </div>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {orders.filter((order) => order.status === "DELIVERED").length}
                </p>
              </div>
            </div>

            {paymentSuccess && (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                Payment completed successfully. Your order is now in the system.
              </div>
            )}
          </div>

          <div className="space-y-5">
            {orders.map((order) => (
              <OrderItem order={order} key={order.id} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[80vh] items-center justify-center px-6 text-slate-400">
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 px-10 py-14 text-center shadow-sm">
            <h1 className="text-2xl font-semibold sm:text-4xl">
              You have no orders
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Orders you place will appear here with live status updates and
              review options.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
