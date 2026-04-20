'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [cardTilt, setCardTilt] = useState({
        rating: { transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)' },
        sale: { transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)' },
    })

    const handleTiltMove = (key, event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height
        const rotateY = (x - 0.5) * 12
        const rotateX = (0.5 - y) * 10

        setCardTilt((prev) => ({
            ...prev,
            [key]: {
                transform: `perspective(1400px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px) scale(1.01)`,
            },
        }))
    }

    const resetTilt = (key) => {
        setCardTilt((prev) => ({
            ...prev,
            [key]: {
                transform: 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
            },
        }))
    }

    return (
        <div className='mx-6'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
                <div className='hero-stage relative flex-1 flex flex-col overflow-hidden bg-green-200 rounded-3xl xl:min-h-100 group'>
                    <div className='p-5 sm:p-16'>
                        <div className='inline-flex items-center gap-3 bg-green-300 text-green-600 pr-4 p-1 rounded-full text-xs sm:text-sm'>
                            <span className='bg-green-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>NEWS</span> Free Shipping on Orders Above $50! <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-gradient-to-r from-slate-600 to-[#A0FF74] bg-clip-text text-transparent max-w-xs  sm:max-w-md'>
                            Gadgets you'll love. Prices you'll trust.
                        </h2>
                        <div className='text-slate-800 text-sm font-medium mt-4 sm:mt-8'>
                            <p>Starts from</p>
                            <p className='text-3xl'>{currency}4.90</p>
                        </div>
                        <Link href="/shop?category=Electronics" className='inline-block bg-slate-800 text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-slate-900 hover:scale-103 active:scale-95 transition'>LEARN MORE</Link>
                    </div>
                    <div className='hero-model-glow pointer-events-none absolute bottom-8 right-8 hidden h-48 w-48 rounded-full sm:block md:right-12' />
                    <Image
                        className='hero-model relative z-10 sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm'
                        src={assets.hero_model_img}
                        alt=""
                        priority
                    />
                </div>
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <Link
                        href="/shop?sort=rating"
                        className='showroom-card glass-sheen flex-1 flex items-center justify-between w-full rounded-3xl bg-gradient-to-br from-orange-100 via-orange-200 to-amber-100 p-6 px-8 group will-change-transform'
                        style={cardTilt.rating}
                        onMouseMove={(event) => handleTiltMove('rating', event)}
                        onMouseLeave={() => resetTilt('rating')}
                    >
                        <div className='relative z-10 [transform:translateZ(26px)]'>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40'>Best products</p>
                            <p className='mt-4 flex items-center gap-1 text-slate-700'>View more <ArrowRightIcon className='showroom-arrow text-orange-500' size={18} /> </p>
                        </div>
                        <Image className='relative z-10 w-35 [transform:translateZ(38px)] drop-shadow-[0_26px_34px_rgba(251,146,60,0.28)] transition duration-200 group-hover:-translate-y-1 group-hover:scale-105' src={assets.hero_product_img1} alt="" />
                    </Link>
                    <Link
                        href="/shop?sale=1"
                        className='showroom-card glass-sheen flex-1 flex items-center justify-between w-full rounded-3xl bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-100 p-6 px-8 group will-change-transform'
                        style={cardTilt.sale}
                        onMouseMove={(event) => handleTiltMove('sale', event)}
                        onMouseLeave={() => resetTilt('sale')}
                    >
                        <div className='relative z-10 [transform:translateZ(26px)]'>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>20% discounts</p>
                            <p className='mt-4 flex items-center gap-1 text-slate-700'>View more <ArrowRightIcon className='showroom-arrow text-sky-500' size={18} /> </p>
                        </div>
                        <Image className='relative z-10 w-35 [transform:translateZ(38px)] drop-shadow-[0_26px_34px_rgba(96,165,250,0.28)] transition duration-200 group-hover:-translate-y-1 group-hover:scale-105' src={assets.hero_product_img2} alt="" />
                    </Link>
                </div>
            </div>
            <CategoriesMarquee />
        </div>

    )
}

export default Hero
