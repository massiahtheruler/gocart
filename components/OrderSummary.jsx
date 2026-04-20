import { PlusIcon, SquarePenIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import AddressModal from "./AddressModal";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Show, useAuth, useClerk, useUser } from "@clerk/nextjs";
import { fetchCart } from "@/lib/features/cart/cartSlice";

const OrderSummary = ({ totalPrice, items }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";
  const freeShippingThreshold = 50;
  const shippingFee = 5;

  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { openSignIn } = useClerk();
  const dispatch = useDispatch();

  const addressList = useSelector((state) =>
    (state.address.list || []).filter(Boolean),
  );

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [coupon, setCoupon] = useState(null);

  const formatCurrency = (amount) => `${currency}${amount.toFixed(2)}`;
  const discountAmount = coupon ? (coupon.discount / 100) * totalPrice : 0;
  const discountedSubtotal = Math.max(totalPrice - discountAmount, 0);
  const standardShipping =
    discountedSubtotal >= freeShippingThreshold ? 0 : shippingFee;
  const standardTotal = discountedSubtotal + standardShipping;

  const handleCouponCode = async (event) => {
    event.preventDefault();
    try {
      if (!user) {
        openSignIn();
        return;
      }
      const token = await getToken();
      const { data } = await axios.post(
        "/api/coupon",
        {
          code: couponCodeInput,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCoupon(data.coupon);
      toast.success("Coupon applied!");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        openSignIn();
        return;
      }
      if (!selectedAddress) {
        return toast("Please select an address");
      }
      const orderData = {
        addressId: selectedAddress.id,
        items,
        paymentMethod,
      };
      if (coupon) {
        orderData.couponCode = coupon.code;
      }
      const token = await getToken();
      const { data } = await axios.post("/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (paymentMethod === "STRIPE") {
        window.location.href = data.session.url;
      } else {
        toast.success(data.message);
        router.push("/orders");
        dispatch(fetchCart({ getToken }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };
  return (
    <div className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7">
      <h2 className="text-xl font-medium text-slate-600">Payment Summary</h2>
      <p className="text-slate-400 text-xs my-4">Payment Method</p>
      <div className="flex gap-2 items-center">
        <input
          type="radio"
          id="COD"
          name="payment"
          onChange={() => setPaymentMethod("COD")}
          checked={paymentMethod === "COD"}
          className="accent-gray-500"
        />
        <label htmlFor="COD" className="cursor-pointer">
          COD
        </label>
      </div>
      <div className="flex gap-2 items-center mt-1">
        <input
          type="radio"
          id="STRIPE"
          name="payment"
          onChange={() => setPaymentMethod("STRIPE")}
          checked={paymentMethod === "STRIPE"}
          className="accent-gray-500"
        />
        <label htmlFor="STRIPE" className="cursor-pointer">
          Stripe Payment
        </label>
      </div>
      <div className="my-4 py-4 border-y border-slate-200 text-slate-400">
        <p>Address</p>
        {selectedAddress ? (
          <div className="flex gap-2 items-center">
            <p>
              {selectedAddress.name}, {selectedAddress.city},{" "}
              {selectedAddress.state}, {selectedAddress.zip}
            </p>
            <SquarePenIcon
              onClick={() => setSelectedAddress(null)}
              className="cursor-pointer"
              size={18}
            />
          </div>
        ) : (
          <div>
            {addressList.length > 0 && (
              <select
                className="border border-slate-400 p-2 w-full my-3 outline-none rounded"
                onChange={(e) => {
                  const selectedIndex = e.target.value;
                  setSelectedAddress(
                    selectedIndex === "" ? null : addressList[selectedIndex],
                  );
                }}
              >
                <option value="">Select Address</option>
                {addressList.map((address, index) => (
                  <option key={address.id || index} value={index}>
                    {address.name}, {address.city}, {address.state},{" "}
                    {address.zip}
                  </option>
                ))}
              </select>
            )}
            <button
              className="flex items-center gap-1 text-slate-600 mt-1"
              onClick={() => setShowAddressModal(true)}
            >
              Add Address <PlusIcon size={18} />
            </button>
          </div>
        )}
      </div>
      <div className="pb-4 border-b border-slate-200">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1 text-slate-400">
            <p>Subtotal:</p>
            <p>Shipping:</p>
            {coupon && <p>Coupon:</p>}
          </div>
          <div className="flex flex-col gap-1 font-medium text-right">
            <p>{formatCurrency(totalPrice)}</p>
            <p>
              <Show
                when={{ plan: "plus" }}
                fallback={
                  standardShipping === 0
                    ? "Free"
                    : formatCurrency(standardShipping)
                }
              >
                Free
              </Show>
            </p>
            {coupon && <p>{`-${formatCurrency(discountAmount)}`}</p>}
          </div>
        </div>
        {coupon ? (
          <div className="w-full flex items-center justify-center gap-2 text-xs mt-2">
            <p>
              Code:{" "}
              <span className="font-semibold ml-1">
                {coupon.code.toUpperCase()}
              </span>
            </p>
            <p>{coupon.description}</p>
            <XIcon
              size={18}
              onClick={() => setCoupon(null)}
              className="hover:text-red-700 transition cursor-pointer"
            />
          </div>
        ) : (
          <form
            onSubmit={(e) =>
              toast.promise(handleCouponCode(e), {
                loading: "Checking Coupon...",
              })
            }
            className="flex justify-center gap-3 mt-3"
          >
            <input
              onChange={(e) => setCouponCodeInput(e.target.value)}
              value={couponCodeInput}
              type="text"
              placeholder="Coupon Code"
              className="border border-slate-400 p-1.5 rounded w-full outline-none"
            />
            <button className="bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all">
              Apply
            </button>
          </form>
        )}
      </div>
      <div className="flex justify-between py-4">
        <p>Total:</p>
        <p className="font-medium text-right">
          <Show
            when={{ plan: "plus" }}
            fallback={formatCurrency(standardTotal)}
          >
            {formatCurrency(discountedSubtotal)}
          </Show>
        </p>
      </div>
      <button
        onClick={(e) =>
          toast.promise(handlePlaceOrder(e), { loading: "placing Order..." })
        }
        className="w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all"
      >
        Place Order
      </button>

      {showAddressModal && (
        <AddressModal setShowAddressModal={setShowAddressModal} />
      )}
    </div>
  );
};

export default OrderSummary;
