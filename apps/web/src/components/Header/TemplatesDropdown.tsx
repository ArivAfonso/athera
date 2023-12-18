'use client'

import { Popover, Transition } from '@/app/headlessui'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'
import { MEGAMENU_TEMPLATES } from '@/data/navigation'
import { NavItemType } from '@/components/Navigation/NavigationItem'
import Link from 'next/link'
import NcImage from '../NcImage/NcImage'
import { Route } from '@/routers/types'

export default function TemplatesDropdown() {
    const renderMegaMenuNavlink = (item: NavItemType) => {
        return (
            <li key={item.id} className={`${item.isNew ? 'menuIsNew' : ''}`}>
                <Link
                    className="font-normal text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white"
                    href={{
                        pathname: item.href || undefined,
                    }}
                >
                    {item.name}
                </Link>
            </li>
        )
    }

    return (
        <div className="TemplatesDropdown hidden lg:block">
            <Popover className="">
                {({ open, close }) => (
                    <>
                        <Popover.Button
                            className={`
                ${open ? '' : 'text-opacity-80'}
                group h-10 sm:h-12 px-3 py-1.5 inline-flex items-center text-sm text-gray-800 dark:text-slate-300 font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                            <span className="">Templates</span>
                            <ChevronDownIcon
                                className={`${open ? '-rotate-180' : ''}
                  ml-1 h-4 w-4 transition ease-in-out duration-150 `}
                                aria-hidden="true"
                            />
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute z-20 w-full mt-3.5 inset-x-0">
                                <div className="bg-white dark:bg-neutral-900 shadow-lg">
                                    <div className="container">
                                        <div className="flex text-sm border-t border-slate-200 dark:border-slate-700 py-14">
                                            <div className="flex-1 grid grid-cols-4 gap-6 pr-6 xl:pr-8">
                                                {MEGAMENU_TEMPLATES.map(
                                                    (item, index) => (
                                                        <div key={index}>
                                                            <p className="font-medium text-slate-900 dark:text-neutral-200">
                                                                {item.name}
                                                            </p>
                                                            <ul className="grid space-y-4 mt-4">
                                                                {item.children?.map(
                                                                    renderMegaMenuNavlink
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    )
}
