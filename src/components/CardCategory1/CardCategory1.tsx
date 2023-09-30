import React, { FC } from 'react'
import Link from 'next/link'
import CategoryType from '@/types/CategoryType'

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
            href={`/category/${encodeURIComponent(category.name)}`}
            className={`nc-CardCategory1 flex items-center ${className}`}
        >
            <div>
                <h2
                    className={`${
                        size === 'large' ? 'text-lg' : 'text-base'
                    } nc-card-title text-neutral-900 dark:text-neutral-100 text-sm sm:text-base font-medium sm:font-semibold`}
                >
                    {category.name}
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
