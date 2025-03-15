'use client'

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Logo from '@/components/Logo/Logo'
import SwitchDarkMode from '@/components/SwitchDarkMode/SwitchDarkMode'
import AvatarDropdown from '@/components/Header/AvatarDropdown'
import classNames from '@/utils/classNames'
import Link from 'next/link'
import CreateBtn from '@/components/Header/CreateBtn'
import {
    AlignJustifyIcon,
    ArrowDownUpIcon,
    BellRingIcon,
    BookmarkIcon,
    CircleUserRoundIcon,
    Clock4Icon,
    EyeIcon,
    FilePlusIcon,
    FilesIcon,
    FolderIcon,
    FolderOpenIcon,
    HeartIcon,
    LayoutGridIcon,
    LinkIcon,
    LockIcon,
    PaletteIcon,
    PanelLeftClose,
    PanelRightClose,
    SearchIcon,
    SettingsIcon,
    UserIcon,
    UserRoundIcon,
    XIcon,
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import NotifyDropdown from '@/components/Header/NotifyDropdown'
import { AuthSession } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'
import SearchModal from '@/components/Header/SearchModal'

interface NavigationItem {
    name: string
    href: string
    icon?: any
    children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
    {
        name: 'posts',
        href: '/dashboard/posts/published',
        icon: FolderIcon,
        children: [
            { name: 'likes', href: '/dashboard/liked-posts', icon: HeartIcon },
            {
                name: 'watch history',
                href: '/dashboard/watch-history',
                icon: EyeIcon,
            },
            {
                name: 'bookmarks',
                href: '/dashboard/bookmarks',
                icon: BookmarkIcon,
            },
        ],
    },
    {
        name: 'new post',
        href: '/dashboard/new-post',
        icon: FilePlusIcon,
    },

    {
        name: 'edit profile',
        href: '/dashboard/edit-profile',
        icon: CircleUserRoundIcon,
        children: [
            {
                name: 'general',
                href: '/dashboard/edit-profile',
                icon: UserRoundIcon,
            },
            {
                name: 'password',
                href: '/dashboard/edit-profile/password',
                icon: LockIcon,
            },
        ],
    },
    {
        name: 'settings',
        href: '/dashboard/settings',
        icon: SettingsIcon,
    },
]

interface Props {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarOpenDesktop, setSidebarOpenDesktop] = useState(true)
    const [session, setSession] = useState<AuthSession>()
    const pathname = usePathname()

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()
            const { data: session } = await supabase.auth.getUser()
            //@ts-ignore
            setSession(session.session)
        }
        fetchData()
    }, [])

    const renderItem = (item: NavigationItem) => {
        let isCurrent = false
        //Check all the children hrefs
        if (item.children) {
            item.children.forEach((child) => {
                if (pathname === child.href) {
                    isCurrent = true
                }
            })
        }
        return (
            <li key={item.name}>
                <Link
                    href={item.href}
                    className={classNames(
                        isCurrent && pathname === item.href
                            ? 'bg-neutral-50 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-200'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-300',
                        'group flex gap-x-3 rounded-md p-2.5 ps-4 text-sm leading-6 font-medium capitalize'
                    )}
                >
                    <item.icon
                        className={classNames(
                            'text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-neutral-200',
                            'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                        strokeWidth={1.5}
                    />
                    {item.name}
                </Link>

                {item.children && (
                    <ul
                        role="list"
                        className="ps-[32px] relative mt-1 space-y-1"
                    >
                        <div className="absolute top-0 bottom-8 start-[22px] border-s border-neutral-200 dark:border-neutral-600"></div>

                        {item.children.map((child) => {
                            return (
                                <li key={child.name} className="relative">
                                    <div className="absolute w-4 h-4 top-2 -start-[10px] border rounded-lg rounded-t-none rounded-e-none border-e-0 border-t-0 border-neutral-200 dark:border-neutral-600"></div>
                                    <Link
                                        href={child.href}
                                        className={classNames(
                                            isCurrent && pathname === child.href
                                                ? 'bg-neutral-50 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-200'
                                                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-300',
                                            'group flex gap-x-3 rounded-md p-2.5 ps-4 text-sm leading-6 font-medium capitalize'
                                        )}
                                    >
                                        <child.icon
                                            className="h-6 w-6 shrink-0"
                                            aria-hidden="true"
                                            strokeWidth={1.5}
                                        />
                                        {child.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </li>
        )
    }

    const renderStaticSidebarForDesktop = () => {
        return (
            <div className="flex grow flex-col gap-y-5 overflow-y-auto hiddenScrollbar border-e border-neutral-200 dark:border-neutral-600 px-6 pb-4 bg-white dark:bg-neutral-900">
                <div className="flex pt-5 shrink-0 items-center">
                    <Logo />
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map(renderItem)}
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white dark:bg-neutral-800">
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-50 lg:hidden"
                        onClose={setSidebarOpen}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-neutral-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full rtl:translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full rtl:translate-x-full"
                            >
                                <Dialog.Panel className="relative me-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button
                                                type="button"
                                                className="-m-2.5 p-2.5"
                                                onClick={() =>
                                                    setSidebarOpen(false)
                                                }
                                            >
                                                <span className="sr-only">
                                                    Close sidebar
                                                </span>
                                                <XIcon
                                                    className="h-6 w-6 text-white"
                                                    aria-hidden="true"
                                                    strokeWidth={1.5}
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* Sidebar component, swap this element with another sidebar if you like */}
                                    {/* <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4"></div> */}
                                    {renderStaticSidebarForDesktop()}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <div className="flex items-center">
                    <div
                        className={`transform transition-transform duration-200 ease-in-out ${
                            sidebarOpenDesktop
                                ? 'translate-x-0'
                                : '-translate-x-full'
                        } hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col`}
                    >
                        {/* Sidebar component, swap this element with another sidebar if you like */}
                        {renderStaticSidebarForDesktop()}
                    </div>

                    <div
                        className={`flex-grow ${sidebarOpenDesktop ? 'lg:ps-72' : 'lg:ps-0'}`}
                    >
                        <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
                            <div className="flex h-16 sm:h-20 items-center gap-x-4 border-b border-neutral-200 dark:border-neutral-600 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none bg-white dark:bg-neutral-800">
                                <button
                                    type="button"
                                    className="-m-2.5 p-2.5 text-neutral-700 lg:hidden"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <span className="sr-only">
                                        Open sidebar
                                    </span>
                                    <AlignJustifyIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                        strokeWidth={1.5}
                                    />
                                </button>

                                <div className="hidden md:block">
                                    {sidebarOpenDesktop ? (
                                        <button
                                            className={`self-center text-2xl md:text-3xl w-12 h-12 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center`}
                                            onClick={() =>
                                                setSidebarOpenDesktop(
                                                    !sidebarOpenDesktop
                                                )
                                            }
                                        >
                                            <PanelLeftClose strokeWidth={1.5} />
                                        </button>
                                    ) : (
                                        <button
                                            className={`self-center text-2xl md:text-3xl w-12 h-12 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center`}
                                            onClick={() =>
                                                setSidebarOpenDesktop(
                                                    !sidebarOpenDesktop
                                                )
                                            }
                                        >
                                            <PanelRightClose
                                                strokeWidth={1.5}
                                            />
                                        </button>
                                    )}
                                </div>

                                {/* Separator */}
                                <div
                                    className="h-6 w-px bg-neutral-200 lg:hidden"
                                    aria-hidden="true"
                                />

                                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                                    <SearchModal type="bar" />
                                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                                        {/* Separator */}
                                        <div
                                            className="hidden lg:block lg:h-6 lg:w-px lg:bg-neutral-200 dark:bg-neutral-500"
                                            aria-hidden="true"
                                        />

                                        {/* Profile dropdown */}
                                        <div className="flex-1 flex items-center justify-end ">
                                            <CreateBtn />
                                            <SwitchDarkMode />
                                            <NotifyDropdown className="hidden md:block" />
                                            {session && (
                                                <AvatarDropdown
                                                    avatar_url={
                                                        session.user
                                                            .user_metadata
                                                            .avatar_url
                                                    }
                                                    name={
                                                        session.user
                                                            .user_metadata.name
                                                    }
                                                    email={
                                                        session.user.email
                                                            ? session.user.email
                                                            : ''
                                                    }
                                                    id={session.user.id}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <main className="pb-10">
                            <div className="mx-auto max-w-7xl px-3">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    )
}
