import React, { FC } from 'react'
import Logo from '@/components/Logo/Logo'
import Navigation from '@/components/Navigation/Navigation'
import MenuBar from '@/components/MenuBar/MenuBar'
import SwitchDarkMode from '@/components/SwitchDarkMode/SwitchDarkMode'
import SearchModal from './SearchModal'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AvatarDropdown from './AvatarDropdown'
import NotifyDropdown from './NotifyDropdown'
import { ButtonThird } from 'ui'

export interface MainNavProps {}

//@ts-ignore
const MainNav: FC<MainNavProps> = async ({}) => {
    const supabase = createServerComponentClient({ cookies })
    const { data: session } = await supabase.auth.getSession()
    const user = session?.session?.user
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
                            <SwitchDarkMode />
                            <SearchModal />
                            {/* if user exists show avatar dropdown else button */}
                            {user ? (
                                <>
                                    <NotifyDropdown className="hidden md:block z-40" />
                                    <AvatarDropdown
                                        avatar_url={
                                            user.user_metadata.avatar_url
                                        }
                                        name={user.user_metadata.name}
                                        email={user.email ? user.email : ''}
                                        id={user.id}
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
                                user ? (
                                    <AvatarDropdown
                                        avatar_url={
                                            user.user_metadata.avatar_url
                                        }
                                        name={user.user_metadata.name}
                                        email={user.email ? user.email : ''}
                                        id={user.id}
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
