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
    PaletteIcon,
    SubscriptIcon,
    SuperscriptIcon,
    SigmaIcon,
} from 'lucide-react'
import MenuItemSocials from './MenuItemSocials'
import MenuItemColors from './MenuItemColors'

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
            icon: <UndoIcon className="lg:w-5 lg:h-5" />,
            title: 'Undo',
            action: () => editor.chain().focus().undo().run(),
        },
        {
            icon: <RedoIcon className="lg:w-5 lg:h-5" />,
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
            icon: <BoldIcon className="lg:w-5 lg:h-5" />,
            title: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            icon: <UnderlineIcon className="lg:w-5 lg:h-5" />,
            title: 'Underline',
            action: () => editor.chain().focus().toggleUnderline().run(),
            isActive: () => editor.isActive('underline'),
        },
        {
            icon: <ItalicIcon className="lg:w-5 lg:h-5" />,
            title: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            icon: <LinkIcon className="lg:w-5 lg:h-5" />,
            title: 'Link',
            action: () => setLinkFuc(),
            isActive: () => editor.isActive('link'),
        },
        {
            icon: <HeadingIcon className="lg:w-5 lg:h-5" />,
            title: 'Heading',
            action: () => {},
            isActive: () => editor.isActive('heading'),
        },
        {
            type: 'divider',
        },
        {
            icon: <QuoteIcon className="lg:w-5 lg:h-5" />,
            title: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },
        {
            icon: <AlignLeftIcon className="lg:w-5 lg:h-5" />,
            title: 'align left',
            action: () => editor.chain().focus().setTextAlign('left').run(),
            isActive: () => editor.isActive({ textAlign: 'left' }),
        },
        {
            icon: <AlignCenterIcon className="lg:w-5 lg:h-5" />,
            title: 'align center',
            action: () => editor.chain().focus().setTextAlign('center').run(),
            isActive: () => editor.isActive({ textAlign: 'center' }),
        },
        {
            icon: <AlignRightIcon className="lg:w-5 lg:h-5" />,
            title: 'align right',
            action: () => editor.chain().focus().setTextAlign('right').run(),
            isActive: () => editor.isActive({ textAlign: 'right' }),
        },
        {
            icon: <SquarePlayIcon className="lg:w-5 lg:h-5" />,
            title: 'Socials',
            action: () => {},
            isActive: () => editor.isActive('socials'),
        },
        {
            type: 'divider',
        },
        {
            icon: <ImageIcon className="lg:w-5 lg:h-5" />,
            title: 'Image',
            action: ({ url, alt, title }: EditorItemImageAttrs) =>
                addImage({ url, alt, title }),
            isActive: () => editor.isActive('addImage'),
        },
        {
            icon: <ListIcon className="lg:w-5 lg:h-5" />,
            title: 'Bullet List',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
        },
        {
            icon: <ListOrderedIcon className="lg:w-5 lg:h-5" />,
            title: 'Ordered List',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        {
            icon: <PaletteIcon className="lg:w-5 lg:h-5" />,
            title: 'Palette',
            action: () => {},
            isActive: () => editor.isActive('palette'),
        },
        {
            icon: <CodeXmlIcon className="lg:w-5 lg:h-5" />,
            title: 'Code',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: () => editor.isActive('code'),
        },
        {
            icon: <SquareCodeIcon className="lg:w-5 lg:h-5" />,
            title: 'Code Block',
            action: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: () => editor.isActive('codeBlock'),
        },
    ])

    const [moreItemsState] = useState<(TiptapBarItem | TiptapBarItemDivider)[]>(
        [
            {
                icon: <StrikethroughIcon className="lg:w-5 lg:h-5" />,
                title: 'Strike',
                action: () => editor.chain().focus().toggleStrike().run(),
                isActive: () => editor.isActive('strike'),
            },
            {
                icon: <HighlighterIcon className="lg:w-5 lg:h-5" />,
                title: 'Highlight',
                action: () => editor.chain().focus().toggleHighlight().run(),
                isActive: () => editor.isActive('highlight'),
            },
            {
                icon: (
                    <SubscriptIcon
                        strokeWidth={1.75}
                        className="lg:w-6 lg:h-6"
                    />
                ),
                title: 'Subscript',
                action: () => editor.chain().focus().toggleSubscript().run(),
                isActive: () => editor.isActive('subscript'),
            },
            {
                icon: (
                    <SuperscriptIcon
                        strokeWidth={1.75}
                        className="lg:w-6 lg:h-6"
                    />
                ),
                title: 'Superscript',
                action: () => editor.chain().focus().toggleSuperscript().run(),
                isActive: () => editor.isActive('superscript'),
            },
            {
                type: 'divider',
            },
            {
                icon: <MinusIcon className="lg:w-5 lg:h-5" />,
                title: 'Horizontal Rule',
                action: () => editor.chain().focus().setHorizontalRule().run(),
            },
            {
                icon: <ListRestartIcon className="lg:w-5 lg:h-5" />,
                title: 'Hard Break',
                action: () => editor.chain().focus().setHardBreak().run(),
            },
            {
                icon: <SigmaIcon className="lg:w-5 lg:h-5" />,
                title: 'Mathematics',
                action: () => {
                    if (editor.isActive('math')) {
                        editor.chain().focus().unsetLatex().run()
                    } else {
                        const { from, to } = editor.state.selection
                        const latex = editor.state.doc.textBetween(from, to)

                        if (!latex) return

                        editor.chain().focus().setLatex({ latex }).run()
                    }
                },
            },
            {
                icon: <RemoveFormattingIcon className="lg:w-5 lg:h-5" />,
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
            className="editor__header rounded-tl-2xl bg-white dark:bg-neutral-800 rounded-tr-2xl border-0 border-b-2 border-neutral-300 dark:border-neutral-700 border-dashed px-2 lg:px-0 py-5 lg:py-2 overflow-hidden lg:overflow-visible flex justify-center z-10"
            style={{
                top: windowSizeWidth <= 600 ? 0 : wpadminbarH,
            }}
        >
            <div className="w-full max-w-screen-md">
                <div className="flex items-center overflow-x-auto lg:-mx-6 mx-0 lg:overflow-x-visible">
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
                            ) : (item as TiptapBarItem).title === 'Socials' ? (
                                <MenuItemSocials
                                    icon={(item as TiptapBarItem).icon}
                                    action={(item as TiptapBarItem).action}
                                    title={(item as TiptapBarItem).title}
                                    isActive={(item as TiptapBarItem).isActive}
                                    editor={editor}
                                />
                            ) : (item as TiptapBarItem).title === 'Palette' ? (
                                <MenuItemColors
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
