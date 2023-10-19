'use client'

import { Route } from '@/routers/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { FC } from 'react'

export interface CommonLayoutProps {
    children?: React.ReactNode
}

const pages: {
    name: string
    link: Route
}[] = [
    {
        name: 'Account',
        link: '/dashboard/edit-profile',
    },
    {
        name: 'New Post',
        link: '/dashboard/new-post',
    },
    {
        name: 'My Posts',
        link: '/dashboard/my-posts',
    },
    {
        name: 'Liked Posts',
        link: '/dashboard/liked-posts',
    },
    {
        name: 'Bookmarks',
        link: '/dashboard/bookmarks',
    },
    {
        name: 'Settings',
        link: '/dashboard/settings',
    },
]

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
    const pathname = usePathname()

    return (
        <div className="nc-AccountCommonLayout container">
            <div className="mt-14 sm:mt-20">
                <div className="max-w-4xl mx-auto">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl xl:text-4xl font-semibold">
                            Account
                        </h2>
                        <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">
                            <span className="text-slate-900 dark:text-slate-200 font-semibold">
                                Enrico Cole,
                            </span>{' '}
                            ciseco@gmail.com · Los Angeles, CA
                        </span>
                    </div>
                    <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>

                    <div className="flex space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">
                        {pages.map((item, index) => {
                            return (
                                <Link
                                    key={index}
                                    href={item.link}
                                    className={`block py-5 md:py-8 border-b-2 flex-shrink-0 text-sm sm:text-base ${
                                        pathname === item.link
                                            ? 'border-primary-500 font-medium text-slate-900 dark:text-slate-200'
                                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>
                    <hr className="border-slate-200 dark:border-slate-700"></hr>
                </div>
            </div>
            {children}
        </div>
    )
}

export default CommonLayout
