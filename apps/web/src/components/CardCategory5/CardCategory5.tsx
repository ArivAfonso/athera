import React, { FC } from 'react'
import { TwMainColor } from '@/data/types'
import Badge from '@/components/Badge/Badge'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import CategoryType from '@/types/CategoryType'

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
            href={`/category/${encodeURIComponent(category.name)}`}
            className={`nc-CardCategory5 relative block group ${className}`}
        >
            <div
                className={`flex-shrink-0 relative w-full aspect-w-8 aspect-h-5 h-0 rounded-3xl overflow-hidden z-0 group`}
            >
                <span className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-colors"></span>
            </div>
            <Badge
                className="absolute top-3 right-3"
                color={category.color.toLowerCase() as TwMainColor}
                href={`/category/${category.name}`}
                name={
                    <div className="flex items-center">
                        {category.postCount[0].count}
                        <ArrowRightIcon className="ml-1.5 w-3.5 h-3.5" />
                    </div>
                }
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <h2
                    className={`text-base font-medium px-4 py-2 sm:px-6 sm:py-3 bg-white text-neutral-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-full border-2 border-white border-opacity-60`}
                >
                    {category.name}
                </h2>
            </div>
        </Link>
    )
}

export default CardCategory5
