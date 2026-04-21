'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [heroParallax, setHeroParallax] = useState({
        panel: { transform: 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateY(0px)' },
        model: { transform: 'translate3d(0px, 0px, 0px) scale(1)' },
        glow: { transform: 'translate3d(0px, 0px, 0px) scale(1)' },
    })
    const [cardTilt, setCardTilt] = useState({
        rating: { transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)' },
        sale: { transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)' },
    })

    const handleHeroMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height
        const rotateY = (x - 0.5) * 3.2
        const rotateX = (0.5 - y) * 2.2
        const modelX = (x - 0.5) * 10
        const modelY = (0.5 - y) * 8

        setHeroParallax({
            panel: {
                transform: `perspective(1600px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-1px)`,
            },
            model: {
                transform: `translate3d(${modelX.toFixed(2)}px, ${modelY.toFixed(2)}px, 0px) scale(1.012)`,
            },
            glow: {
                transform: `translate3d(${(modelX * 0.6).toFixed(2)}px, ${(modelY * 0.55).toFixed(2)}px, 0px) scale(1.03)`,
            },
        })
    }

    const resetHeroMove = () => {
        setHeroParallax({
            panel: { transform: 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateY(0px)' },
            model: { transform: 'translate3d(0px, 0px, 0px) scale(1)' },
            glow: { transform: 'translate3d(0px, 0px, 0px) scale(1)' },
        })
    }

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
                <div
                    className='hero-stage hero-stage-main hero-stage-parallax relative flex-1 flex flex-col overflow-hidden bg-green-200 rounded-3xl xl:min-h-100 group'
                    style={heroParallax.panel}
                    onMouseMove={handleHeroMove}
                    onMouseLeave={resetHeroMove}
                >
                    <div className='p-5 sm:p-16'>
                        <div className='inline-flex items-center gap-3 bg-green-300 text-green-600 pr-4 p-1 rounded-full text-xs sm:text-sm'>
                            <span className='bg-green-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>NEWS</span> Free Shipping on Orders Above $50! <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>
                        <h2 className='hero-headline text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-clip-text text-transparent max-w-xs sm:max-w-md'>
                            Gadgets you'll love. Prices you'll trust.
                        </h2>
                        <div className='hero-price-copy text-sm font-medium mt-4 sm:mt-8'>
                            <p>Starts from</p>
                            <p className='text-3xl'>{currency}4.90</p>
                        </div>
                        <Link href="/shop?category=Electronics" className='inline-block bg-slate-800 text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-slate-900 hover:scale-103 active:scale-95 transition'>LEARN MORE</Link>
                    </div>
                    <div
                        className='hero-model-glow pointer-events-none absolute bottom-8 right-8 hidden h-48 w-48 rounded-full sm:block md:right-12'
                        style={heroParallax.glow}
                    />
                    <div className='hero-model-sheen pointer-events-none absolute inset-y-0 right-[18%] hidden w-44 sm:block' />
                    <Image
                        className='hero-model relative z-10 sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm'
                        style={heroParallax.model}
                        src={assets.hero_model_img}
                        alt=""
                        priority
                    />
                </div>
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <Link
                        href="/shop?sort=rating"
                        className='showroom-card hero-feature-card hero-feature-card--rating glass-sheen flex-1 flex items-center justify-between w-full rounded-3xl p-6 px-8 group will-change-transform'
                        style={cardTilt.rating}
                        onMouseMove={(event) => handleTiltMove('rating', event)}
                        onMouseLeave={() => resetTilt('rating')}
                    >
                        <div className='relative z-10 [transform:translateZ(26px)]'>
                            <p className='hero-feature-title hero-feature-title--rating text-3xl font-medium bg-clip-text text-transparent max-w-40'>Best products</p>
                            <p className='hero-feature-link mt-4 flex items-center gap-1'>View more <ArrowRightIcon className='showroom-arrow text-orange-500' size={18} /> </p>
                        </div>
                        <Image className='relative z-10 w-35 [transform:translateZ(38px)] drop-shadow-[0_26px_34px_rgba(251,146,60,0.28)] transition duration-200 group-hover:-translate-y-1 group-hover:scale-105' src={assets.hero_product_img1} alt="" />
                    </Link>
                    <Link
                        href="/shop?sale=1"
                        className='showroom-card hero-feature-card hero-feature-card--sale glass-sheen flex-1 flex items-center justify-between w-full rounded-3xl p-6 px-8 group will-change-transform'
                        style={cardTilt.sale}
                        onMouseMove={(event) => handleTiltMove('sale', event)}
                        onMouseLeave={() => resetTilt('sale')}
                    >
                        <div className='relative z-10 [transform:translateZ(26px)]'>
                            <p className='hero-feature-title hero-feature-title--sale text-3xl font-medium bg-clip-text text-transparent max-w-40'>20% discounts</p>
                            <p className='hero-feature-link mt-4 flex items-center gap-1'>View more <ArrowRightIcon className='showroom-arrow text-sky-500' size={18} /> </p>
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
