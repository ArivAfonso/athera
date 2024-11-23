'use client'

import React, { FC, useState } from 'react'
import Logo from '@/components/Logo/Logo'
import Navigation from '@/components/Navigation/Navigation'
import MenuBar from '@/components/MenuBar/MenuBar'
import SearchModal from './SearchModal'
import AvatarDropdown from './AvatarDropdown'
import NotifyDropdown from './NotifyDropdown'
import { ButtonThird } from 'ui'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'
import { Session } from '@supabase/supabase-js'

export interface MainNavProps {}

const MainNav: FC<MainNavProps> = ({}) => {
    const [session, setSession] = useState<Session | null>()

    useEffect(() => {
        async function fetchUser() {
            const supabase = createClient()
            const { data } = await supabase.auth.getSession()
            setSession(data?.session)
        }

        fetchUser()
    })
    return (
        <div className="MainNav relative z-99 bg-white dark:bg-slate-900  border-b border-neutral-200/70 dark:border-transparent">
            <div className="container">
                <div className="h-20 py-5 flex justify-between items-center">
                    <div className="flex items-center lg:hidden flex-1">
                        <MenuBar />
                    </div>

                    <div className="flex justify-center lg:justify-start flex-1 items-center space-x-4 sm:space-x-10 2xl:space-x-14">
                        <Logo />
                        <Navigation className="hidden lg:flex" />
                    </div>

                    <div className="flex-1 flex items-center justify-end text-neutral-700 dark:text-neutral-100 space-x-1">
                        <div className="hidden items-center lg:flex">
                            <Link
                                href="https://github.com/ArivAfonso/athera"
                                className={`self-center text-2xl md:text-3xl w-12 h-12 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center`}
                            >
                                <span className="sr-only">
                                    Enable dark mode
                                </span>
                                <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M16 22.0268V19.1568C16.0375 18.68 15.9731 18.2006 15.811 17.7506C15.6489 17.3006 15.3929 16.8902 15.06 16.5468C18.2 16.1968 21.5 15.0068 21.5 9.54679C21.4997 8.15062 20.9627 6.80799 20 5.79679C20.4558 4.5753 20.4236 3.22514 19.91 2.02679C19.91 2.02679 18.73 1.67679 16 3.50679C13.708 2.88561 11.292 2.88561 8.99999 3.50679C6.26999 1.67679 5.08999 2.02679 5.08999 2.02679C4.57636 3.22514 4.54413 4.5753 4.99999 5.79679C4.03011 6.81549 3.49251 8.17026 3.49999 9.57679C3.49999 14.9968 6.79998 16.1868 9.93998 16.5768C9.61098 16.9168 9.35725 17.3222 9.19529 17.7667C9.03334 18.2112 8.96679 18.6849 8.99999 19.1568V22.0268"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M9 20.0267C6 20.9999 3.5 20.0267 2 17.0267"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </Link>
                            <SearchModal />
                            {/* if user exists show avatar dropdown else button */}
                            {session ? (
                                <>
                                    <NotifyDropdown className="hidden md:block z-40" />
                                    <AvatarDropdown
                                        avatar_url={
                                            session?.user.user_metadata
                                                .avatar_url
                                        }
                                        name={session?.user.user_metadata.name}
                                        email={
                                            session?.user.email
                                                ? session?.user.email
                                                : ''
                                        }
                                        id={session?.user.id}
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="px-1"></div>
                                    <ButtonThird
                                        sizeClass="py-3 px-4 sm:px-6"
                                        //className="hover:bg-neutral-200 bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-gray-200"
                                        href="/signup"
                                        pattern="third"
                                    >
                                        Sign Up
                                    </ButtonThird>
                                </>
                            )}
                        </div>
                        <div className="flex items-center lg:hidden">
                            {
                                // if user exists show avatar dropdown else button
                                session ? (
                                    <AvatarDropdown
                                        avatar_url={
                                            session?.user.user_metadata
                                                .avatar_url
                                        }
                                        name={session?.user.user_metadata.name}
                                        email={
                                            session?.user.email
                                                ? session?.user.email
                                                : ''
                                        }
                                        id={session?.user.id}
                                    />
                                ) : (
                                    <SearchModal />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainNav
