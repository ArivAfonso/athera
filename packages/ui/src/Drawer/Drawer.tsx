'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

import { ReactNode } from 'react'

interface DrawerProps {
    isOpen: boolean // Controls whether the drawer is open or not
    onClose: () => void // Function to close the drawer
    position?: 'left' | 'right' | 'top' | 'bottom' // 'left', 'right', 'top', or 'bottom'
    size?: string // Tailwind size classes (e.g., 'w-64', 'max-w-md')
    className?: string // Additional custom styles for the drawer
    children: ReactNode // Drawer content
}

export default function Drawer({
    isOpen,
    onClose,
    position = 'right',
    size = 'max-w-md',
    className = '',
    children,
}: DrawerProps) {
    const getPositionClasses = () => {
        switch (position) {
            case 'left':
                return 'inset-y-0 left-0'
            case 'right':
                return 'inset-y-0 right-0'
            case 'top':
                return 'inset-x-0 top-0'
            case 'bottom':
                return 'inset-x-0 bottom-0'
            default:
                return 'inset-y-0 right-0' // Default is right
        }
    }

    return (
        <>
            <Transition show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-50 overflow-hidden"
                    onClose={onClose}
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

                        {/* Drawer panel */}
                        <div
                            className={`fixed ${getPositionClasses()} flex ${position === 'left' || position === 'right' ? 'max-w-full' : 'max-h-full'}`}
                        >
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom={
                                    position === 'left'
                                        ? '-translate-x-full'
                                        : position === 'right'
                                          ? 'translate-x-full'
                                          : position === 'top'
                                            ? '-translate-y-full'
                                            : 'translate-y-full'
                                }
                                enterTo="translate-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-0"
                                leaveTo={
                                    position === 'left'
                                        ? '-translate-x-full'
                                        : position === 'right'
                                          ? 'translate-x-full'
                                          : position === 'top'
                                            ? '-translate-y-full'
                                            : 'translate-y-full'
                                }
                            >
                                <Dialog.Panel
                                    className={`${size} ${className} bg-white dark:bg-neutral-800 shadow-xl`}
                                >
                                    {/* Close button */}
                                    <div className="p-4 flex justify-end">
                                        <button
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                            onClick={onClose}
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

                                    {/* Drawer content */}
                                    <div className="flex-1 p-4 overflow-y-auto">
                                        {children}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
