'use client'

import { Popover, Transition } from '@/app/headlessui'
import React, { FC, Fragment, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import Skeleton from '@/components/Skeleton/Skeleton'

// Lazy load the dropdown content that contains expensive fetching logic.
const LazyAvatarDropdownContent = React.lazy(
    () => import('./AvatarDropdownContent')
)

interface AvatarProps {
    avatar_url: string
    name: string
    email: string
    id: string
}

const AvatarDropdown: FC<AvatarProps> = ({ avatar_url, name, email, id }) => {
    const supabase = createClient()

    async function logOut() {
        await supabase.auth.signOut()
    }

    return (
        <div className="AvatarDropdown z-40">
            <Popover className="relative">
                {({ open, close }) => (
                    <>
                        <Popover.Button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center">
                            <svg
                                className="w-6 h-6"
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
                                {/* Wrap lazy loaded content in Suspense */}
                                <Suspense
                                    fallback={
                                        <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-900 py-44 px-6" />
                                        </div>
                                    }
                                >
                                    {open && (
                                        <LazyAvatarDropdownContent
                                            id={id}
                                            avatar_url={avatar_url}
                                            name={name}
                                            email={email}
                                            close={close}
                                            logOut={logOut}
                                        />
                                    )}
                                </Suspense>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    )
}

export default AvatarDropdown
