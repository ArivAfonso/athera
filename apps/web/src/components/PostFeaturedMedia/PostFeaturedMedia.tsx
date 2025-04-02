'use client'

import React, { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PostType from '@/types/PostType'
import { Img } from 'ui'

export interface PostFeaturedMediaProps {
    className?: string
    post: PostType
    isHover?: boolean
}

const PostFeaturedMedia: FC<PostFeaturedMediaProps> = ({
    className = 'w-full h-full',
    post,
    isHover = false,
}) => {
    if (post.image === undefined) {
        return <h1>No Post today</h1>
    }

    const imageUrl = post.image
    return (
        <div className={`PostFeaturedMedia relative ${className}`}>
            <Img
                alt="featured"
                fill
                className="object-cover"
                src={imageUrl}
                sizes="(max-width: 600px) 480px, 800px"
            />
            <Link
                href={`/post/${post.title}/${post.id}`}
                className={`block absolute inset-0 bg-black/20 transition-opacity opacity-0 group-hover:opacity-100`}
            />
        </div>
    )
}

export default PostFeaturedMedia
