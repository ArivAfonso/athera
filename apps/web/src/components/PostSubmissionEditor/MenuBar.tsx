import React, { Fragment, ReactNode, useCallback, useState } from 'react'
import MenuItem from './MenuItem'
import { Editor } from '@tiptap/react'
import MoreItemDropDown from './MoreItemDropDown'
import MenuItemHeading from './MenuItemHeading'
import ModalGetIframeUrl from './ModalGetIframeUrl'
import ModalGetLink from './ModalGetLink'
import { useWindowSize } from 'react-use'
import {
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BoldIcon,
    CodeXmlIcon,
    HeadingIcon,
    HighlighterIcon,
    ImageIcon,
    ItalicIcon,
    LinkIcon,
    ListIcon,
    ListOrderedIcon,
    ListRestartIcon,
    ListTodoIcon,
    LucideIcon,
    MinusIcon,
    QuoteIcon,
    RedoIcon,
    RemoveFormattingIcon,
    SquareCodeIcon,
    SquarePlayIcon,
    StrikethroughIcon,
    UnderlineIcon,
    UndoIcon,
} from 'lucide-react'

export interface TiptapBarItem {
    icon: ReactNode
    title: string
    action: (args?: any) => void
    isActive?: () => boolean
}

export interface TiptapBarItemDivider {
    type: 'divider'
}

export interface EditorItemImageAttrs {
    url: string
    alt?: string
    title?: string
}

const MenuBar: React.FC<{ editor: Editor }> = ({ editor }) => {
    const [itemsState] = useState<(TiptapBarItem | TiptapBarItemDivider)[]>([
        {
            icon: <UndoIcon />,
            title: 'Undo',
            action: () => editor.chain().focus().undo().run(),
        },
        {
            icon: <RedoIcon />,
            title: 'Redo',
            action: () => {
                setTimeout(() => {
                    editor.chain().focus().redo().run()
                }, 0)
            },
        },
        {
            type: 'divider',
        },
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
            icon: <HeadingIcon />,
            title: 'Heading',
            action: () => {},
            isActive: () => editor.isActive('heading'),
        },

        {
            icon: <QuoteIcon />,
            title: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },
        {
            icon: <AlignLeftIcon />,
            title: 'align left',
            action: () => editor.chain().focus().setTextAlign('left').run(),
            isActive: () => editor.isActive({ textAlign: 'left' }),
        },
        {
            icon: <AlignCenterIcon />,
            title: 'align center',
            action: () => editor.chain().focus().setTextAlign('center').run(),
            isActive: () => editor.isActive({ textAlign: 'center' }),
        },
        {
            icon: <AlignRightIcon />,
            title: 'align right',
            action: () => editor.chain().focus().setTextAlign('right').run(),
            isActive: () => editor.isActive({ textAlign: 'right' }),
        },
        {
            type: 'divider',
        },
        {
            icon: <ImageIcon />,
            title: 'image',
            action: ({ url, alt, title }: EditorItemImageAttrs) =>
                addImage({ url, alt, title }),
            isActive: () => editor.isActive('addImage'),
        },
        {
            icon: <ListIcon />,
            title: 'Bullet List',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
        },
        {
            icon: <ListOrderedIcon />,
            title: 'Ordered List',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        {
            icon: <CodeXmlIcon />,
            title: 'Code',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: () => editor.isActive('code'),
        },
        {
            icon: <SquareCodeIcon />,
            title: 'Code Block',
            action: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: () => editor.isActive('codeBlock'),
        },
    ])

    const [moreItemsState] = useState<(TiptapBarItem | TiptapBarItemDivider)[]>(
        [
            {
                icon: <UnderlineIcon />,
                title: 'Underline',
                action: () => editor.chain().focus().toggleUnderline().run(),
                isActive: () => editor.isActive('underline'),
            },
            {
                icon: <StrikethroughIcon />,
                title: 'Strike',
                action: () => editor.chain().focus().toggleStrike().run(),
                isActive: () => editor.isActive('strike'),
            },

            {
                icon: <HighlighterIcon />,
                title: 'Highlight',
                action: () => editor.chain().focus().toggleHighlight().run(),
                isActive: () => editor.isActive('highlight'),
            },

            {
                icon: <SquarePlayIcon />,
                title: 'iframe',
                action: () => addIframe(),
                isActive: () => editor.isActive('addIframe'),
            },

            {
                type: 'divider',
            },

            {
                icon: <MinusIcon />,
                title: 'Horizontal Rule',
                action: () => editor.chain().focus().setHorizontalRule().run(),
            },
            {
                icon: <ListRestartIcon />,
                title: 'Hard Break',
                action: () => editor.chain().focus().setHardBreak().run(),
            },
            {
                icon: <RemoveFormattingIcon />,
                title: 'Clear Format',
                action: () =>
                    editor.chain().focus().clearNodes().unsetAllMarks().run(),
            },
        ]
    )

    const [wpadminbarH] = useState(
        document.getElementById('wpadminbar')?.clientHeight || 0
    )
    const [isOpenIframeModal, setIsOpenIframeModal] = useState(false)
    const [isOpenSetLinkModal, setIsOpenSetLinkModal] = useState(false)

    const addIframe = () => {
        setIsOpenIframeModal(true)
    }

    const setLinkFuc = () => {
        // (url: string) => setLink(url)
        setIsOpenSetLinkModal(true)
    }

    const addImage = ({ url, alt, title }: EditorItemImageAttrs) => {
        if (url) {
            editor
                .chain()
                .focus()
                .setImage({
                    src: url,
                    alt,
                    title,
                })
                .run()
        }
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

    //
    const { width } = useWindowSize()
    const windowSizeWidth = width || window.innerWidth
    //

    const ITEM_STATE =
        windowSizeWidth <= 1024
            ? [...itemsState, ...moreItemsState]
            : itemsState

    return (
        <div
            className="editor__header sticky rounded-tl-2xl rounded-tr-2xl bg-neutral-100 dark:bg-neutral-800 px-2 lg:px-0 py-5 overflow-hidden lg:overflow-visible flex justify-center z-10"
            style={{
                top: windowSizeWidth <= 600 ? 0 : wpadminbarH,
            }}
        >
            <div className="w-full max-w-screen-md">
                <div className="flex items-center overflow-x-auto md:-mx-4 mx-0 lg:overflow-x-visible">
                    {ITEM_STATE.map((item, index) => (
                        <Fragment key={index}>
                            {(item as TiptapBarItemDivider).type ===
                            'divider' ? (
                                <div className="divider" />
                            ) : (item as TiptapBarItem).title === 'Heading' ? (
                                <MenuItemHeading
                                    icon={(item as TiptapBarItem).icon}
                                    action={(item as TiptapBarItem).action}
                                    title={(item as TiptapBarItem).title}
                                    isActive={(item as TiptapBarItem).isActive}
                                    editor={editor}
                                />
                            ) : (
                                <MenuItem
                                    icon={(item as TiptapBarItem).icon}
                                    action={(item as TiptapBarItem).action}
                                    title={(item as TiptapBarItem).title}
                                    isActive={(item as TiptapBarItem).isActive}
                                />
                            )}
                        </Fragment>
                    ))}

                    <ModalGetIframeUrl
                        show={isOpenIframeModal}
                        onSubmit={(value) => {
                            if (!!value) {
                                editor
                                    .chain()
                                    .focus()
                                    .setIframe({ src: value })
                                    .run()
                            }
                        }}
                        onCloseModal={() => setIsOpenIframeModal(false)}
                    />

                    <ModalGetLink
                        onCloseModal={() => setIsOpenSetLinkModal(false)}
                        isOpen={isOpenSetLinkModal}
                        onSubmit={(value) => setLink(value)}
                        defaultLink={(() => {
                            if (
                                !editor.getAttributes('link').href ||
                                typeof editor.getAttributes('link').href !==
                                    'string'
                            ) {
                                return ''
                            }
                            return editor.getAttributes('link').href || ''
                        })()}
                    />

                    <MoreItemDropDown data={moreItemsState} editor={editor} />
                </div>
            </div>
        </div>
    )
}
MenuBar.displayName = 'MenuBar'

export default MenuBar
