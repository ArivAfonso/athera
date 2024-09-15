'use client'

import React, { FC, Fragment, ReactNode } from 'react'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'

export interface DropDownItem<T = string> {
    id: T
    name: string
    icon: string
    href?: string
    isTargetBlank?: boolean
}

export interface DropDownProps<T> {
    className?: string
    panelMenusClass?: string
    triggerIconClass?: string
    data: DropDownItem<T>[]
    renderTrigger?: () => ReactNode
    renderItem?: (item: DropDownItem<T>) => JSX.Element
    title?: string
    onClick: (item: DropDownItem<T>) => void
    dropdownItemsClass?: string
}

function DropDown<T>({
    className = `h-8 w-8 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center`,
    triggerIconClass = 'h-6 w-6',
    panelMenusClass = 'origin-top-right -top-1',
    dropdownItemsClass = 'cursor-pointer flex items-center rounded-xl w-full px-3 py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 truncate ',
    title = 'More',
    renderTrigger,
    renderItem,
    data,
    onClick,
}: DropDownProps<T>) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className={className} title={title}>
                {renderTrigger ? (
                    renderTrigger()
                ) : (
                    <EllipsisHorizontalIcon className={triggerIconClass} />
                )}
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
                <Menu.Items
                    className={`absolute ${panelMenusClass} end-0 w-56 bg-white dark:bg-neutral-900 rounded-2xl divide-y divide-neutral-100 shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-10 focus:outline-none z-30`}
                >
                    <div className="px-1.5 py-2 text-sm text-neutral-600 dark:text-neutral-300">
                        {data.map((item) => (
                            <Menu.Item
                                as={
                                    !!item.href
                                        ? item.isTargetBlank
                                            ? 'a'
                                            : Link
                                        : 'div'
                                }
                                // @ts-ignore
                                href={item.href ?? undefined}
                                key={item.id as string}
                                onClick={() => onClick(item)}
                                data-menu-item-id={item.id}
                                className={dropdownItemsClass}
                                target={
                                    item.isTargetBlank ? '_blank' : undefined
                                }
                            >
                                {() =>
                                    renderItem &&
                                    typeof renderItem(item) !== 'undefined' ? (
                                        renderItem(item)
                                    ) : (
                                        <>
                                            {!!item.icon && (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.icon,
                                                    }}
                                                />
                                            )}
                                            <span className="ms-3">
                                                {item.name}
                                            </span>
                                        </>
                                    )
                                }
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default DropDown
