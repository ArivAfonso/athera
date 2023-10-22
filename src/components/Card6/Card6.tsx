'use client'

import React, { FC } from 'react'
import PostCardMeta from '@/components/PostCardMeta/PostCardMeta'
import PostBookmark from '@/components/PostBookmark/PostBookmark'
import PostCardLikeAndComment from '@/components/PostCardLikeAndComment/PostCardLikeAndComment'
import CategoryBadgeList from '@/components/CategoryBadgeList/CategoryBadgeList'
import Link from 'next/link'
import Image from 'next/image'
import PostType from '@/types/PostType'
import stringToSlug from '@/utils/stringToSlug'

export interface Card6Props {
    className?: string
    post: PostType
}

const Card6: FC<Card6Props> = ({ className = 'h-full', post }) => {
    post.created_at = new Date(
        post.created_at ? post.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    return (
        <div
            className={`nc-Card6 relative flex group flex-row items-center sm:p-4 sm:rounded-3xl sm:bg-white sm:dark:bg-neutral-900 sm:border border-neutral-200 dark:border-neutral-700 ${className}`}
        >
            <Link
                href={`/post/${stringToSlug(post.title)}/${post.id}`}
                className="absolute inset-0 z-0"
            ></Link>
            <div className="flex flex-col flex-grow">
                <div className="space-y-3 mb-4">
                    <CategoryBadgeList
                        shorten={true}
                        categories={post.post_categories}
                    />
                    <h2 className={`block font-semibold text-sm sm:text-base`}>
                        <Link
                            href={`/post/${stringToSlug(post.title)}/${
                                post.id
                            }`}
                            className="line-clamp-2"
                            title={post.title}
                        >
                            {post.title}
                        </Link>
                    </h2>
                    <PostCardMeta meta={{ ...post }} />
                </div>
                <div className="flex items-center flex-wrap justify-between mt-auto">
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

            <Link
                href={`/post/${stringToSlug(post.title)}/${post.id}`}
                className={`block relative flex-shrink-0 w-24 h-24 sm:w-40 sm:h-full ml-3 sm:ml-5 rounded-2xl overflow-hidden z-0`}
            >
                <Image
                    sizes="(max-width: 600px) 180px, 400px"
                    className="object-cover w-full h-full"
                    fill
                    src={post.image}
                    alt={post.title}
                />
            </Link>
        </div>
    )
}

export default Card6
