'use client'

import React, { FC } from 'react'
import { Heading } from 'ui'
import CardTopic4 from '@/components/CardTopic4/CardTopic4'
import CardTopic1 from '@/components/CardTopic1/CardTopic1'
import CardTopic2 from '@/components/CardTopic2/CardTopic2'
import CardTopic5 from '@/components/CardTopic5/CardTopic5'
import MySlider from '../MySlider'
import TopicType from '@/types/TopicType'

export interface SectionSliderNewTopicsProps {
    className?: string
    heading: string
    subHeading: string
    topics: TopicType[]
    topicCardType?: 'card1' | 'card2' | 'card3' | 'card4' | 'card5'
    itemPerRow?: 4 | 5
}

const SectionSliderNewTopics: FC<SectionSliderNewTopicsProps> = ({
    heading,
    subHeading,
    className = '',
    topics,
    itemPerRow = 5,
    topicCardType = 'card3',
}) => {
    const renderCard = (item: TopicType, index: number) => {
        const topIndex = index < 20 ? `#${index + 1}` : undefined
        switch (topicCardType) {
            case 'card1':
                return <CardTopic1 topic={item} />
            case 'card2':
                return <CardTopic2 index={topIndex} topic={item} />
            case 'card4':
                return <CardTopic4 index={topIndex} topic={item} />
            case 'card5':
                return <CardTopic5 topic={item} />
            default:
                return null
        }
    }

    return (
        <div className={`SectionSliderNewTopics ${className}`}>
            <Heading desc={subHeading}>{heading}</Heading>
            <MySlider
                data={topics}
                renderItem={(item, indx) => renderCard(item, indx)}
                itemPerRow={itemPerRow}
                shiftCount={4}
            />
        </div>
    )
}

export default SectionSliderNewTopics
