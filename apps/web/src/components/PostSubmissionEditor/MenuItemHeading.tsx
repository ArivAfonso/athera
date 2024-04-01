import { Menu, Transition } from '@headlessui/react'
import { Editor } from '@tiptap/react'
import React, { FC, Fragment, useState, ReactNode } from 'react'
import { TiptapBarItem } from './MenuBar'
import MenuItem from './MenuItem'
import {
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    Heading4Icon,
    Heading5Icon,
    Heading6Icon,
} from 'lucide-react'

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
    const [headingItem] = useState<TiptapBarItem[]>([
        {
            icon: <Heading1Icon />,
            title: 'Heading 1',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
            icon: <Heading2Icon />,
            title: 'Heading 2',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            icon: <Heading3Icon />,
            title: 'Heading 3',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
        },
        {
            icon: <Heading4Icon />,
            title: 'Heading 4',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 4 }).run(),
            isActive: () => editor.isActive('heading', { level: 4 }),
        },
        {
            icon: <Heading5Icon />,
            title: 'Heading 5',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 5 }).run(),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: <Heading6Icon />,
            title: 'Heading 6',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 6 }).run(),
            isActive: () => editor.isActive('heading', { level: 6 }),
        },
    ])

    return (
        <>
            <Menu as="div" className="relative inline-block text-left">
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
                    <Menu.Items className="focus:outline-none absolute right-0 mt-3 w-52 origin-top-right rounded-2xl bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="p-3 space-y-1">
                            {headingItem.map((item) => (
                                <Menu.Item key={item.title}>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active ||
                                                (item.isActive &&
                                                    item.isActive())
                                                    ? 'bg-primary-100 dark:bg-neutral-700 text-primary-900'
                                                    : ''
                                            } p-2 flex w-full items-center rounded-lg text-neutral-900 dark:text-white hover:bg-primary-100 dark:hover:bg-neutral-700 hover:text-primary-900 `}
                                            onClick={item.action}
                                            type="button"
                                        >
                                            {icon}
                                            <span className="ml-4">
                                                {' '}
                                                {item.title}
                                            </span>
                                        </button>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    )
}

export default MenuItemHeading
