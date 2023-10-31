import React, { FC } from 'react'
import { TwMainColor } from '@/data/types'
import Badge from '@/components/Badge/Badge'
import Link from 'next/link'
import CategoryType from '@/types/CategoryType'

export interface CardCategory4Props {
    className?: string
    category: CategoryType
    index?: string
}

const CardCategory4: FC<CardCategory4Props> = ({
    className = '',
    category,
    index,
}) => {
    const getColorClass = () => {
        switch (category.color) {
            case 'pink':
                return 'bg-pink-500'
            case 'red':
                return 'bg-red-500'
            case 'gray':
                return 'bg-gray-500'
            case 'green':
                return 'bg-green-500'
            case 'purple':
                return 'bg-purple-500'
            case 'indigo':
                return 'bg-indigo-500'
            case 'yellow':
                return 'bg-yellow-500'
            case 'blue':
                return 'bg-blue-500'
            default:
                return 'bg-pink-500'
        }
    }
    return (
        <Link
            href={`/category/${category.name}`}
            className={`nc-CardCategory4 flex flex-col ${className}`}
        >
            <div className="flex-shrink-0 relative w-full aspect-w-7 aspect-h-5 h-0 rounded-3xl overflow-hidden group">
                <div>
                    {index && (
                        <Badge
                            color={category.color.toLowerCase() as TwMainColor}
                            name={index}
                            href={`/category/${category.name}`}
                            className="absolute top-3 left-3"
                        />
                    )}
                </div>
                <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
            </div>

            <div className="flex items-center mt-5">
                <div
                    className={`w-9 h-9 ${getColorClass()} rounded-full`}
                ></div>
                <div className="ml-4">
                    <h2 className="text-base text-neutral-900 dark:text-neutral-100 font-medium">
                        {category.name}
                    </h2>
                    <span className="block text-sm text-neutral-500 dark:text-neutral-400">
                        {category.postCount[0].count} Articles
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default CardCategory4
