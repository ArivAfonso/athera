import {
    addIdsToHeadings,
    checkHeadingIds,
    parseHeadings,
} from '@/utils/addIdsToHeadings'
import { createClient } from '@/utils/supabase/client'
import { Popover, Transition } from '@headlessui/react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import React, { Fragment, useEffect, useState } from 'react'

type HeadingNode = {
    tag: string
    id: string
    text: string
    level: number
    children?: HeadingNode[]
}

interface TableContentProps {
    content: JSON
    id: string
    className?: string
    btnClassName?: string
}

const TableContent: React.FC<TableContentProps> = ({
    content,
    id,
    className = '',
    btnClassName = 'relative rounded-full flex items-center justify-center h-9 w-9 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700',
}) => {
    const [headings, setHeadings] = useState<HeadingNode[]>([])

    useEffect(() => {
        async function getHeadings() {
            const isHeadings = checkHeadingIds(content)

            const supabase = createClient()
            if (!isHeadings.isValid) {
                const headings = addIdsToHeadings(content)

                const { data, error } = await supabase
                    .from('posts')
                    .update({ json: headings })
                    .eq('id', id)
                setHeadings(parseHeadings(headings))
            } else {
                setHeadings(parseHeadings(content))
            }
        }

        getHeadings()
    }, [content, id])

    // const headingsWrapList = extractHeadings(content)

    const renderHeadings = (headings: HeadingNode[]) => {
        return (
            <>
                {headings.map((heading) => {
                    return (
                        <li key={heading.id}>
                            <a
                                className="inline-flex gap-2 hover:text-neutral-800 dark:hover:text-neutral-200"
                                href={`#${heading.id}`}
                            >
                                <ArrowRightIcon className="h-3 w-3 flex-shrink-0 self-center rtl:rotate-180" />
                                {heading.text}
                            </a>
                            {heading.children && heading.children.length > 0 ? (
                                <ol className="mt-2 space-y-3 ps-4 text-neutral-500 dark:text-neutral-300">
                                    {renderHeadings(heading.children)}
                                </ol>
                            ) : null}
                        </li>
                    )
                })}
            </>
        )
    }

    const renderContent = () => {
        return (
            <nav>
                <h2
                    id="on-this-page-title"
                    className="font-display text-sm font-medium text-slate-900 dark:text-white"
                >
                    On this page
                </h2>
                <div className="">
                    <ol className="mt-4 space-y-3 text-sm">
                        {renderHeadings(headings)}
                    </ol>
                </div>
            </nav>
        )
    }

    return (
        <div className={className}>
            <Popover className="relative z-40">
                {({ open }) => (
                    <>
                        <Popover.Button
                            className={`${
                                open ? '' : 'text-opacity-90'
                            } group ${btnClassName} focus:outline-none focus-visible:ring-0`}
                            title="Table of contents"
                        >
                            <svg
                                className="h-[18px] w-[18px]"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M8 2V5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M16 2V5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8 11H16"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8 16H12"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            {/* <ChevronDownIcon
                className={`${
                  open ? "-rotate-180" : ""
                } h-3 w-3 transition duration-150 ease-in-out`}
                aria-hidden="true"
              /> */}
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
                            <Popover.Panel className="lg:s-0 hiddenScrollbar absolute -end-2.5 bottom-full z-40 mb-5 max-h-[min(70vh,600px)] w-screen max-w-[min(90vw,20rem)] overflow-y-auto rounded-xl bg-white shadow-xl ring-1 ring-black/5 lg:end-auto lg:max-w-md lg:-translate-x-1/2 rtl:lg:translate-x-1/2 dark:bg-neutral-800 dark:ring-neutral-600">
                                <div className="relative p-4 sm:p-7">
                                    {renderContent()}
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    )
}

export default TableContent
