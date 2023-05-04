'use client'

import React, { FC } from 'react'
import Logo from '@/components/Logo/Logo'
import MenuBar from '@/components/MenuBar/MenuBar'
import AvatarDropdown from './AvatarDropdown'
import Navigation from '@/components/Navigation/Navigation'
import SearchModal from './SearchModal'

export interface MainNav2LoggedProps {}

const MainNav2Logged: FC<MainNav2LoggedProps> = () => {
    const renderContent = () => {
        return (
            <div className="h-20 flex justify-between">
                <div className="flex items-center lg:hidden flex-1">
                    <MenuBar />
                </div>

                <div className="lg:flex-1 flex items-center">
                    <Logo />
                </div>

                <div className="flex-[2] hidden lg:flex justify-center mx-4">
                    <Navigation />
                </div>

                <div className="flex-1 flex items-center justify-end text-slate-700 dark:text-slate-100">
                    <SearchModal />
                    <AvatarDropdown />
                </div>
            </div>
        )
    }

    return (
        <div className="nc-MainNav2Logged relative z-10 bg-white dark:bg-neutral-900 border-b border-slate-100 dark:border-slate-700">
            <div className="container ">{renderContent()}</div>
        </div>
    )
}

export default MainNav2Logged
