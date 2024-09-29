import React from 'react'

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div>
            <div className="max-w-2xl mx-auto mt-10 flex flex-col lg:mt-7">
                <div className="relative">
                    <div className="text-neutral-500 dark:text-neutral-300 bg-gray-200 dark:bg-gray-800 h-10 rounded-xl mb-4" />
                </div>
                <div className="block text-sm mt-4 text-neutral-500 dark:text-neutral-300">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-100 bg-gray-200 dark:bg-gray-800 h-4 w-16 rounded" />
                </div>
            </div>
            <div className="flex space-x-2 ml-5">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-24"
                    ></div>
                ))}
            </div>
            <div className="grid justify-center ml-5 mr-5 items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8 mt-8 lg:mt-10">
                {[...Array(8)].map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse flex-shrink-0 w-72"
                    >
                        {/* Replace the below components with your custom skeleton components */}
                        <div className="bg-gray-200 dark:bg-gray-800 h-48 w-full rounded-3xl mb-4" />
                        <div className="flex flex-col space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
