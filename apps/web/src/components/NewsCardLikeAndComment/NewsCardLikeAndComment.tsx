import React, { FC } from 'react'
import NewsCardCommentBtn from '@/components/NewsCardCommentBtn/NewsCardCommentBtn'
import NewsCardLikeAction from '@/components/NewsCardLikeAction/NewsCardLikeAction'

export interface NewsCardLikeAndCommentProps {
    className?: string
    itemClass?: string
    likes: number
    comments?: number
    hiddenCommentOnMobile?: boolean
    id: string
    useOnSinglePage?: boolean
}

const NewsCardLikeAndComment: FC<NewsCardLikeAndCommentProps> = ({
    className = '',
    itemClass = 'px-3 h-8 text-xs',
    hiddenCommentOnMobile = false,
    likes,
    comments = 0,
    id,
    useOnSinglePage = true,
}) => {
    return (
        <div
            className={`NewsCardLikeAndComment flex items-center space-x-2 ${className}`}
        >
            <NewsCardLikeAction
                likeCount={likes}
                className={itemClass}
                newsId={id}
            />
            <NewsCardCommentBtn
                className={`${
                    hiddenCommentOnMobile ? 'hidden sm:flex' : 'flex'
                }  ${itemClass}`}
                commentCount={comments}
                isATagOnSingle={useOnSinglePage}
            />
        </div>
    )
}

export default NewsCardLikeAndComment
