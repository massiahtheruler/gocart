'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import RatingModal from "./RatingModal";
import Rating from "./Rating";
import axios from "axios";

const ProductDetails = ({ product }) => {

    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const cart = useSelector(state => state.cart.cartItems);
    const { ratings } = useSelector(state => state.rating);
    const dispatch = useDispatch();
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const { getToken } = useAuth();

    const router = useRouter()

    const [mainImage, setMainImage] = useState(product.images[0]);
    const [deliveredOrderId, setDeliveredOrderId] = useState(null);
    const [ratingModal, setRatingModal] = useState(null);

    const addToCartHandler = () => {
        if (!user) {
            openSignIn();
            return;
        }
        dispatch(addToCart({ productId }))
    }

    const handleCartClick = () => {
        if (!user) {
            openSignIn();
            return;
        }
        if (!cart[productId]) {
            addToCartHandler();
            return;
        }
        router.push('/cart')
    }

    const averageRating = product.rating.length
        ? product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length
        : 0;

    const existingReview = useMemo(() => (
        ratings.find((item) => item.productId === product.id)
    ), [ratings, product.id]);

    useEffect(() => {
        const fetchEligibility = async () => {
            try {
                const token = await getToken();
                const { data } = await axios.get('/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                })

                const matchingDeliveredOrder = data.orders.find((order) =>
                    order.status === 'DELIVERED' &&
                    order.orderItems.some((item) => item.product.id === product.id),
                )

                setDeliveredOrderId(matchingDeliveredOrder?.id || null)
            } catch (error) {
                console.error(error)
            }
        }

        if (user) {
            fetchEligibility()
        } else {
            setDeliveredOrderId(null)
        }
    }, [user, getToken, product.id])
    
    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product.images.map((image, index) => (
                        <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer">
                            <Image src={image} className="group-hover:scale-103 group-active:scale-95 transition" alt="" width={45} height={45} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg ">
                    <Image src={mainImage} alt="" width={250} height={250} />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>
                <div className='mt-2 flex items-center gap-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                    ))}
                    <span className="text-sm font-medium text-slate-600">
                        {product.rating.length ? averageRating.toFixed(1) : "New"}
                    </span>
                    <span className="rating-count-pill">
                        {product.rating.length} {product.rating.length === 1 ? "review" : "reviews"}
                    </span>
                </div>
                {deliveredOrderId && (
                    <div className="mt-4 flex items-center gap-3">
                        {existingReview ? (
                            <>
                                <Rating value={existingReview.rating} />
                                <button
                                    type="button"
                                    onClick={() => setRatingModal(existingReview)}
                                    className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
                                >
                                    Edit your review
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setRatingModal({ orderId: deliveredOrderId, productId: product.id })}
                                className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                            >
                                Write a review
                            </button>
                        )}
                    </div>
                )}
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p> {currency}{product.price} </p>
                    <p className="text-xl text-slate-500 line-through">{currency}{product.mrp}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={14} />
                    <p>Save {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}% right now</p>
                </div>
                <div className="flex items-end gap-5 mt-10">
                    {
                        cart[productId] && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                                <Counter productId={productId} />
                            </div>
                        )
                    }
                    <button onClick={handleCartClick} className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition">
                        {!cart[productId] ? 'Add to Cart' : 'View Cart'}
                    </button>
                </div>
                <hr className="border-gray-300 my-5" />
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"> <EarthIcon className="text-slate-400" /> Free shipping worldwide </p>
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> 100% Secured Payment </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Trusted by top brands </p>
                </div>

            </div>
            {ratingModal && (
                <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />
            )}
        </div>
    )
}

export default ProductDetails
