'use client'

import {
    BellIcon,
    CirclePlusIcon,
    HomeIcon,
    SearchIcon,
    SettingsIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function MobileBar() {
    const pathname = usePathname()

    const options = [
        {
            name: 'Home',
            path: '/',
            icon: HomeIcon,
        },
        {
            name: 'Search',
            path: '/search',
            icon: SearchIcon,
        },
        {
            name: 'Create',
            path: '/dashboard/new-source',
            icon: CirclePlusIcon,
        },
        {
            name: 'Settings',
            path: '/dashboard/settings',
            icon: SettingsIcon,
        },
        {
            name: 'Alerts',
            path: '/notifications',
            icon: BellIcon,
        },
    ]

    return (
        <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col-reverse">
            <div className="z-40 block w-full flex-1 border-t border-neutral-300 bg-white p-2 transition-transform duration-300 ease-in-out lg:hidden dark:border-neutral-700 dark:bg-neutral-800">
                <div className="mx-auto flex w-full max-w-screen-sm justify-around text-center text-2xl lg:max-w-screen-md ">
                    {options.map((option, index) => (
                        <Link
                            key={index}
                            href={option.path}
                            className={`FooterQuickNav__home flex flex-col items-center justify-between ${pathname == option.path ? 'text-neutral-900 dark:text-neutral-50' : 'text-neutral-500 dark:text-neutral-300/90'} `}
                        >
                            <option.icon
                                strokeWidth={1.5}
                                className="h-5 w-5 sm:h-6 sm:w-6"
                            />
                            <span className="mt-1 text-[10px] leading-none">
                                {option.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MobileBar
