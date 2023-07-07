'use client'

import React, { FC } from 'react'
import Heading from '@/components/Heading/Heading'
import CardCategory4 from '@/components/CardCategory4/CardCategory4'
import CardCategory1 from '@/components/CardCategory1/CardCategory1'
import CardCategory2 from '@/components/CardCategory2/CardCategory2'
import CardCategory5 from '@/components/CardCategory5/CardCategory5'
import MySlider from '../MySlider'
import CategoryType from '@/types/CategoryType'

export interface SectionSliderNewCategoriesProps {
    className?: string
    heading: string
    subHeading: string
    categories: CategoryType[]
    categoryCardType?: 'card1' | 'card2' | 'card3' | 'card4' | 'card5'
    itemPerRow?: 4 | 5
}

const SectionSliderNewCategories: FC<SectionSliderNewCategoriesProps> = ({
    heading,
    subHeading,
    className = '',
    categories,
    itemPerRow = 5,
    categoryCardType = 'card3',
}) => {
    const renderCard = (item: CategoryType, index: number) => {
        const topIndex = index < 3 ? `#${index + 1}` : undefined
        switch (categoryCardType) {
            case 'card1':
                return <CardCategory1 category={item} />
            case 'card2':
                return <CardCategory2 index={topIndex} category={item} />
            case 'card4':
                return <CardCategory4 index={topIndex} category={item} />
            case 'card5':
                return <CardCategory5 category={item} />
            default:
                return null
        }
    }

    return (
        <div className={`nc-SectionSliderNewCategories ${className}`}>
            <Heading desc={subHeading}>{heading}</Heading>
            <MySlider
                data={categories}
                renderItem={(item, indx) => renderCard(item, indx)}
                itemPerRow={itemPerRow}
            />
        </div>
    )
}

export default SectionSliderNewCategories
