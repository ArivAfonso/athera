import React, { FC } from 'react'
import PostCardCommentBtn from '@/components/PostCardCommentBtn/PostCardCommentBtn'
import PostCardLikeAction from '@/components/PostCardLikeAction/PostCardLikeAction'

export interface PostCardLikeAndCommentProps {
    className?: string
    itemClass?: string
    likes: number
    comments?: number
    hiddenCommentOnMobile?: boolean
    id: string
    useOnSinglePage?: boolean
}

const PostCardLikeAndComment: FC<PostCardLikeAndCommentProps> = ({
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
            className={`PostCardLikeAndComment flex items-center space-x-2 ${className}`}
        >
            <PostCardLikeAction
                likeCount={likes}
                className={itemClass}
                postId={id}
            />
            <PostCardCommentBtn
                className={`${
                    hiddenCommentOnMobile ? 'hidden sm:flex' : 'flex'
                }  ${itemClass}`}
                commentCount={comments}
                isATagOnSingle={useOnSinglePage}
            />
        </div>
    )
}

export default PostCardLikeAndComment
