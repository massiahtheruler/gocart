import { CheckCircle2, Copy, PlusIcon, SquarePenIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import AddressModal from "./AddressModal";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Show, useAuth, useClerk, useUser } from "@clerk/nextjs";
import { fetchCart } from "@/lib/features/cart/cartSlice";
import {
  clearSelectedDealCode,
  getSelectedDealCode,
  setSelectedDealCode,
} from "@/lib/selectedDeal";

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
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [savedDealCode, setSavedDealCode] = useState("");

  const formatCurrency = (amount) => `${currency}${amount.toFixed(2)}`;
  const discountAmount = coupon ? (coupon.discount / 100) * totalPrice : 0;
  const discountedSubtotal = Math.max(totalPrice - discountAmount, 0);
  const standardShipping =
    discountedSubtotal >= freeShippingThreshold ? 0 : shippingFee;
  const standardTotal = discountedSubtotal + standardShipping;

  useEffect(() => {
    const fetchAvailableCoupons = async () => {
      try {
        const { data } = await axios.get("/api/coupon");
        const activeCoupons = (data.coupons || []).filter(
          (item) => item.status === "active",
        );
        setAvailableCoupons(activeCoupons);

        const persistedCode = getSelectedDealCode();
        setSavedDealCode(persistedCode);
        if (!persistedCode) return;

        const selectedCoupon = activeCoupons.find(
          (item) => item.code === persistedCode,
        );

        if (selectedCoupon) {
          setCoupon(selectedCoupon);
          setCouponCodeInput(selectedCoupon.code);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAvailableCoupons();
  }, []);

  useEffect(() => {
    const syncSelectedDeal = () => {
      setSavedDealCode(getSelectedDealCode());
    };

    syncSelectedDeal();
    window.addEventListener("gocart:selected-deal", syncSelectedDeal);

    return () =>
      window.removeEventListener("gocart:selected-deal", syncSelectedDeal);
  }, []);

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
      setSelectedDealCode(data.coupon.code);
      setSavedDealCode(data.coupon.code);
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

  const handleCouponSelect = async (selectedCoupon) => {
    setCouponCodeInput(selectedCoupon.code);
    setCoupon(selectedCoupon);
    setSelectedDealCode(selectedCoupon.code);
    setSavedDealCode(selectedCoupon.code);

    try {
      await navigator.clipboard.writeText(selectedCoupon.code);
    } catch {}

    toast.success(`Applied ${selectedCoupon.code}`);
  };
  return (
    <div className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7">
      <h2 className="text-xl font-medium text-slate-600">Payment Summary</h2>
      {!coupon && savedDealCode && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800 shadow-[0_14px_30px_rgba(16,185,129,0.12)]">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
            <div className="flex-1">
              <p className="font-medium">Saved deal ready for checkout</p>
              <p className="mt-1 text-xs text-emerald-700/90">
                <span className="font-semibold">{savedDealCode}</span> will be
                applied automatically once it is validated.
              </p>
            </div>
          </div>
        </div>
      )}
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
                aria-label="Select saved address"
                className="filter-control w-full rounded-2xl px-4 py-3 my-3 text-slate-700 outline-none"
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
              type="button"
              className="control-button control-button--soft mt-1 inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium"
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
            <button
              type="button"
              aria-label="Remove applied coupon"
              onClick={() => {
                setCoupon(null);
                setCouponCodeInput("");
                clearSelectedDealCode();
                setSavedDealCode("");
              }}
              className="rounded-full p-1 transition hover:text-red-700"
            >
              <XIcon size={18} />
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            <form
              onSubmit={(e) =>
                toast.promise(handleCouponCode(e), {
                  loading: "Checking Coupon...",
                })
              }
              className="flex justify-center gap-3"
            >
              <input
                aria-label="Coupon code"
                onChange={(e) => setCouponCodeInput(e.target.value)}
                value={couponCodeInput}
                type="text"
                placeholder="Coupon Code"
                className="filter-control w-full rounded-2xl px-4 py-2.5 text-slate-700 outline-none"
              />
              <button
                type="submit"
                className="control-button control-button--primary rounded-2xl px-4 py-2.5 text-white"
              >
                Apply
              </button>
            </form>

            {availableCoupons.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Available deals
                </p>
                <div className="space-y-2">
                  {availableCoupons.slice(0, 3).map((availableCoupon) => (
                    <button
                      key={availableCoupon.code}
                      type="button"
                      onClick={() => handleCouponSelect(availableCoupon)}
                      className="filter-panel flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition hover:-translate-y-0.5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {availableCoupon.code}
                        </p>
                        <p className="text-xs text-slate-500">
                          {availableCoupon.discount}% off
                          {availableCoupon.forMember ? " • Plus only" : ""}
                          {availableCoupon.forNewUser ? " • New user" : ""}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                        <Copy size={12} />
                        Use
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
        type="button"
        onClick={(e) =>
          toast.promise(handlePlaceOrder(e), { loading: "placing Order..." })
        }
        className="control-button control-button--primary w-full rounded-2xl py-3 text-white"
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
