'use client'

import CardLarge1 from '@/components/CardLarge1/CardLarge1'
import MainHeading from './MainHeading'
import React, { FC, useEffect, useState } from 'react'
import PostType from '@/types/PostType'
import { useThemeMode } from '@/hooks/useThemeMode'
import dynamic from 'next/dynamic'
import Globe from '@/animations/Globe'
import { useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next'

export interface SectionLargeSliderProps {
    className?: string
    heading?: string
    posts: PostType[]
}

const SectionLargeSlider: FC<SectionLargeSliderProps> = ({
    posts,
    heading = "See What's happening in ",
    className = '',
}) => {
    const [indexActive, setIndexActive] = useState(0)

    const handleClickNext = () => {
        setIndexActive((state) => {
            if (state >= posts.length - 1) {
                return 0
            }
            return state + 1
        })
    }

    const handleClickPrev = () => {
        setIndexActive((state) => {
            if (state === 0) {
                return posts.length - 1
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
            {posts.map((item, index) => {
                if (indexActive !== index) return null
                return (
                    <CardLarge1
                        key={index}
                        onClickNext={handleClickNext}
                        onClickPrev={handleClickPrev}
                        post={item}
                    />
                )
            })}
        </div>
    )
}

export default SectionLargeSlider
