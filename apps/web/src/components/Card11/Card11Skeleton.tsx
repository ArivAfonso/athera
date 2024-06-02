import React, { FC } from 'react'
import Skeleton from '../Skeleton/Skeleton'
import PostCardLikeCommentSaveSkeleton from '../Skeleton/PostCardLikeCommentSaveSkeleton'

export interface Card11SkeletonProps {
    className?: string
    ratio?: string
}

const Card11Skeleton: FC<Card11SkeletonProps> = ({
    className = 'h-full',
    ratio = 'aspect-w-4 aspect-h-3',
}) => {
    return (
        <div
            className={`Card11 relative flex flex-col group rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 ${className}`}
            //
        >
            <div
                className={`block flex-shrink-0 relative w-full rounded-t-3xl overflow-hidden z-10 ${ratio}`}
            >
                <div>
                    <Skeleton
                        width="100%"
                        height="100%"
                        containerClassName="absolute inset-0 leading-none"
                    />
                </div>
            </div>

            <div className="p-4 flex flex-col space-y-3">
                <Skeleton width="60%" />
                <h3 className="card-title block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    <Skeleton />
                </h3>
                <PostCardLikeCommentSaveSkeleton />
            </div>
        </div>
    )
}

export default Card11Skeleton
