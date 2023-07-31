import React, { FC } from 'react'
import NcImage from '@/components/NcImage/NcImage'
import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '@/lib/sanityClient'
import CategoryType from '@/types/CategoryType'

function urlFor(source: any) {
    return imageUrlBuilder(sanityClient).image(source)
}

export interface CardCategory2Props {
    className?: string
    category: CategoryType
    index?: string
}

const CardCategory2: FC<CardCategory2Props> = ({
    className = '',
    category,
    index,
}) => {
    return (
        <Link
            href={`/category/${encodeURIComponent(category.title)}`}
            className={`nc-CardCategory2 relative flex flex-col items-center justify-center text-center px-3 py-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-3xl transition-colors ${className}`}
        >
            <NcImage
                containerClassName={`relative flex-shrink-0 w-20 h-20 rounded-full shadow-lg overflow-hidden z-0`}
                src={
                    category.image?.asset
                        ? urlFor(category.image.asset._ref).url()
                        : ''
                }
                fill
                sizes="80px"
                alt="categories"
                className="object-cover "
            />
            <div className="mt-3">
                <h2 className={`text-base font-semibold`}>{category.title}</h2>
                <span
                    className={`block mt-1 text-sm text-neutral-500 dark:text-neutral-400`}
                >
                    {category.postCount} Articles
                </span>
            </div>
        </Link>
    )
}

export default CardCategory2
