import React, { FC } from 'react'
import Badge from '@/components/Badge/Badge'
import { TwMainColor } from '@/data/types'
import { Route } from '@/routers/types'
import CategoryType from '@/types/CategoryType'

export interface CategoryBadgeListProps {
    className?: string
    itemClass?: string
    categories: CategoryType[]
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
                    href={`/category/${encodeURIComponent(item.slug.current)}`}
                    color={item.color as TwMainColor}
                />
            ))}
        </div>
    )
}

export default CategoryBadgeList
