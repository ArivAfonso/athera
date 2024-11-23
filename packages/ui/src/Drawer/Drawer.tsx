'use client'

import { Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'

interface DrawerProps {
    isDrawerOpen: boolean
    closeDrawer: () => void
    heading: string
    children: ReactNode
}

const Drawer: React.FC<DrawerProps> = ({
    isDrawerOpen,
    closeDrawer,
    heading,
    children,
}) => {
    return (
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

                                    {/* Drawer heading */}
                                    <div className="px-4 pb-2 border-b border-gray-200 dark:border-gray-700 flex justify-center">
                                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            {heading}
                                        </h2>
                                    </div>

                                    {/* Drawer items */}
                                    <div className="mt-4 flex-1 overflow-y-auto px-4 space-y-2">
                                        {children}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Drawer
