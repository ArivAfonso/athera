import React from 'react'
import Skeleton from './Skeleton'

const PostCardLikeCommentSaveSkeleton = () => {
    return (
        <div className="flex gap-3">
            <div className="flex flex-shrink-0 space-x-3">
                <Skeleton width={64} height={30} borderRadius={99} />
                <Skeleton width={64} height={30} borderRadius={99} />
            </div>
            <div className="flex-1 text-right">
                <Skeleton height={30} width={30} circle />
            </div>
        </div>
    )
}

export default PostCardLikeCommentSaveSkeleton
