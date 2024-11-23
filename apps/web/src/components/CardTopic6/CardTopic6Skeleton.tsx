import { FC } from 'react'
import Skeleton from '../Skeleton/Skeleton'

export interface CardTopic6SkeletonProps {
    size?: 'large' | 'normal'
    className?: string
}

const CardTopic6Skeleton: FC<CardTopic6SkeletonProps> = ({
    size = 'normal',
    className = '',
}) => {
    return (
        <div className={`CardTopic6Skeleton flex items-center ${className} `}>
            <div
                className={`relative flex-shrink-0 ${
                    size === 'large' ? 'h-20 w-20' : 'h-12 w-12'
                } me-4 overflow-hidden rounded-lg`}
            >
                <Skeleton width={48} height={48} className="absolute inset-0" />
            </div>

            <div className="flex-1">
                <h2
                    className={`${
                        size === 'large' ? 'text-lg' : 'text-base'
                    } nc-card-title text-sm font-medium text-neutral-900 sm:text-base sm:font-semibold dark:text-neutral-100`}
                >
                    <Skeleton width={'80%'} />
                </h2>
                <span
                    className={`${
                        size === 'large' ? 'text-sm' : 'text-xs'
                    } mt-[2px] block text-neutral-500 dark:text-neutral-400`}
                >
                    <Skeleton width={110} />
                </span>
            </div>
        </div>
    )
}

export default CardTopic6Skeleton
