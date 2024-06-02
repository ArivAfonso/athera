import React, { FC } from 'react'
import NcBookmark from '../NcBookmark/NcBookmark'

export interface PostBookmarkProps {
    className?: string
    bookmarkClass?: string
    readingTime?: number
    hidenReadingTime?: boolean
    postId: string
}

const PostBookmark: FC<PostBookmarkProps> = ({
    className = '',
    bookmarkClass,
    hidenReadingTime = true,
    readingTime = 3,
    postId = '',
}) => {
    return (
        <div
            className={`PostBookmark flex items-center space-x-2 text-xs text-neutral-700 dark:text-neutral-300 ${className}`}
        >
            {!hidenReadingTime && !!readingTime && (
                <span>{readingTime} min read</span>
            )}

            <NcBookmark
                // bookmarked={isBookmarked}
                postId={postId}
                containerClassName={bookmarkClass}
            />
        </div>
    )
}

export default PostBookmark
