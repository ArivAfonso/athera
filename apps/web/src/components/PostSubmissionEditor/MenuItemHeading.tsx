'use client'

import { Menu, Transition, Dialog } from '@headlessui/react'
import { Editor } from '@tiptap/react'
import React, { FC, Fragment, useState, ReactNode } from 'react'
import { TiptapBarItem } from './MenuBar'
import MenuItem from './MenuItem'
import {
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    Heading4Icon,
    Heading5Icon,
    Heading6Icon,
} from 'lucide-react'

interface Props {
    icon: ReactNode
    title: string
    action: (args?: any) => void
    isActive?: () => boolean
    editor: Editor
}

const MenuItemHeading: FC<Props> = ({
    action,
    icon,
    title,
    isActive,
    editor,
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const [headingItem] = useState<TiptapBarItem[]>([
        {
            icon: <Heading1Icon strokeWidth={1.5} />,
            title: 'Heading 1',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
            icon: <Heading2Icon strokeWidth={1.5} />,
            title: 'Heading 2',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            icon: <Heading3Icon strokeWidth={1.5} />,
            title: 'Heading 3',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
        },
        {
            icon: <Heading4Icon strokeWidth={1.5} />,
            title: 'Heading 4',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 4 }).run(),
            isActive: () => editor.isActive('heading', { level: 4 }),
        },
        {
            icon: <Heading5Icon strokeWidth={1.5} />,
            title: 'Heading 5',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 5 }).run(),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: <Heading6Icon strokeWidth={1.5} />,
            title: 'Heading 6',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 6 }).run(),
            isActive: () => editor.isActive('heading', { level: 6 }),
        },
    ])

    const openDrawer = () => setIsDrawerOpen(true)
    const closeDrawer = () => setIsDrawerOpen(false)

    const handleClick = (action: () => void, onClose: () => void) => {
        return () => {
            action()
            onClose()
        }
    }

    return (
        <>
            {/* For larger screens: Render Menu */}
            <div className="hidden sm:block">
                <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button as={'div'}>
                        <MenuItem
                            icon={icon}
                            title={title}
                            isActive={isActive}
                            action={action}
                        />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="focus:outline-none absolute left-1/2 transform -translate-x-1/2 mt-3 w-52 origin-top rounded-2xl bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="p-3 space-y-1">
                                {headingItem.map((item) => (
                                    <Menu.Item key={item.title}>
                                        {({ active }) => (
                                            <button
                                                className={`${
                                                    active ||
                                                    (item.isActive &&
                                                        item.isActive())
                                                        ? 'bg-primary-100 dark:bg-neutral-700 text-primary-900'
                                                        : ''
                                                } p-2 flex w-full items-center rounded-lg text-neutral-900 dark:text-white hover:bg-primary-100 dark:hover:bg-neutral-700 hover:text-primary-900 `}
                                                onClick={item.action}
                                                type="button"
                                            >
                                                {item.icon}
                                                <span className="ml-4">
                                                    {item.title}
                                                </span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>

            {/* For mobile: Render Drawer */}
            <div className="block sm:hidden">
                <MenuItem
                    icon={icon}
                    title={title}
                    isActive={isActive}
                    action={openDrawer}
                />

                <Transition show={isDrawerOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-50 overflow-hidden"
                        onClose={closeDrawer}
                    >
                        <div className="absolute inset-0 overflow-hidden">
                            {/* Background overlay */}
                            <Transition.Child
                                as={Fragment}
                                enter="transition-opacity ease-linear duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity ease-linear duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                            </Transition.Child>

                            {/* Drawer content */}
                            <div className="fixed inset-x-0 bottom-0 max-h-full flex">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transition ease-in-out duration-300 transform"
                                    enterFrom="translate-y-full"
                                    enterTo="translate-0"
                                    leave="transition ease-in-out duration-300 transform"
                                    leaveFrom="translate-0"
                                    leaveTo="translate-y-full"
                                >
                                    <Dialog.Panel className="w-screen max-h-96 bg-white dark:bg-neutral-800 shadow-xl rounded-t-2xl">
                                        <div className="h-full flex flex-col py-4">
                                            {/* Close button */}
                                            <div className="flex justify-end px-4">
                                                <button
                                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                                    onClick={closeDrawer}
                                                >
                                                    <span className="sr-only">
                                                        Close
                                                    </span>
                                                    <svg
                                                        className="h-6 w-6"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Drawer items */}
                                            <div className="mt-4 flex-1 overflow-y-auto px-4 space-y-2">
                                                {headingItem.map((item) => (
                                                    <button
                                                        key={item.title}
                                                        className={`${
                                                            item.isActive &&
                                                            item.isActive()
                                                                ? 'bg-primary-100 dark:bg-neutral-700 text-primary-900'
                                                                : ''
                                                        } p-2 flex w-full items-center rounded-lg text-neutral-900 dark:text-white hover:bg-primary-100 dark:hover:bg-neutral-700 hover:text-primary-900 `}
                                                        onClick={handleClick(
                                                            item.action,
                                                            closeDrawer
                                                        )}
                                                        type="button"
                                                    >
                                                        {item.icon}
                                                        <span className="ml-4">
                                                            {item.title}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </>
    )
}

export default MenuItemHeading
