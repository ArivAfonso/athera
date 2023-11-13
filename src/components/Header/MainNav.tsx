import React, { FC } from 'react'
import Logo from '@/components/Logo/Logo'
import Navigation from '@/components/Navigation/Navigation'
import MenuBar from '@/components/MenuBar/MenuBar'
import SwitchDarkMode from '@/components/SwitchDarkMode/SwitchDarkMode'
import SearchModal from './SearchModal'
import Button from '../Button/Button'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AvatarDropdown from './AvatarDropdown'
import { use } from 'react'

async function getUser() {
    const supabase = createServerComponentClient({ cookies })

    const {
        data: { user },
    } = await supabase.auth.getUser()
    return user
}

export interface MainNavProps {}

const MainNav: FC<MainNavProps> = ({}) => {
    const user = use(getUser())
    return (
        <div className="nc-MainNav relative z-10 bg-white dark:bg-slate-900 ">
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
                                <AvatarDropdown
                                    avatar_url={user.user_metadata.avatar_url}
                                    name={user.user_metadata.name}
                                    email={user.email ? user.email : ''}
                                    id={user.id}
                                />
                            ) : (
                                <>
                                    <div className="px-1"></div>
                                    <Button
                                        sizeClass="py-3 px-4 sm:px-6"
                                        className="bg-athera-blue hover:bg-primary-700 text-white"
                                        href="/signup"
                                        pattern="primary"
                                    >
                                        Sign up
                                    </Button>
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
