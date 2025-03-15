import React, { FC } from 'react'

export interface NewsCardSkeletonProps {
    className?: string
    ratio?: string
}

const NewsCardSkeleton: FC<NewsCardSkeletonProps> = ({
    className = 'h-full',
    ratio = 'aspect-w-4 aspect-h-3',
}) => {
    return (
        <div
            className={`relative flex flex-col group rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-shadow ${className}`}
        >
            {/* Image skeleton */}
            <div
                className={`block flex-shrink-0 relative w-full rounded-t-3xl overflow-hidden z-10 ${ratio}`}
            >
                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
            </div>

            {/* Content skeleton */}
            <div className="p-4 flex flex-col space-y-3">
                {/* Avatar and source name */}
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                    <div className="w-24 h-4 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                </div>

                {/* Title */}
                <div className="space-y-1">
                    <div className="w-full h-5 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                    <div className="w-3/4 h-5 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                </div>

                {/* Summary */}
                <div className="space-y-1">
                    <div className="w-full h-4 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                    <div className="w-full h-4 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                    <div className="w-2/3 h-4 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-700 my-3" />

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                        <div className="w-12 h-4 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                </div>
            </div>

            {/* Add CSS for the animation
            <style jsx>{`
                @keyframes customPulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
                .animate-pulse {
                    animation: customPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style> */}
        </div>
    )
}

export default NewsCardSkeleton
