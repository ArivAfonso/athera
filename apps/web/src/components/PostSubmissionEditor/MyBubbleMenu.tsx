import { BubbleMenu, Editor } from '@tiptap/react'
import React, { FC, Fragment, useState } from 'react'
import { TiptapBarItem } from './MenuBar'
import ModalGetLink from './ModalGetLink'
import {
    BoldIcon,
    CodeXmlIcon,
    ItalicIcon,
    LinkIcon,
    QuoteIcon,
    UnlinkIcon,
} from 'lucide-react'

interface MyBubbleMenuProps {
    editor: Editor
}

const MyBubbleMenu: FC<MyBubbleMenuProps> = ({ editor }) => {
    const [menuItems] = useState<TiptapBarItem[]>([
        {
            icon: <BoldIcon />,
            title: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            icon: <ItalicIcon />,
            title: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            icon: <LinkIcon />,
            title: 'Link',
            action: () => setLinkFuc(),
            isActive: () => editor.isActive('link'),
        },
        {
            icon: <UnlinkIcon />,
            title: 'Unlink',
            action: () => editor.chain().focus().unsetLink().run(),
            isActive: () => editor.isActive('link'),
        },
        {
            icon: <QuoteIcon />,
            title: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },

        {
            icon: <CodeXmlIcon />,
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
                {item.icon}
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
                        {item.icon}
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
