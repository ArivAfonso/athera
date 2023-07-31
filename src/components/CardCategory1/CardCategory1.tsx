import React, { FC } from 'react'
import NcImage from '@/components/NcImage/NcImage'
import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '@/lib/sanityClient'
import CategoryType from '@/types/CategoryType'

function urlFor(source: any) {
    return imageUrlBuilder(sanityClient).image(source)
}

export interface CardCategory1Props {
    className?: string
    category: CategoryType
    size?: 'large' | 'normal'
}

const CardCategory1: FC<CardCategory1Props> = ({
    className = '',
    size = 'normal',
    category,
}) => {
    return (
        <Link
            href={`/category/${encodeURIComponent(category.title)}`}
            className={`nc-CardCategory1 flex items-center ${className}`}
        >
            <NcImage
                alt=""
                containerClassName={`relative flex-shrink-0 ${
                    size === 'large' ? 'w-20 h-20' : 'w-12 h-12'
                } rounded-lg mr-4 overflow-hidden`}
                src={
                    category.image?.asset
                        ? urlFor(category.image.asset._ref).url()
                        : ''
                }
                fill
                className="object-cover"
                sizes="80px"
            />
            <div>
                <h2
                    className={`${
                        size === 'large' ? 'text-lg' : 'text-base'
                    } nc-card-title text-neutral-900 dark:text-neutral-100 text-sm sm:text-base font-medium sm:font-semibold`}
                >
                    {category.title}
                </h2>
                <span
                    className={`${
                        size === 'large' ? 'text-sm' : 'text-xs'
                    } block mt-[2px] text-neutral-500 dark:text-neutral-400`}
                >
                    {category.postCount} Articles
                </span>
            </div>
        </Link>
    )
}

export default CardCategory1
