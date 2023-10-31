'use client'

import { FC, Fragment, ReactNode, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {
    ExclamationTriangleIcon,
    FolderIcon,
    LifebuoyIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { DEMO_AUTHORS } from '@/data/authors'
import { DEMO_CATEGORIES } from '@/data/taxonomies'
import { DEMO_POSTS } from '@/data/posts'
import Link from 'next/link'
import { Route } from '@/routers/types'
import { redirect, useRouter } from 'next/navigation'
import { UrlObject } from 'url'

interface Props {
    renderTrigger?: () => ReactNode
}

const SearchModal: FC<Props> = ({ renderTrigger }) => {
    const [open, setOpen] = useState(false)
    const [rawQuery, setRawQuery] = useState('')

    const router = useRouter()

    const query = rawQuery.toLowerCase().replace(/^[#>]/, '')
    const handleClose = () => {
        setRawQuery('')
        setOpen(false)
    }

    return (
        <>
            <div onClick={() => setOpen(true)} className="cursor-pointer">
                {renderTrigger ? (
                    renderTrigger()
                ) : (
                    <button className="flex w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none items-center justify-center">
                        <svg
                            width={22}
                            height={22}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M22 22L20 20"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}
            </div>

            <Transition.Root
                show={open}
                as={Fragment}
                afterLeave={() => setRawQuery('')}
                appear
            >
                <Dialog
                    as="div"
                    className="relative z-[99]"
                    onClose={() => setOpen(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-100"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-100"
                        >
                            <Dialog.Panel
                                className="block mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
                                as="form"
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    router.push(`/search/${query}`)
                                    handleClose()
                                }}
                            >
                                <Combobox
                                    onChange={(item: any) => {
                                        router.push(item.href)
                                        setOpen(false)
                                    }}
                                    name="searchpallet"
                                >
                                    <div className="relative">
                                        <MagnifyingGlassIcon
                                            className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                        <Combobox.Input
                                            className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                            placeholder="Search..."
                                            onChange={(event) =>
                                                setRawQuery(event.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="flex flex-wrap items-center bg-gray-50 py-2.5 px-4 text-xs text-gray-700">
                                        <Link
                                            href={
                                                '/search' as unknown as UrlObject
                                            }
                                            className="mx-1 flex h-5 px-1.5 items-center justify-center rounded border bg-white sm:mx-2 border-primary-6000 text-neutral-900"
                                            onClick={() => setOpen(false)}
                                        >
                                            Go to search page
                                        </Link>{' '}
                                    </div>
                                </Combobox>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

export default SearchModal
