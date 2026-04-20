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
    <div className="min-h-[70vh] mx-6">
      {orders.length > 0 ? (
        <div className="my-20 max-w-7xl mx-auto">
          <PageTitle
            heading="My Orders"
            text={`Showing total ${orders.length} orders`}
            linkText={"Go to home"}
          />
          {paymentSuccess && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Payment completed successfully. Your order is now in the system.
            </div>
          )}

          <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
            <thead>
              <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                <th className="text-left">Product</th>
                <th className="text-center">Total Price</th>
                <th className="text-left">Address</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderItem order={order} key={order.id} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
          <h1 className="text-2xl sm:text-4xl font-semibold">
            You have no orders
          </h1>
        </div>
      )}
    </div>
  );
}
