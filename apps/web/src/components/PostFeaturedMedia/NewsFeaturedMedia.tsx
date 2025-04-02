'use client'

import React, { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NewsType from '@/types/NewsType'
import { Img } from 'ui'

export interface NewsFeaturedMediaProps {
    className?: string
    news: NewsType
    isHover?: boolean
    isNewsPage?: boolean
}

const NewsFeaturedMedia: FC<NewsFeaturedMediaProps> = ({
    className = 'w-full h-full',
    news,
    isHover = false,
    isNewsPage = false,
}) => {
    if (news.image === undefined) {
        return <h1>No News today</h1>
    }

    const imageUrl = news.image

    if (isNewsPage) {
        return (
            <div className={`NewsFeaturedMedia relative ${className} w-full`}>
                {/* Stronger gradient overlay to ensure text readability regardless of image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <Img
                    containerClassName="relative"
                    alt="featured"
                    fill
                    className="object-cover w-full h-full rounded-t-3xl filter brightness-90"
                    src={imageUrl}
                    sizes="(max-width: 1200px) 100vw, 1200px"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold line-clamp-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)]">
                        {news.title}
                    </h1>
                    <div className="flex items-center mt-3">
                        <span className="text-base text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                            {news.source?.name || 'Unknown Source'}
                        </span>
                        {news.author && (
                            <>
                                <span className="mx-2">•</span>
                                <span className="text-base text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                                    {news.author.split(' ').length > 1
                                        ? `${news.author.split(' ')[0]} ${news.author.split(' ').slice(-1)}`
                                        : news.author}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`NewsFeaturedMedia relative ${className} w-full`}>
            <Img
                containerClassName="relative"
                alt="featured"
                fill
                className="object-cover w-full rounded-t-3xl"
                src={imageUrl}
                sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <Link
                href={``}
                className={`block absolute inset-0 bg-black/20 transition-opacity opacity-0 group-hover:opacity-100`}
            />
        </div>
    )
}

export default NewsFeaturedMedia
