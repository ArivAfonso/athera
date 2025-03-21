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
}

const NewsFeaturedMedia: FC<NewsFeaturedMediaProps> = ({
    className = 'w-full h-full',
    news,
    isHover = false,
}) => {
    if (news.image === undefined) {
        return <h1>No News today</h1>
    }

    const imageUrl = news.image
    return (
        <div className={`NewsFeaturedMedia relative ${className}`}>
            <Img
                alt="featured"
                fill
                className="object-cover rounded-t-3xl"
                src={imageUrl}
                sizes="(max-width: 600px) 480px, 800px"
            />
            <Link
                href={``}
                className={`block absolute inset-0 bg-black/20 transition-opacity opacity-0 group-hover:opacity-100`}
            />
        </div>
    )
}

export default NewsFeaturedMedia
