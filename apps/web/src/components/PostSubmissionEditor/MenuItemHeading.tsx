import { Menu, Transition } from '@headlessui/react'
import { Editor } from '@tiptap/react'
import React, { FC, Fragment, useState } from 'react'
import { TiptapBarItem } from './MenuBar'
import MenuItem from './MenuItem'

interface Props {
    icon: string
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
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0H24V24H0z"/><path d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21z"/></svg>`,
            title: 'Heading 1',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0H24V24H0z"/><path d="M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 4c2.071 0 3.75 1.679 3.75 3.75 0 .857-.288 1.648-.772 2.28l-.148.18L18.034 18H22v2h-7v-1.556l4.82-5.546c.268-.307.43-.709.43-1.148 0-.966-.784-1.75-1.75-1.75-.918 0-1.671.707-1.744 1.606l-.006.144h-2C14.75 9.679 16.429 8 18.5 8z"/></svg>`,
            title: 'Heading 2',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0H24V24H0z"/><path d="M22 8l-.002 2-2.505 2.883c1.59.435 2.757 1.89 2.757 3.617 0 2.071-1.679 3.75-3.75 3.75-1.826 0-3.347-1.305-3.682-3.033l1.964-.382c.156.806.866 1.415 1.718 1.415.966 0 1.75-.784 1.75-1.75s-.784-1.75-1.75-1.75c-.286 0-.556.069-.794.19l-1.307-1.547L19.35 10H15V8h7zM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2z"/></svg>`,
            title: 'Heading 3',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0H24V24H0z"/><path d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm9-12v8h1.5v2H22v2h-2v-2h-5.5v-1.34l5-8.66H22zm-2 3.133L17.19 16H20v-4.867z"/></svg>`,
            title: 'Heading 4',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 4 }).run(),
            isActive: () => editor.isActive('heading', { level: 4 }),
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0H24V24H0z"/><path d="M22 8v2h-4.323l-.464 2.636c.33-.089.678-.136 1.037-.136 2.21 0 4 1.79 4 4s-1.79 4-4 4c-1.827 0-3.367-1.224-3.846-2.897l1.923-.551c.24.836 1.01 1.448 1.923 1.448 1.105 0 2-.895 2-2s-.895-2-2-2c-.63 0-1.193.292-1.56.748l-1.81-.904L16 8h6zM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2z"/></svg>`,
            title: 'Heading 5',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 5 }).run(),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0H24V24H0z"/><path d="M21.097 8l-2.598 4.5c2.21 0 4.001 1.79 4.001 4s-1.79 4-4 4-4-1.79-4-4c0-.736.199-1.426.546-2.019L18.788 8h2.309zM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z"/></svg>`,
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
                                            <div
                                                className="menu-item-svg flex flex-shrink-0 items-center justify-center h-6 w-6"
                                                dangerouslySetInnerHTML={{
                                                    __html: item.icon,
                                                }}
                                            ></div>
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
