import React, { FC } from 'react'
import { TwMainColor } from '@/data/types'
import Badge from '@/components/Badge/Badge'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '@/lib/sanityClient'
import CategoryType from '@/types/CategoryType'

function urlFor(source: any) {
    return imageUrlBuilder(sanityClient).image(source)
}

export interface CardCategory5Props {
    className?: string
    category: CategoryType
}

const CardCategory5: FC<CardCategory5Props> = ({
    className = '',
    category,
}) => {
    return (
        <Link
            href={`/category/${encodeURIComponent(category.title)}`}
            className={`nc-CardCategory5 relative block group ${className}`}
        >
            <div
                className={`flex-shrink-0 relative w-full aspect-w-8 aspect-h-5 h-0 rounded-3xl overflow-hidden z-0 group`}
            >
                <Image
                    fill
                    alt="thumbnail"
                    src={
                        category.image?.asset
                            ? urlFor(category.image.asset._ref).url()
                            : ''
                    }
                    className="object-cover w-full h-full rounded-2xl"
                    sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
                />
                <span className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-colors"></span>
            </div>
            <Badge
                className="absolute top-3 right-3"
                color={category.color as TwMainColor}
                name={
                    <div className="flex items-center">
                        {category.postCount}
                        <ArrowRightIcon className="ml-1.5 w-3.5 h-3.5" />
                    </div>
                }
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <h2
                    className={`text-base font-medium px-4 py-2 sm:px-6 sm:py-3 bg-white text-neutral-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-full border-2 border-white border-opacity-60`}
                >
                    {category.title}
                </h2>
            </div>
        </Link>
    )
}

export default CardCategory5
