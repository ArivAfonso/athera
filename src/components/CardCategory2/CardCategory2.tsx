import React, { FC } from 'react'
import Link from 'next/link'
import CategoryType from '@/types/CategoryType'

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
            href={`/category/${encodeURIComponent(category.name)}`}
            className={`nc-CardCategory2 relative flex flex-col items-center justify-center text-center px-3 py-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-3xl transition-colors ${className}`}
        >
            <div className="mt-3">
                <h2 className={`text-base font-semibold`}>{category.name}</h2>
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
