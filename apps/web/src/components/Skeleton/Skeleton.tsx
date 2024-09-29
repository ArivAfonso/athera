import React, { FC } from 'react'
import SkeletonLib, {
    SkeletonProps as LibSkeletonProps,
} from 'react-loading-skeleton'
export interface SkeletonProps extends LibSkeletonProps {
    wrapClassName?: string
    borderRadius?: number
}

const Skeleton: FC<SkeletonProps> = ({
    wrapClassName = '',
    borderRadius,
    ...props
}) => {
    return (
        <>
            <SkeletonLib {...props} borderRadius={borderRadius || 12} />
        </>
    )
}

export default Skeleton
