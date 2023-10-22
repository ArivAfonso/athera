import React, { FC } from 'react'
import Badge from '@/components/Badge/Badge'
import { TwMainColor } from '@/data/types'
import PostCategoryType from '@/types/PostCategoryType'

export interface CategoryBadgeListProps {
    className?: string
    itemClass?: string
    shorten?: boolean
    categories: PostCategoryType[]
}

const CategoryBadgeList: FC<CategoryBadgeListProps> = ({
    className = 'flex flex-wrap space-x-2',
    itemClass,
    shorten = true,
    categories,
}) => {
    let renderableCategories = categories

    if (shorten) {
        let totalCharCount = 0
        renderableCategories = []

        for (const item of categories) {
            const nameLength = item.category.name.length
            if (totalCharCount + nameLength < 30) {
                renderableCategories.push(item)
                totalCharCount += nameLength
            } else {
                break
            }
        }
    }

    return (
        <div
            className={`nc-CategoryBadgeList ${className}`}
            data-nc-id="CategoryBadgeList"
        >
            {renderableCategories.map((item, index) => (
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
