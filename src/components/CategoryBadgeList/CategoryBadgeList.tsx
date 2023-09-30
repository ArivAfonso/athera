import React, { FC } from 'react'
import Badge from '@/components/Badge/Badge'
import { TwMainColor } from '@/data/types'
import { Route } from '@/routers/types'
import PostCategoryType from '@/types/PostCategoryType'

export interface CategoryBadgeListProps {
    className?: string
    itemClass?: string
    categories: PostCategoryType[]
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
                    name={item.category.name}
                    href={`/category/${item.category.name}`}
                    color={item.category.color.toLowerCase() as TwMainColor}
                />
            ))}
        </div>
    )
}

export default CategoryBadgeList
