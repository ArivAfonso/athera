import { BubbleMenu, Editor } from '@tiptap/react'
import React, { FC, Fragment, useState } from 'react'
import { TiptapBarItem } from './MenuBar'
import ModalGetLink from './ModalGetLink'

interface MyBubbleMenuProps {
    editor: Editor
}

const MyBubbleMenu: FC<MyBubbleMenuProps> = ({ editor }) => {
    const [menuItems] = useState<TiptapBarItem[]>([
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"/></svg>`,
            title: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z"/></svg>`,
            title: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"/></svg>`,
            title: 'Link',
            action: () => setLinkFuc(),
            isActive: () => editor.isActive('link'),
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M17 17h5v2h-3v3h-2v-5zM7 7H2V5h3V2h2v5zm11.364 8.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"/></svg>`,
            title: 'Unlink',
            action: () => editor.chain().focus().unsetLink().run(),
            isActive: () => editor.isActive('link'),
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/></svg>`,
            title: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },

        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z"/></svg>`,
            title: 'Code',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: () => editor.isActive('code'),
        },
    ])

    const [isOpenSetLinkModal, setIsOpenSetLinkModal] = useState(false)

    const setLinkFuc = () => {
        setIsOpenSetLinkModal(true)
    }

    const setLink = (url: string) => {
        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        // update link
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run()
    }

    const renderItem = (item: TiptapBarItem) => {
        return (
            <button
                className={`px-1.5 ${
                    item.isActive && item.isActive()
                        ? ' is-active text-green-500'
                        : ''
                }`}
                onClick={item.action}
                title={item.title}
                type="button"
            >
                <img
                    className="w-6 h-6"
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(
                        item.icon
                    )}`}
                />
            </button>
        )
    }

    return (
        //   @ts-ignore
        <BubbleMenu
            className="p-3 dark:bg-neutral-800 bg-neutral-200 dark:text-neutral-200 text-neutral-900 flex justify-center rounded-xl"
            editor={editor}
            tippyOptions={{ duration: 100 }}
        >
            {menuItems.map((item, index) => (
                <Fragment key={item.title}>
                    <button
                        className={`px-1.5 ${
                            item.isActive && item.isActive()
                                ? ' is-active text-green-500'
                                : ''
                        }`}
                        onClick={item.action}
                        title={item.title}
                        type="button"
                    >
                        <img
                            className="w-6 h-6"
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(
                                item.icon
                            )}`}
                        />
                    </button>
                </Fragment>
            ))}
            <ModalGetLink
                onCloseModal={() => setIsOpenSetLinkModal(false)}
                isOpen={isOpenSetLinkModal}
                onSubmit={(value) => setLink(value)}
                defaultLink={(() => {
                    if (
                        !editor.getAttributes('link').href ||
                        typeof editor.getAttributes('link').href !== 'string'
                    ) {
                        return ''
                    }
                    return editor.getAttributes('link').href || ''
                })()}
            />
        </BubbleMenu>
    )
}

export default MyBubbleMenu
