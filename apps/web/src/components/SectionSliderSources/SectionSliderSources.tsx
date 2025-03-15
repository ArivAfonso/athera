'use client'

import React, { FC } from 'react'
import { Heading } from 'ui'
import MySlider from '@/components/MySlider'
import SourceType from '@/types/SourceType'
import CardSourceBox from '../CardSourceBox/CardSourceBox'

export interface SectionSliderSourcesProps {
    className?: string
    heading: string
    subHeading: string
    sources: SourceType[]
    itemPerRow?: number
}

const SectionSliderSources: FC<SectionSliderSourcesProps> = ({
    heading = 'Featured Sources',
    subHeading = 'Explore top sources',
    className = '',
    sources,
    itemPerRow = 5,
}) => {
    return (
        <div className={`SectionSliderSources ${className}`}>
            <Heading desc={subHeading} isCenter>
                {heading}
            </Heading>
            <MySlider
                itemPerRow={itemPerRow}
                data={sources}
                renderItem={(item, index) => (
                    <CardSourceBox key={index} source={item} />
                )}
            />
        </div>
    )
}

export default SectionSliderSources
