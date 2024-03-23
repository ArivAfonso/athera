'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
    ArrowsUpDownIcon,
    Bars3Icon,
    BellAlertIcon,
    BookmarkIcon,
    ClipboardDocumentIcon,
    ClockIcon,
    Cog8ToothIcon,
    DocumentPlusIcon,
    FolderIcon,
    FolderOpenIcon,
    HeartIcon,
    LightBulbIcon,
    LinkIcon,
    LockClosedIcon,
    PowerIcon,
    Squares2X2Icon,
    UserCircleIcon,
    UserGroupIcon,
    UserIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Logo from '@/components/Logo/Logo'
import LangDropdown from '@/components/Header/LangDropdown'
import SwitchDarkMode from '@/components/SwitchDarkMode/SwitchDarkMode'
import AvatarDropdown from '@/components/Header/AvatarDropdown'
import classNames from '@/utils/classNames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CreateBtn from '@/components/Header/CreateBtn'

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
            { name: 'published', href: '/dashboard/my-posts/published', icon: FolderOpenIcon },
            { name: 'scheduled', href: '/dashboard/my-posts/scheduled', icon: ClockIcon },
            { name: 'drafts', href: '/dashboard/my-posts/drafts', icon: ClipboardDocumentIcon },
            { name: 'likes', href: '/dashboard/liked-posts', icon: HeartIcon},
            { name: 'bookmarks', href: '/dashboard/bookmarks', icon: BookmarkIcon},
            { name: 'import/export', href: '/dashboard/my-posts/import-export', icon: ArrowsUpDownIcon}
        ],
    },
    {
        name: 'new post',
        href: '/dashboard/new-post',
        icon: DocumentPlusIcon,
    },

    {
        name: 'edit profile',
        href: '/dashboard/edit-profile',
        icon: UserCircleIcon,
        children: [
            { name: 'general', href: '/dashboard/edit-profile', icon: UserIcon},
            { name: 'password', href: '/dashboard/edit-profile/password', icon: LockClosedIcon},
            { name: 'notifications', href: '/dashboard/edit-profile/notifications', icon: BellAlertIcon },
            { name: 'social links', href: '/dashboard/edit-profile/socials', icon: LinkIcon },
        ],
    },  
    {
        name: 'settings',
        href: '/dashboard/settings',
        icon: Cog8ToothIcon,
        children: [
            {name: 'general', href: '/dashboard/settings', icon: Cog8ToothIcon},
            {name: 'integrations', href: '/dashboard/settings/integrations', icon: Squares2X2Icon},
        ]
    }
]

interface Props {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    //   const router = useRouter();
    //   const currentTab = router.query.tab || "published";

    const renderItem = (item: NavigationItem) => {

        return (
            <li key={item.name}>
                <Link
                    //@ts-ignore
                    href={item.href}
                    className={classNames(
                        'text-neutral-500 dark:text-neutral-300 hover:text-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-700 dark:hover:text-neutral-300',
                        'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-medium capitalize'
                    )}
                >
                     <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
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
                                        //@ts-ignore
                                        href={child.href}
                                        className={classNames(
                                            'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-700 dark:hover:text-neutral-300',
                                            'group flex gap-x-3 rounded-md p-2.5 ps-4 text-sm leading-6 font-medium capitalize'
                                        )}
                                    >
                                         <child.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
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
                                                <XMarkIcon
                                                    className="h-6 w-6 text-white"
                                                    aria-hidden="true"
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

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    {renderStaticSidebarForDesktop()}
                </div>

                <div className="lg:ps-72">
                    <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
                        <div className="flex h-16 sm:h-20 items-center gap-x-4 border-b border-neutral-200 dark:border-neutral-600 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none bg-white dark:bg-neutral-800">
                            <button
                                type="button"
                                className="-m-2.5 p-2.5 text-neutral-700 lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </button>

                            {/* Separator */}
                            <div
                                className="h-6 w-px bg-neutral-200 lg:hidden"
                                aria-hidden="true"
                            />

                            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                                <form
                                    className="relative flex flex-1"
                                    action="#"
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        const search =
                                            e.currentTarget.search.value
                                        // router.push(`/search/posts/${search}`);
                                    }}
                                >
                                    <label
                                        htmlFor="search-field"
                                        className="sr-only"
                                    >
                                        Search
                                    </label>
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute inset-y-0 start-0 h-full w-5 text-neutral-400"
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="search-field"
                                        className="block h-full w-full border-0 py-0 ps-8 pe-0 text-neutral-900 placeholder:text-neutral-400 focus:ring-0 sm:text-sm bg-transparent dark:text-white"
                                        placeholder="Search..."
                                        type="search"
                                        name="search"
                                    />
                                </form>
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
                                        {/* <AvatarDropdown /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <main className="pb-10">
                        <div className="mx-auto max-w-7xl">
                            {/* Replace with your content */}
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}
