'use client'
import { Suspense } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon, SlidersHorizontal, Tag } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

 function ShopContent() {

    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort')
    const sale = searchParams.get('sale')
    const minRating = searchParams.get('minRating')
    const router = useRouter()

    const products = useSelector(state => state.product.list)

    let filteredProducts = [...products];

    if (search) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (minRating) {
        filteredProducts = filteredProducts.filter(product => {
            const average = product.rating.length
                ? product.rating.reduce((sum, item) => sum + item.rating, 0) / product.rating.length
                : 0;
            return average >= Number(minRating);
        });
    }

    if (sale === '1') {
        filteredProducts = filteredProducts.filter(product => product.mrp > product.price);
    }

    if (sort === 'rating' || sort === 'rating-desc') {
        filteredProducts.sort((a, b) => {
            const aAverage = a.rating.length
                ? a.rating.reduce((sum, item) => sum + item.rating, 0) / a.rating.length
                : 0;
            const bAverage = b.rating.length
                ? b.rating.reduce((sum, item) => sum + item.rating, 0) / b.rating.length
                : 0;
            return bAverage - aAverage;
        });
    } else if (sort === 'rating-asc') {
        filteredProducts.sort((a, b) => {
            const aAverage = a.rating.length
                ? a.rating.reduce((sum, item) => sum + item.rating, 0) / a.rating.length
                : 0;
            const bAverage = b.rating.length
                ? b.rating.reduce((sum, item) => sum + item.rating, 0) / b.rating.length
                : 0;
            return aAverage - bAverage;
        });
    } else if (sort === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === 'latest') {
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sale === '1' && !sort) {
        filteredProducts.sort((a, b) => ((b.mrp - b.price) / b.mrp) - ((a.mrp - a.price) / a.mrp));
    }

    const headingLabel = category
        ? category
        : sale === '1'
            ? 'Discounted'
            : sort === 'rating'
                ? 'Top Rated'
                : 'All';

    const updateQuery = (updates) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(updates).forEach(([key, value]) => {
            if (!value) {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })

        const query = params.toString()
        router.push(query ? `/shop?${query}` : '/shop')
    }

    const appliedFilters = [
        category && { label: category },
        search && { label: `Search: ${search}` },
        sale === '1' && { label: 'On sale' },
        (sort === 'rating' || sort === 'rating-desc') && { label: 'Highest rated' },
        sort === 'rating-asc' && { label: 'Lowest rated' },
        sort === 'price-low' && { label: 'Price: low to high' },
        sort === 'price-high' && { label: 'Price: high to low' },
        sort === 'latest' && { label: 'Latest first' },
        minRating && { label: `${minRating}+ stars` },
    ].filter(Boolean);

    return (
        <div className="min-h-[70vh] mx-6">
            <div className=" max-w-7xl mx-auto">
                <div className="my-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 flex items-center gap-2 cursor-pointer"> {(search || category || sale === '1' || sort) && <MoveLeftIcon size={20} />}  {headingLabel} <span className="text-slate-700 font-medium">Products</span></h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Showing {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} from the current filter set.
                            </p>
                        </div>
                        {(search || category || sale === '1' || sort) && (
                            <button
                                type="button"
                                onClick={() => router.push('/shop')}
                                className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                            >
                                <SlidersHorizontal size={16} />
                                Clear filters
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 rounded-[1.4rem] border border-slate-200/80 bg-slate-50/80 p-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            <label className="text-sm font-medium text-slate-600">
                                Sort
                            </label>
                            <select
                                value={sort || ""}
                                onChange={(e) => updateQuery({ sort: e.target.value || null })}
                                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none"
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
                            <label className="text-sm font-medium text-slate-600">
                                Rating
                            </label>
                            <select
                                value={minRating || ""}
                                onChange={(e) => updateQuery({ minRating: e.target.value || null })}
                                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none"
                            >
                                <option value="">Any rating</option>
                                <option value="4">4 stars & up</option>
                                <option value="3">3 stars & up</option>
                            </select>

                            <button
                                type="button"
                                onClick={() => updateQuery({ sale: sale === '1' ? null : '1' })}
                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                    sale === '1'
                                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-200 bg-white text-slate-700'
                                }`}
                            >
                                On sale only
                            </button>
                        </div>
                    </div>

                    {appliedFilters.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {appliedFilters.map((filter) => (
                                <span key={filter.label} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                    <Tag size={12} />
                                    {filter.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                        {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
                ) : (
                    <div className="mb-32 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                        <p className="text-xl font-medium text-slate-700">No products match this filter</p>
                        <p className="mt-2 text-sm">Try a different category, remove a filter, or browse the full catalog.</p>
                    </div>
                )}
            </div>
        </div>
    )
}


export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
