'use client'
import ProductCard from "@/components/ProductCard"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, MailIcon, MapPinIcon, SlidersHorizontal, Tag, TicketPercent } from "lucide-react"
import Loading from "@/components/Loading"
import Image from "next/image"
import axios from "axios"
import toast from "react-hot-toast"
import Link from "next/link"

export default function StoreShop() {

    const { username } = useParams()
    const [products, setProducts] = useState([])
    const [storeInfo, setStoreInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sort, setSort] = useState("")
    const [saleOnly, setSaleOnly] = useState(false)
    const [minRating, setMinRating] = useState("")

    const fetchStoreData = async () => {
        try {
            const { data } = await axios.get(`/api/store/data?username=${username}`)
            setStoreInfo(data.store)
            setProducts(data.store?.Product || [])
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
            setStoreInfo(null)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (username) {
            fetchStoreData()
        }
    }, [username])

    const filteredProducts = useMemo(() => {
        let nextProducts = [...products]

        if (saleOnly) {
            nextProducts = nextProducts.filter((product) => product.mrp > product.price)
        }

        if (minRating) {
            nextProducts = nextProducts.filter((product) => {
                const average = product.rating.length
                    ? product.rating.reduce((sum, item) => sum + item.rating, 0) / product.rating.length
                    : 0
                return average >= Number(minRating)
            })
        }

        if (sort === 'rating-desc') {
            nextProducts.sort((a, b) => {
                const aAverage = a.rating.length
                    ? a.rating.reduce((sum, item) => sum + item.rating, 0) / a.rating.length
                    : 0
                const bAverage = b.rating.length
                    ? b.rating.reduce((sum, item) => sum + item.rating, 0) / b.rating.length
                    : 0
                return bAverage - aAverage
            })
        } else if (sort === 'rating-asc') {
            nextProducts.sort((a, b) => {
                const aAverage = a.rating.length
                    ? a.rating.reduce((sum, item) => sum + item.rating, 0) / a.rating.length
                    : 0
                const bAverage = b.rating.length
                    ? b.rating.reduce((sum, item) => sum + item.rating, 0) / b.rating.length
                    : 0
                return aAverage - bAverage
            })
        } else if (sort === 'price-low') {
            nextProducts.sort((a, b) => a.price - b.price)
        } else if (sort === 'price-high') {
            nextProducts.sort((a, b) => b.price - a.price)
        } else if (sort === 'latest') {
            nextProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }

        return nextProducts
    }, [products, saleOnly, minRating, sort])

    return !loading ? (
        <div className="min-h-[70vh] mx-6">

            {/* Store Info Banner */}
            {storeInfo && (
                <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
                    <Image
                        src={storeInfo.logo}
                        alt={storeInfo.name}
                        className="size-32 sm:size-38 object-cover border-2 border-slate-100 rounded-md"
                        width={200}
                        height={200}
                    />
                    <div className="text-center md:text-left">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                                <h1 className="text-3xl font-semibold text-slate-800">{storeInfo.name}</h1>
                                <p className="text-sm text-slate-600 mt-2 max-w-lg">{storeInfo.description}</p>
                            </div>
                            <Link
                                href="/deals"
                                className="control-button control-button--soft glass-sheen inline-flex items-center gap-2 self-center rounded-full px-5 py-3 text-sm font-medium md:self-start"
                            >
                                <TicketPercent size={16} />
                                Available Deals
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="text-xs text-slate-500 mt-4 space-y-1"></div>
                        <div className="space-y-2 text-sm text-slate-500">
                            <div className="flex items-center">
                                <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
                                <span>{storeInfo.address}</span>
                            </div>
                            <div className="flex items-center">
                                <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
                                <span>{storeInfo.email}</span>
                            </div>
                           
                        </div>
                    </div>
                </div>
            )}

            {/* Products */}
            <div className=" max-w-7xl mx-auto mb-40">
                <h1 className="text-2xl mt-12">Shop <span className="text-slate-800 font-medium">Products</span></h1>
                <div className="filter-panel mt-5 flex flex-col gap-3 rounded-[1.5rem] p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="text-sm font-medium text-slate-600">Sort</label>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="filter-control rounded-full px-4 py-2 text-sm text-slate-700 outline-none"
                        >
                            <option value="">Recommended</option>
                            <option value="rating-desc">Rating: high to low</option>
                            <option value="rating-asc">Rating: low to high</option>
                            <option value="price-low">Price: low to high</option>
                            <option value="price-high">Price: high to low</option>
                            <option value="latest">Latest arrivals</option>
                        </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <label className="text-sm font-medium text-slate-600">Rating</label>
                        <select
                            value={minRating}
                            onChange={(e) => setMinRating(e.target.value)}
                            className="filter-control rounded-full px-4 py-2 text-sm text-slate-700 outline-none"
                        >
                            <option value="">Any rating</option>
                            <option value="4">4 stars & up</option>
                            <option value="3">3 stars & up</option>
                        </select>

                        <button
                            type="button"
                            onClick={() => setSaleOnly((prev) => !prev)}
                            className={`filter-toggle-control rounded-full border px-4 py-2 text-sm font-medium ${
                                saleOnly
                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 bg-white text-slate-700'
                            }`}
                        >
                            On sale only
                        </button>

                        {(sort || minRating || saleOnly) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSort("")
                                    setMinRating("")
                                    setSaleOnly(false)
                                }}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                            >
                                <SlidersHorizontal size={16} />
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {saleOnly && (
                        <span className="filter-chip inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            <Tag size={12} />
                            On sale
                        </span>
                    )}
                    {minRating && (
                        <span className="filter-chip inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            <Tag size={12} />
                            {minRating}+ stars
                        </span>
                    )}
                    {sort && (
                        <span className="filter-chip inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            <Tag size={12} />
                            {sort === 'rating-desc' && 'Highest rated'}
                            {sort === 'rating-asc' && 'Lowest rated'}
                            {sort === 'price-low' && 'Price: low to high'}
                            {sort === 'price-high' && 'Price: high to low'}
                            {sort === 'latest' && 'Latest arrivals'}
                        </span>
                    )}
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="mx-auto mt-5 grid grid-cols-1 gap-6 min-[500px]:grid-cols-2 xl:grid-cols-4 xl:gap-12">
                        {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
                ) : (
                    <div className="mt-8 rounded-[1.5rem] border border-dashed border-slate-200 bg-white/70 px-6 py-14 text-center text-slate-400">
                        No products match this store filter set.
                    </div>
                )}
            </div>
        </div>
    ) : <Loading />
}
