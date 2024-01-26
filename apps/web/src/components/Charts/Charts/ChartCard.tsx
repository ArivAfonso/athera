import React, { ReactNode, ReactElement } from 'react'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'
interface CardsProps {
    title?: ReactNode
    size?: string
    more?: ReactNode
    bodyStyle?: React.CSSProperties
    headStyle?: React.CSSProperties
    isbutton?: ReactNode
    headless?: boolean
    border?: boolean
    caption?: string
    bodypadding?: string
    className?: string
    moreText?: boolean
    children?: ReactNode
}

function Cards(props: CardsProps): ReactElement {
    const {
        title,
        children,
        more,
        size,
        headless,
        caption,
        isbutton,
        bodyStyle,
        headStyle,
        border,
        bodypadding,
        className,
        moreText,
    } = props

    return (
        <>
            {!headless ? (
                <div
                    className={`bg-white dark:bg-[#1b1e2b] rounded-xl ${className}`}
                >
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-[#323541]">
                        <h4 className="text-xl font-semibold">{title}</h4>
                        <div className="flex items-center gap-2">
                            {isbutton && isbutton}
                            {more && (
                                <Menu
                                    as="div"
                                    className="relative inline-block text-left"
                                >
                                    {({ open }) => (
                                        <>
                                            <Menu.Button className="flex items-center group focus:outline-none">
                                                <EllipsisHorizontalIcon className="w-5 h-5 text-light dark:text-white60 group-hover:text-white87" />
                                            </Menu.Button>
                                            <Transition
                                                show={open}
                                                enter="transition-opacity duration-100"
                                                enterFrom="opacity-0"
                                                enterTo="opacity-100"
                                                leave="transition-opacity duration-75"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Menu.Items
                                                    static
                                                    className="origin-top-right absolute right-0 mt-2 bg-white dark:bg-[#1b1e2b] border border-gray-200 dark:border-[#323541] focus:outline-none rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 dark:divide-[#323541]"
                                                >
                                                    {more}
                                                </Menu.Items>
                                            </Transition>
                                        </>
                                    )}
                                </Menu>
                            )}
                        </div>
                    </div>
                    <div
                        className={`p-5 ${bodyStyle && bodyStyle}`}
                        style={{
                            borderBottom: border ? '1px solid #e5e7eb' : 'none',
                        }}
                    >
                        {children}
                    </div>
                </div>
            ) : (
                <div className={`bg-white dark:bg-[#1b1e2b] ${className}`}>
                    {title && (
                        <h4 className="px-5 pt-5 text-lg font-semibold">
                            {title}
                        </h4>
                    )}
                    {caption && <p className="px-5 pb-5 text-sm">{caption}</p>}
                    <div className={`p-5 ${bodyStyle && bodyStyle}`}>
                        {children}
                    </div>
                </div>
            )}
        </>
    )
}

Cards.defaultProps = {
    border: false,
}

export { Cards }
