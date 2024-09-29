'use client'

import React, { FC } from 'react'
import PostActionDropdown from '@/components/PostActionDropdown/PostActionDropdown'
import PostCardLikeAndComment from '@/components/PostCardLikeAndComment/PostCardLikeAndComment'
import BookmarkBtn from '@/components/BookmarkBtn/BookmarkBtn'
import SocialsShareDropdown from '@/components/SocialsShareDropdown/SocialsShareDropdown'
import AuthorType from '@/types/AuthorType'

export interface SingleMetaAction2Props {
    className?: string
    title: string
    id: string
    likes: number
    comments: number
    author: AuthorType
}

const SingleMetaAction2: FC<SingleMetaAction2Props> = ({
    className = '',
    title,
    likes = 0,
    comments = 0,
    author,
    id,
}) => {
    //Get the current url
    const url = typeof window !== 'undefined' ? window.location.href : ''
    return (
        <div className={`SingleMetaAction2 ${className}`}>
            <div className="flex flex-row space-x-2.5 items-center">
                <PostCardLikeAndComment
                    itemClass="px-4 h-9 text-sm"
                    hiddenCommentOnMobile
                    useOnSinglePage
                    className="!space-x-2.5"
                    likes={likes}
                    id={id}
                    comments={comments}
                />
                <div className="px-1">
                    <div className="border-l border-neutral-200 dark:border-neutral-700 h-6" />
                </div>

                <BookmarkBtn
                    postId={id}
                    containerClassName="h-9 w-9 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200"
                />
                <SocialsShareDropdown href={url} />
                <PostActionDropdown
                    containerClassName="h-9 w-9 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                    iconClass="h-5 w-5"
                    id={id}
                    title={title}
                    author={author}
                />
            </div>
        </div>
    )
}

export default SingleMetaAction2
