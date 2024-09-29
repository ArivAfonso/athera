'use client'

import { Menu, Transition, Dialog, Popover } from '@headlessui/react'
import { Editor } from '@tiptap/react'
import React, { FC, Fragment, useState, ReactNode, useCallback } from 'react'
import MenuItem from './MenuItem'
import { DEFAULT_COLORS } from './colors'
import { CheckIcon } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { debounce } from 'lodash'

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
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [color, setColor] = useState<string>('#000000')

    const openDrawer = () => setIsDrawerOpen(true)
    const closeDrawer = () => setIsDrawerOpen(false)

    const handleColorClick = (color: string) => {
        setSelectedColor(color)
        editor.chain().focus().unsetHighlight().run()
        if (color) {
            editor
                .chain()
                .focus()
                .toggleHighlight({ color: color.toLowerCase() })
                .run()
        }
        closeDrawer()
    }

    const debouncedToggleHighlight = useCallback(
        debounce((color: string) => {
            editor.chain().focus().unsetHighlight().run()
            if (color) {
                editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: color.toLowerCase() })
                    .run()
            }
        }, 2000),
        [editor]
    )

    const handleColorChange = (newColor: string) => {
        setColor(newColor)
        debouncedToggleHighlight(newColor)
    }

    return (
        <>
            {/* For larger screens: Render Menu */}
            <div className="hidden sm:block">
                <Menu as="div" className="relative inline-block">
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
                        <Menu.Items className="focus:outline-none absolute transform -translate-x-1/2 mt-3 w-80 origin-top rounded-2xl bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="p-4 grid grid-cols-10 gap-2">
                                {DEFAULT_COLORS.map((color, key) => (
                                    <div
                                        key={key}
                                        className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer ${color.value === '#FFFFFF' ? 'border-[1px] border-gray-300' : ''}`}
                                        style={{ backgroundColor: color.value }}
                                        onClick={() =>
                                            handleColorClick(color.value)
                                        }
                                        title={color.name}
                                    >
                                        {selectedColor === color.value && (
                                            <CheckIcon className="w-4 h-4 text-black" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 pb-4 flex justify-center">
                                <Popover className="relative">
                                    <Popover.Button className="px-3 py-1 text-sm font-medium dark:text-white text-neutral-800 bg-transparent rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 border-[1px] border-neutral-400 dark:border-neutral-700 focus:outline-none mr-2">
                                        Custom
                                    </Popover.Button>
                                    <button
                                        className="px-3 py-1 text-sm font-medium dark:text-white text-neutral-800 bg-transparent rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 border-[1px] border-neutral-400 dark:border-neutral-700 focus:outline-none"
                                        onClick={() =>
                                            editor
                                                .chain()
                                                .focus()
                                                .toggleHighlight()
                                                .run()
                                        }
                                    >
                                        Toggle
                                    </button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute z-10 w-48 px-4 mb-3 transform -translate-x-1/2 bottom-full left-1/2 sm:px-0">
                                            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                                <HexColorPicker
                                                    color={color}
                                                    onChange={handleColorChange}
                                                />
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </Popover>
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
                                                <div className="p-4 grid grid-cols-10 gap-2">
                                                    {DEFAULT_COLORS.map(
                                                        (color, key) => (
                                                            <div
                                                                key={key}
                                                                className={`w-6 h-6 rounded-md cursor-pointer ${color.value === '#FFFFFF' ? 'border-[1px] border-gray-300' : ''}`}
                                                                style={{
                                                                    backgroundColor:
                                                                        color.value,
                                                                }}
                                                                onClick={() =>
                                                                    handleColorClick(
                                                                        color.value
                                                                    )
                                                                }
                                                                title={
                                                                    color.name
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                <div className="px-4 pb-4 flex justify-center">
                                                    <Popover className="relative">
                                                        <Popover.Button className="px-3 py-1 text-sm font-medium dark:text-white text-neutral-800 bg-transparent rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 border-[1px] border-neutral-400 dark:border-neutral-700 focus:outline-none mr-2">
                                                            Custom
                                                        </Popover.Button>
                                                        <button
                                                            className="px-3 py-1 text-sm font-medium dark:text-white text-neutral-800 bg-transparent rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 border-[1px] border-neutral-400 dark:border-neutral-700 focus:outline-none"
                                                            onClick={() =>
                                                                editor
                                                                    .chain()
                                                                    .focus()
                                                                    .toggleHighlight()
                                                                    .run()
                                                            }
                                                        >
                                                            Toggle
                                                        </button>
                                                        <Transition
                                                            as={Fragment}
                                                            enter="transition ease-out duration-200"
                                                            enterFrom="opacity-0 translate-y-1"
                                                            enterTo="opacity-100 translate-y-0"
                                                            leave="transition ease-in duration-150"
                                                            leaveFrom="opacity-100 translate-y-0"
                                                            leaveTo="opacity-0 translate-y-1"
                                                        >
                                                            <Popover.Panel className="absolute z-10 w-48 px-4 mb-3 transform -translate-x-1/2 bottom-full left-1/2 sm:px-0">
                                                                <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                                                    <HexColorPicker
                                                                        color={
                                                                            color
                                                                        }
                                                                        onChange={
                                                                            handleColorChange
                                                                        }
                                                                    />
                                                                </div>
                                                            </Popover.Panel>
                                                        </Transition>
                                                    </Popover>
                                                </div>
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
