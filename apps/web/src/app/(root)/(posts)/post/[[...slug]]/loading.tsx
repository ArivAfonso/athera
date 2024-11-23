import React from 'react'

const BlogPostSkeleton = () => {
    return (
        <div className={`PageSingle pt-8 lg:pt-16`}>
            <header className="container rounded-xl">
                <div className="max-w-screen-md mx-auto">
                    <div className="SingleHeader">
                        <div className="space-y-5">
                            <div className="flex flex-wrap gap-1.5">
                                <div className="w-20 h-6 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"></div>
                                <div className="w-20 h-6 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"></div>
                                <div className="w-20 h-6 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"></div>
                            </div>
                            {/* Single Title Skeleton */}
                            <div className="pt-4 space-y-3">
                                <div className="w-full h-14 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                                <div className="w-[50%] h-14 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                            </div>
                            {/* Description Skeleton */}
                            <div className="pt-4 space-y-2">
                                <div className="w-full h-5 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                                <div className="w-full h-5 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                                <div className="w-full h-5 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                            </div>
                            {/* Divider Line */}
                            <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
                            {/* Post Meta Skeleton */}
                            <div className="flex flex-col sm:flex-row justify-between sm:items-end space-y-5 sm:space-y-0 sm:space-x-5">
                                {/* PostMeta2 Skeleton */}
                                <div
                                    className={`PostMeta2 flex items-center flex-wrap text-neutral-700 text-left dark:text-neutral-200`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="h-10 w-10 sm:h-11 sm:w-11 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                    </div>
                                    <div className="ml-3">
                                        <div className="flex items-center">
                                            <div className="block font-semibold bg-gray-300 dark:bg-gray-600 h-4 w-24 animate-pulse"></div>
                                        </div>
                                        <div className="text-xs mt-[6px]">
                                            <span className="text-neutral-700 dark:text-neutral-300 bg-gray-300 dark:bg-gray-600 h-4 w-20 animate-pulse"></span>

                                            <span className="text-neutral-700 dark:text-neutral-300 bg-gray-300 dark:bg-gray-600 h-4 w-20 animate-pulse"></span>
                                        </div>
                                    </div>
                                </div>
                                {/* SingleMetaAction2 Skeleton */}
                                <div className={`SingleMetaAction2`}>
                                    <div className="flex flex-row space-x-2.5 items-center">
                                        {/* Skeleton for PostCardLikeAndComment */}
                                        <div className="px-4 h-9 w-16 bg-gray-300 dark:bg-gray-600 rounded-3xl animate-pulse"></div>
                                        <div className="px-4 h-9 w-16 bg-gray-300 dark:bg-gray-600 rounded-3xl animate-pulse"></div>
                                        {/* Divider */}
                                        <div className="px-1">
                                            <div className="border-l border-neutral-200 dark:border-neutral-700 h-6"></div>
                                        </div>
                                        {/* Skeleton for BookmarkBtn */}
                                        <div className="h-9 w-9 bg-gray-300 dark:bg-gray-600 rounded-3xl animate-pulse"></div>
                                        {/* Skeleton for SocialsShareDropdown */}
                                        <div className="h-9 w-9 bg-gray-300 dark:bg-gray-600 rounded-3xl animate-pulse"></div>
                                        {/* Skeleton for PostActionDropdown */}
                                        <div className="h-9 w-9 bg-gray-300 dark:bg-gray-600 rounded-3xl animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="container my-10 sm:my-12 flex justify-center items-center">
                <div className="w-96 h-56 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"></div>
            </div>
        </div>
    )
}

export default BlogPostSkeleton
