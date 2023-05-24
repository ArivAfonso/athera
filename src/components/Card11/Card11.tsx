'use client'

import React, { FC, useState } from 'react'
import CategoryBadgeList from '@/components/CategoryBadgeList/CategoryBadgeList'
import PostCardMeta from '@/components/PostCardMeta/PostCardMeta'
import PostFeaturedMedia from '@/components/PostFeaturedMedia/PostFeaturedMedia'
import Link from 'next/link'

interface PostDataType {
    title: string
    author: {
        name: string
        image: {
            asset: {
                _ref: string
                _type: string
            }
            _type: string
        }
        slug: string
    }
    publishedAt: string
    slug: string
    mainImage: {
        asset: {
            _ref: string
            _type: string
        }
        _type: string
    }
    categories: {
        title: string
        slug: string
        color: string
    }[]
}

export interface Card11Props {
    className?: string
    post: PostDataType
    ratio?: string
    hiddenAuthor?: boolean
}

const Card11: FC<Card11Props> = ({
    className = 'h-full',
    post,
    hiddenAuthor = false,
    ratio = 'aspect-w-4 aspect-h-3',
}) => {
    const [isHover, setIsHover] = useState(false)

    post.publishedAt = new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div
            className={`nc-Card11 relative flex flex-col group rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 ${className}`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            //
        >
            <div
                className={`block flex-shrink-0 relative w-full rounded-t-3xl overflow-hidden z-10 ${ratio}`}
            >
                <div>
                    <PostFeaturedMedia post={post} isHover={isHover} />
                </div>
            </div>
            {/* <Link
                href={`/single/${post.slug}`}
                className="absolute inset-0"
            ></Link> */}
            <span className="absolute top-3 inset-x-3 z-10">
                <CategoryBadgeList categories={post.categories} />
            </span>

            <div className="p-4 flex flex-col space-y-3">
                {!hiddenAuthor ? (
                    <PostCardMeta meta={post} />
                ) : (
                    <span className="text-xs text-neutral-500">
                        {post.publishedAt}
                    </span>
                )}
                <h3 className="nc-card-title block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    <span className="line-clamp-2" title={post.title}>
                        {post.title}
                    </span>
                </h3>
            </div>
        </div>
    )
}

export default Card11
