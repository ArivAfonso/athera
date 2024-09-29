// Import necessary components and icons
import React from 'react'

const Loading = () => (
    <div className={`PageAuthor `}>
        {/* HEADER */}
        <div className="w-full">
            <div className="container mt-10 lg:mt-16">
                <div className="relative bg-white dark:bg-neutral-900 p-5 lg:p-8 rounded-3xl md:rounded-[40px] shadow-xl flex flex-col md:flex-row">
                    <div className="w-32 lg:w-40 flex-shrink-0 mt-12 sm:mt-0">
                        {/* Loading skeleton for avatar */}
                        <div className="wil-avatar animate-pulse w-20 h-20 dark:bg-gray-700 bg-gray-300 rounded-full"></div>
                    </div>

                    {/* Loading skeleton for user information */}
                    <div className="pt-5 md:pt-1 lg:ml-6 xl:ml-12 flex-grow">
                        <div className="max-w-screen-sm space-y-3.5">
                            <div className="animate-pulse h-8 w-1/2 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                            <div className="animate-pulse h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                            <div className="animate-pulse h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                            <div className="animate-pulse h-4 w-4/5 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                        </div>
                    </div>

                    {/* Loading skeleton for buttons and icons */}
                    <div className="absolute md:static left-5 right-5 top-4 sm:left-auto sm:top-5 sm:right-5 flex justify-end">
                        <div className="animate-pulse h-8 w-24 dark:bg-gray-700 bg-gray-300 rounded-full"></div>
                        <div className="mx-2">
                            <div className="animate-pulse h-10 w-10 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-full">
                                {/* Loading skeleton for ShareIcon */}
                            </div>
                        </div>
                        <div className="animate-pulse h-10 w-10 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-full">
                            {/* Loading skeleton for AccountActionDropdown */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* ====================== END HEADER ====================== */}

        {/* Loading skeleton for main content */}
        <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
            <main>
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
            </main>
        </div>
    </div>
)

export default Loading
