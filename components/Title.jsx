'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Title = ({ title, description, visibleButton = true, href = '' }) => {

    return (
        <div className='flex flex-col items-center'>
            <h2 className='text-2xl font-semibold text-slate-800'>{title}</h2>
            <Link href={href} className='section-link mt-2 flex items-center gap-5 text-sm text-slate-600'>
                <p className='max-w-lg text-center'>{description}</p>
                {visibleButton && <button className='flex items-center gap-1 text-green-500'>View more <ArrowRight size={14} className='showroom-arrow text-green-500' /></button>}
            </Link>
        </div>
    )
}

export default Title
