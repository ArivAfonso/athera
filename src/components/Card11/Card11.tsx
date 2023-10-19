'use client'

import React, { FC, useState } from 'react'
import CategoryBadgeList from '@/components/CategoryBadgeList/CategoryBadgeList'
import PostCardMeta from '@/components/PostCardMeta/PostCardMeta'
import PostFeaturedMedia from '@/components/PostFeaturedMedia/PostFeaturedMedia'
import Link from 'next/link'
import PostType from '@/types/PostType'
import PostCardLikeAndComment from '../PostCardLikeAndComment/PostCardLikeAndComment'
import PostBookmark from '../PostBookmark/PostBookmark'

export interface Card11Props {
    className?: string
    post: PostType
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

    post.created_at = new Date(
        post.created_at ? post.created_at : ''
    ).toLocaleDateString('en-US', {
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
            <Link
                href={`/post/${post.title}/${post.id}`}
                className="absolute inset-0"
            ></Link>
            <span className="absolute top-3 inset-x-3 z-10">
                <CategoryBadgeList categories={post.post_categories} />
            </span>

            <div className="p-4 flex flex-col space-y-3">
                {!hiddenAuthor ? (
                    <PostCardMeta meta={post} />
                ) : (
                    <span className="text-xs text-neutral-500">
                        {post.created_at}
                    </span>
                )}
                <h3 className="nc-card-title block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    <span className="line-clamp-2" title={post.title}>
                        {post.title}
                    </span>
                </h3>
                <div className="flex items-end justify-between mt-auto">
                    <PostCardLikeAndComment
                        likes={post.likeCount[0].count}
                        liked={post.isLiked}
                        comments={post.commentCount[0].count}
                        id={post.id}
                        className="relative"
                    />
                    <PostBookmark
                        isBookmarked={post.isBookmarked}
                        className="relative"
                        postId={post.id}
                    />
                </div>
            </div>
        </div>
    )
}

export default Card11
