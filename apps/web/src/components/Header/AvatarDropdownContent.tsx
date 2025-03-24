'use client'

import React, { FC, useEffect, useState } from 'react'
import { Avatar } from 'ui'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { FilePlusIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'
import SwitchDarkMode2 from '@/components/SwitchDarkMode/SwitchDarkMode2'

interface AvatarDropdownContentProps {
    id: string
    avatar_url: string
    name: string
    email: string
    close: () => void
    logOut: () => void
}

const AvatarDropdownContent: FC<AvatarDropdownContentProps> = ({
    id,
    avatar_url,
    name,
    email,
    close,
    logOut,
}) => {
    const supabase = createClient()
    const [createdAt, setCreatedAt] = useState<string | null>(null)
    const chars =
        typeof window !== 'undefined'
            ? window.screen.width < 640
                ? 10
                : 20
            : 20

    // Fetch user data only when the dropdown is rendered (i.e. when open)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: session } = await supabase.auth.getSession()

                if (session?.session?.user) {
                    const date = session?.session?.user?.created_at
                    setCreatedAt(
                        new Date(date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })
                    )
                }
            } catch (err) {
                console.error(err)
            }
        }
        fetchData()
    }, [id, supabase])

    return (
        <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-900 py-7 px-6">
                <div className="flex items-center space-x-3">
                    <Avatar imgUrl={avatar_url} sizeClass="w-12 h-12" />
                    <div className="flex-grow">
                        <h4 className="font-semibold hover:underline">
                            {name}
                        </h4>

                        <p className="text-xs mt-0.5 overflow-hidden whitespace-nowrap overflow-ellipsis">
                            {createdAt}
                        </p>
                    </div>
                </div>

                {/* Divider inserted between the avatar info and the buttons */}
                <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />

                <Link
                    href={'/dashboard/edit-profile'}
                    className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    onClick={() => close()}
                >
                    <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <UserIcon
                            className="w-6 h-6"
                            aria-hidden="true"
                            strokeWidth={1.5}
                        />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium">My Account</p>
                    </div>
                </Link>

                <Link
                    href={'/dashboard/new-source'}
                    className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    onClick={() => close()}
                >
                    <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <FilePlusIcon
                            className="w-6 h-6"
                            aria-hidden="true"
                            strokeWidth={1.5}
                        />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium">New Source</p>
                    </div>
                </Link>

                <div className="flex items-center justify-between p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12.0001 7.88989L10.9301 9.74989C10.6901 10.1599 10.8901 10.4999 11.3601 10.4999H12.6301C13.1101 10.4999 13.3001 10.8399 13.0601 11.2499L12.0001 13.1099"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8.30011 18.0399V16.8799C6.00011 15.4899 4.11011 12.7799 4.11011 9.89993C4.11011 4.94993 8.66011 1.06993 13.8001 2.18993C16.0601 2.68993 18.0401 4.18993 19.0701 6.25993C21.1601 10.4599 18.9601 14.9199 15.7301 16.8699V18.0299C15.7301 18.3199 15.8401 18.9899 14.7701 18.9899H9.26011C8.16011 18.9999 8.30011 18.5699 8.30011 18.0399Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8.5 22C10.79 21.35 13.21 21.35 15.5 22"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium">Dark Theme</p>
                        </div>
                    </div>
                    <SwitchDarkMode2 />
                </div>

                <Link
                    href={'/dashboard/settings'}
                    className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    onClick={() => close()}
                >
                    <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <SettingsIcon
                            className="w-6 h-6"
                            aria-hidden="true"
                            strokeWidth={1.5}
                        />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium">Settings</p>
                    </div>
                </Link>

                <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />

                <button
                    className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    onClick={logOut}
                >
                    <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <LogOutIcon
                            className="w-6 h-6"
                            aria-hidden="true"
                            strokeWidth={1.5}
                        />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium">Log out</p>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default AvatarDropdownContent
