'use client'

import React, { FC } from 'react'
import CategoryBadgeList from '@/components/CategoryBadgeList/CategoryBadgeList'
import SingleTitle from './SingleTitle'
import PostMeta2 from '@/components/PostMeta2/PostMeta2'
import SingleMetaAction2 from './SingleMetaAction2'
import { Route } from '@/routers/types'
import CategoryType from '@/types/CategoryType'
import AuthorType from '@/types/AuthorType'
import PostCategoryType from '@/types/PostCategoryType'

export interface SingleHeaderProps {
    hiddenDesc?: boolean
    titleMainClass?: string
    className?: string
    description: string
    category: PostCategoryType[]
    estimatedReadingTime: number
    title: string
    author: AuthorType
    created_at: string
    likes: number
    comments: number
    id: string
}

const SingleHeader: FC<SingleHeaderProps> = ({
    titleMainClass,
    hiddenDesc = false,
    className = '',
    description = '',
    category,
    title = '',
    created_at,
    comments,
    likes,
    estimatedReadingTime,
    id,
    author,
}) => {
    return (
        <>
            <div className={`nc-SingleHeader ${className}`}>
                <div className="space-y-5">
                    <CategoryBadgeList
                        itemClass="!px-3"
                        categories={category}
                    />
                    <SingleTitle mainClass={titleMainClass} title={title} />
                    {!hiddenDesc && (
                        <span className="block text-base text-neutral-500 md:text-lg dark:text-neutral-400 pb-1">
                            {description}
                        </span>
                    )}
                    <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end space-y-5 sm:space-y-0 sm:space-x-5">
                        <PostMeta2
                            size="large"
                            className="leading-none flex-shrink-0"
                            hiddenCategories
                            avatarRounded="rounded-full shadow-inner"
                            estimatedReadingTime={estimatedReadingTime}
                            author={author}
                            publishedAt={new Date(
                                created_at
                            ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        />
                        <SingleMetaAction2
                            likes={likes}
                            title={title}
                            id={id}
                            comments={comments}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SingleHeader
