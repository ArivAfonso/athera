'use client'

import { Popover, Transition } from '@/app/headlessui'
import { FC, Fragment, useEffect, useState } from 'react'
import { Avatar } from 'ui'
import SwitchDarkMode2 from '@/components/SwitchDarkMode/SwitchDarkMode2'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import {
    FilePlusIcon,
    SettingsIcon,
    LogOutIcon,
    FolderOpenIcon,
    UserIcon,
} from 'lucide-react'

interface AvatarProps {
    avatar_url: string
    name: string
    email: string
    id: string
}

const AvatarDropdown: FC<AvatarProps> = ({ avatar_url, name, email, id }) => {
    const supabase = createClient()
    const [username, setUsername] = useState('')

    async function logOut() {
        deleteCookie('username')
        const { error } = await supabase.auth.signOut()
    }

    const chars =
        typeof window !== 'undefined'
            ? window.screen.width < 640
                ? 10
                : 20
            : 20

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: session } = await supabase.auth.getSession()
                let username = session.session?.user.user_metadata?.username

                if (username == null) {
                    const { data } = await supabase
                        .from('users')
                        .select('username')
                        .eq('id', id)
                        .single()
                    username = data?.username
                    await supabase.auth.updateUser({
                        data: {
                            username: data?.username,
                        },
                    })
                }
                setUsername(username as string)
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, []) // Empty dependency array to run only once on mount

    return (
        <div className="AvatarDropdown z-40 ">
            <Popover className="relative">
                {({ open, close }) => (
                    <>
                        <Popover.Button
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center`}
                        >
                            <svg
                                className=" w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute z-10 w-screen max-w-[260px] px-4 mt-3.5 -right-2 sm:right-0 sm:px-0">
                                <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-900 py-7 px-6">
                                        <div className="flex items-center space-x-3">
                                            <Avatar
                                                imgUrl={avatar_url}
                                                sizeClass="w-12 h-12"
                                            />

                                            <div className="flex-grow">
                                                <Link
                                                    href={`/author/${username}`}
                                                >
                                                    <h4 className="font-semibold hover:underline">
                                                        {name}
                                                    </h4>
                                                </Link>
                                                <p className="text-xs mt-0.5 overflow-hidden whitespace-nowrap overflow-ellipsis">
                                                    @
                                                    {username.length > chars
                                                        ? `${username.slice(
                                                              0,
                                                              chars
                                                          )}...`
                                                        : username}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />

                                        {/* ------------------ 1 --------------------- */}
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
                                                <p className="text-sm font-medium ">
                                                    {'My Account'}
                                                </p>
                                            </div>
                                        </Link>

                                        <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />

                                        {/* ------------------ 3 --------------------- */}
                                        <Link
                                            href={'/dashboard/new-post'}
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
                                                <p className="text-sm font-medium ">
                                                    {'New Post'}
                                                </p>
                                            </div>
                                        </Link>

                                        {/* ------------------ 4 --------------------- */}
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
                                                    <p className="text-sm font-medium ">
                                                        {'Dark theme'}
                                                    </p>
                                                </div>
                                            </div>
                                            <SwitchDarkMode2 />
                                        </div>

                                        {/* ------------------ 5 --------------------- */}
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
                                                <p className="text-sm font-medium ">
                                                    {'Settings'}
                                                </p>
                                            </div>
                                        </Link>

                                        {/* ------------------ 6 --------------------- */}
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
                                                <p className="text-sm font-medium ">
                                                    {'Log out'}
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    )
}

export default AvatarDropdown
