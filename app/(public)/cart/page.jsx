'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { CheckCircle2, TicketPercent, Trash2Icon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatProductCategories } from "@/lib/productCategories";
import Link from "next/link";
import { clearSelectedDealCode, getSelectedDealCode } from "@/lib/selectedDeal";

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    
    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedDealCode, setSelectedDealCode] = useState("");

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                cartArray.push({
                    ...product,
                    quantity: value,
                });
                setTotalPrice(prev => prev + product.price * value);
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    useEffect(() => {
        const syncSelectedDeal = () => {
            setSelectedDealCode(getSelectedDealCode());
        };

        syncSelectedDeal();
        window.addEventListener("gocart:selected-deal", syncSelectedDeal);

        return () => {
            window.removeEventListener("gocart:selected-deal", syncSelectedDeal);
        };
    }, []);

    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-6 text-slate-800">

            <div className="max-w-7xl mx-auto ">
                {/* Title */}
                <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" />

                {selectedDealCode && (
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-100/80 px-5 py-4 shadow-[0_20px_40px_rgba(16,185,129,0.12)]">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-700">
                                <TicketPercent size={18} />
                            </div>
                            <div>
                                <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    <CheckCircle2 size={16} className="text-emerald-600" />
                                    Selected deal saved
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    <span className="font-semibold text-emerald-700">{selectedDealCode}</span> is queued for checkout and will be validated automatically.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/deals"
                                className="control-button control-button--soft rounded-full px-4 py-2 text-sm font-medium"
                            >
                                View deals
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    clearSelectedDealCode();
                                    setSelectedDealCode("");
                                }}
                                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:text-red-600"
                            >
                                <XIcon size={14} />
                                Clear
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-start justify-between gap-5 max-lg:flex-col">

                    <table className="w-full max-w-4xl text-slate-600 table-auto">
                        <thead>
                            <tr className="max-sm:text-sm">
                                <th className="text-left">Product</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th className="max-md:hidden">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cartArray.map((item, index) => (
                                    <tr key={index} className="space-x-2">
                                        <td className="flex gap-3 my-4">
                                            <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                                                <Image src={item.images[0]} className="h-14 w-auto" alt="" width={45} height={45} />
                                            </div>
                                            <div>
                                                <p className="max-sm:text-sm">{item.name}</p>
                                                <p className="text-xs text-slate-500">{formatProductCategories(item.category)}</p>
                                                <p>{currency}{item.price}</p>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Counter productId={item.id} />
                                        </td>
                                        <td className="text-center">{currency}{(item.price * item.quantity).toLocaleString()}</td>
                                        <td className="text-center max-md:hidden">
                                            <button onClick={() => handleDeleteItemFromCart(item.id)} className=" text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all">
                                                <Trash2Icon size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <OrderSummary totalPrice={totalPrice} items={cartArray} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
        </div>
    )
}
