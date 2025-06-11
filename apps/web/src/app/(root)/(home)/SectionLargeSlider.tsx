'use client'

import NewsCardLarge from '@/components/NewsCardLarge/NewsCardLarge'
import MainHeading from './MainHeading'
import React, { FC, useState } from 'react'
import NewsType from '@/types/NewsType'
import Globe from '@/animations/Globe'

export interface SectionLargeSliderProps {
    className?: string
    heading?: string
    news: NewsType[]
    onHideNews?: (newsId: string) => void
    onHideAuthor?: (author: string) => void
    onHideSource?: (sourceId: string) => void
}

const SectionLargeSlider: FC<SectionLargeSliderProps> = ({
    news,
    heading = "See What's happening in ",
    className = '',
    onHideNews,
    onHideAuthor,
    onHideSource,
}) => {
    const [indexActive, setIndexActive] = useState(0)

    const handleClickNext = () => {
        setIndexActive((state) => {
            if (state >= news.length - 1) {
                return 0
            }
            return state + 1
        })
    }

    const handleClickPrev = () => {
        setIndexActive((state) => {
            if (state === 0) {
                return news.length - 1
            }
            return state - 1
        })
    }

    return (
        <div className="relative">
            <div
                className={`hidden md:-mt-48 md:block md:relative ${className}`}
            >
                <div className="grid grid-cols-3 items-center md:gap-x-8">
                    <MainHeading className="col-span-2 -mt-8" isCenter={true}>
                        {heading}
                    </MainHeading>
                    <div className="hidden md:block z-0 lg:w-[800px] md:w-[600px] md:h-[600px] lg:h-[800px] md:z-10 md:-ml-10 lg:-ml-32">
                        <Globe />
                    </div>
                </div>
            </div>
            <div className="mt-7 md:hidden">
                <MainHeading isCenter={true}>{heading}</MainHeading>
            </div>
            {news.map((item, index) => {
                if (indexActive !== index) return null
                return (
                    <NewsCardLarge
                        key={index}
                        onClickNext={handleClickNext}
                        onClickPrev={handleClickPrev}
                        news={item}
                        onHideNews={onHideNews}
                        onHideAuthor={onHideAuthor}
                        onHideSource={onHideSource}
                    />
                )
            })}
        </div>
    )
}

export default SectionLargeSlider
