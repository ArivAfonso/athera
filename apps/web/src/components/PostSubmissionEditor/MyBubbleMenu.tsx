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
            icon: <BoldIcon className="h-5 w-5" />,
            title: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            icon: <ItalicIcon className="h-5 w-5" />,
            title: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            icon: <LinkIcon className="h-5 w-5" />,
            title: 'Link',
            action: () => setLinkFuc(),
            isActive: () => editor.isActive('link'),
        },
        {
            icon: <UnlinkIcon className="h-5 w-5" />,
            title: 'Unlink',
            action: () => editor.chain().focus().unsetLink().run(),
            isActive: () => editor.isActive('link'),
        },
        {
            icon: <QuoteIcon className="h-5 w-5" />,
            title: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },
        {
            icon: <CodeXmlIcon className="h-5 w-5" />,
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

    const shouldShow = ({ editor }: { editor: Editor }) => {
        const { state } = editor
        const { selection } = state
        const { empty, from } = selection

        if (empty) {
            return false
        }

        const selectedNode = state.doc.nodeAt(from)
        if (selectedNode && selectedNode.type.name === 'image') {
            return false
        }

        return true
    }

    return (
        <BubbleMenu
            className="p-3 dark:bg-neutral-900 bg-neutral-100 dark:text-neutral-200 text-neutral-900 flex justify-center rounded-xl shadow-lg"
            editor={editor}
            tippyOptions={{ duration: 100 }}
            shouldShow={shouldShow}
        >
            {menuItems.map((item) => (
                <Fragment key={item.title}>
                    <button
                        className={`menu-item ${
                            item.isActive && item.isActive()
                                ? ' is-active text-green-500'
                                : ''
                        }`}
                        onClick={item.action}
                        title={item.title}
                        type="button"
                    >
                        <div className="text-neutral-600 dark:text-neutral-400">
                            {item.icon}
                        </div>
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
