'use client'
import ProductCard from "@/components/ProductCard";
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState();
    const products = useSelector(state => state.product.list);

    const relatedProducts = useMemo(() => {
        if (!product) return []

        return products
            .filter((item) => item.id !== product.id)
            .filter((item) => item.category === product.category || item.storeId === product.storeId)
            .sort((a, b) => {
                const aScore = a.rating.length
                    ? a.rating.reduce((sum, item) => sum + item.rating, 0) / a.rating.length
                    : 0
                const bScore = b.rating.length
                    ? b.rating.reduce((sum, item) => sum + item.rating, 0) / b.rating.length
                    : 0
                return bScore - aScore
            })
            .slice(0, 4)
    }, [product, products])

    const fetchProduct = async () => {
        const product = products.find((product) => product.id === productId);
        setProduct(product);
    }

    useEffect(() => {
        if (products.length > 0) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [productId,products]);

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrums */}
                <div className="  text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product?.category}
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}

                {relatedProducts.length > 0 && (
                    <div className="my-20">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800">Related products</h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Similar picks based on category and product ratings.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 sm:flex sm:flex-wrap xl:gap-12">
                            {relatedProducts.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
