'use client'

import React, { FC } from 'react'
import { Heading } from 'ui'
import MySlider from '@/components/MySlider'
import AuthorType from '@/types/AuthorType'
import CardAuthorBox from '../CardAuthorBox/CardAuthorBox'

export interface SectionSliderNewAuthorsProps {
    className?: string
    heading: string
    subHeading: string
    authors: AuthorType[]
    itemPerRow?: number
}

const SectionSliderNewAuthors: FC<SectionSliderNewAuthorsProps> = ({
    heading = 'Suggestions for discovery',
    subHeading = 'Popular places to recommends for you',
    className = '',
    authors,
    itemPerRow = 5,
}) => {
    return (
        <div className={`SectionSliderNewAuthors ${className}`}>
            <Heading desc={subHeading} isCenter>
                {heading}
            </Heading>
            <MySlider
                itemPerRow={itemPerRow}
                data={authors}
                renderItem={(item, index) => (
                    <CardAuthorBox key={index} author={item} />
                )}
            />
        </div>
    )
}

export default SectionSliderNewAuthors
