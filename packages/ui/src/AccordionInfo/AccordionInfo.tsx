'use client'
import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { FC, ReactNode } from 'react'

interface AccordionItem {
    name: string
    component: ReactNode
}

interface Props {
    panelClassName?: string
    data?: AccordionItem[]
    defaultOpen?: boolean
}

const AccordionInfo: FC<Props> = ({
    panelClassName = 'p-4 pt-3 last:pb-0 text-slate-600 text-lg dark:text-slate-300 leading-6',
    data = [],
    defaultOpen = false,
}) => {
    return (
        <div className="w-full rounded-2xl space-y-2.5">
            {data.map((item, index) => {
                return (
                    <Disclosure key={index} defaultOpen={defaultOpen}>
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 font-medium text-left bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75 ">
                                    <span>{item.name}</span>
                                    {!open ? (
                                        <PlusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    ) : (
                                        <MinusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    )}
                                </Disclosure.Button>
                                <Disclosure.Panel className={panelClassName}>
                                    {item.component}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                )
            })}
        </div>
    )
}

export default AccordionInfo
