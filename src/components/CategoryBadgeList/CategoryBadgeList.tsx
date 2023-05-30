import React, { FC } from 'react'
import Badge from '@/components/Badge/Badge'
import { TwMainColor } from '@/data/types'
import { Route } from '@/routers/types'

export interface CategoryBadgeListProps {
    className?: string
    itemClass?: string
    categories: { title: string; slug: {
            _type: string
            current: string
        }; color: string }[]
}

const CategoryBadgeList: FC<CategoryBadgeListProps> = ({
    className = 'flex flex-wrap space-x-2',
    itemClass,
    categories,
}) => {
    return (
        <div
            className={`nc-CategoryBadgeList ${className}`}
            data-nc-id="CategoryBadgeList"
        >
            {categories.map((item, index) => (
                <Badge
                    className={itemClass}
                    key={index}
                    name={item.title}
                    // href={`/archive/${item.slug}`}
                    color={item.color as TwMainColor}
                />
            ))}
        </div>
    )
}

export default CategoryBadgeList
