'use client'

import React, { FC } from 'react'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@/app/headlessui'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { Button } from 'ui'

export interface TopicFilterListBoxProps {
    className?: string
    lists: { name: string }[]
    onFilterClick: (name: string) => void
}

const TopicFilterListBox: FC<TopicFilterListBoxProps> = ({
    className = '',
    lists,
    onFilterClick,
}) => {
    const [selected, setSelected] = useState(lists[0])
    const handleFilterClick = (item: { name: string }) => {
        setSelected(item)
        onFilterClick(item.name) // Call the onFilterClick function with the selected filter option
    }
    return (
        <div className={`TopicFilterListBox flex-shrink-0 ${className}`}>
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative">
                    <Listbox.Button as={'div'}>
                        <Button pattern="third" fontSize="text-sm font-medium">
                            {selected.name}
                            <ChevronDownIcon
                                className="w-4 h-4 ml-2 -mr-1"
                                aria-hidden="true"
                            />
                        </Button>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute right-0 w-52 py-1 mt-2 overflow-auto text-sm text-neutral-900 dark:text-neutral-200 bg-white rounded-xl shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-900 dark:ring-neutral-700 z-50">
                            {lists.map((item, index: number) => (
                                <Listbox.Option
                                    key={index}
                                    className={({ active }) =>
                                        `${
                                            active
                                                ? 'text-primary-700 dark:text-neutral-200 bg-primary-50 dark:bg-neutral-700'
                                                : ''
                                        } cursor-default select-none relative py-2 pl-10 pr-4`
                                    }
                                    value={item}
                                    onClick={() => handleFilterClick(item)}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`${
                                                    selected
                                                        ? 'font-medium'
                                                        : 'font-normal'
                                                } block truncate`}
                                            >
                                                {item.name}
                                            </span>
                                            {selected ? (
                                                <span className="text-primary-700 absolute inset-y-0 left-0 flex items-center pl-3 dark:text-neutral-200">
                                                    <CheckIcon
                                                        className="w-5 h-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    )
}

export default TopicFilterListBox
