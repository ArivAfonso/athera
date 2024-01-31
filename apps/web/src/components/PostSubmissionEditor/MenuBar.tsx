import React, { Fragment, ReactNode, useCallback, useState } from 'react'
import MenuItem from './MenuItem'
import { Editor } from '@tiptap/react'
import MoreItemDropDown from './MoreItemDropDown'
import MenuItemHeading from './MenuItemHeading'
import ModalGetIframeUrl from './ModalGetIframeUrl'
import ModalGetLink from './ModalGetLink'
import { useWindowSize } from 'react-use'
import { Menu } from '@headlessui/react'

export interface TiptapBarItem {
    icon: string
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
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M17 11V4h2v17h-2v-8H7v8H5V4h2v7z"/></svg>`,
            title: 'Heading',
            action: () => {},
            isActive: () => editor.isActive('heading'),
        },

        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/></svg>`,
            title: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M8 4h13v2H8V4zm-5-.5h3v3H3v-3zm0 7h3v3H3v-3zm0 7h3v3H3v-3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"/></svg>`,
            title: 'Bullet List',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"/></svg>`,
            title: 'Ordered List',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z"/></svg>`,
            title: 'Code',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: () => editor.isActive('code'),
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm16 7l-3.536 3.536-1.414-1.415L17.172 12 15.05 9.879l1.414-1.415L20 12zM6.828 12l2.122 2.121-1.414 1.415L4 12l3.536-3.536L8.95 9.88 6.828 12zm4.416 5H9.116l3.64-10h2.128l-3.64 10z"/></svg>`,
            title: 'Code Block',
            action: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: () => editor.isActive('codeBlock'),
        },

        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>`,
            title: 'image',
            action: ({ url, alt, title }: EditorItemImageAttrs) =>
                addImage({ url, alt, title }),
            isActive: () => editor.isActive('addImage'),
        },
    ])

    const [moreItemsState] = useState<(TiptapBarItem | TiptapBarItemDivider)[]>(
        [
            {
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 4h18v2H3V4zm0 15h14v2H3v-2zm0-5h18v2H3v-2zm0-5h14v2H3V9z"/></svg>`,
                title: 'align left',
                action: () => editor.chain().focus().setTextAlign('left').run(),
                isActive: () => editor.isActive({ textAlign: 'left' }),
            },
            {
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 4h18v2H3V4zm2 15h14v2H5v-2zm-2-5h18v2H3v-2zm2-5h14v2H5V9z"/></svg>`,
                title: 'align center',
                action: () =>
                    editor.chain().focus().setTextAlign('center').run(),
                isActive: () => editor.isActive({ textAlign: 'center' }),
            },
            {
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 4h18v2H3V4zm4 15h14v2H7v-2zm-4-5h18v2H3v-2zm4-5h14v2H7V9z"/></svg>`,
                title: 'align right',
                action: () =>
                    editor.chain().focus().setTextAlign('right').run(),
                isActive: () => editor.isActive({ textAlign: 'right' }),
            },
            {
                type: 'divider',
            },
            {
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2zM4 20h16v2H4v-2z"/></svg>`,
                title: 'Underline',
                action: () => editor.chain().focus().toggleUnderline().run(),
                isActive: () => editor.isActive('underline'),
            },
            {
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846zm-4.078-3H7.629a4.086 4.086 0 0 1-.481-.522C6.716 9.92 6.5 9.246 6.5 8.452c0-1.236.466-2.287 1.397-3.153C8.83 4.433 10.271 4 12.222 4c1.471 0 2.879.328 4.222.984v2.152c-1.2-.687-2.515-1.03-3.946-1.03-2.48 0-3.719.782-3.719 2.346 0 .42.218.786.654 1.099.436.313.974.562 1.613.75.62.18 1.297.414 2.03.699z"/></svg>`,
                title: 'Strike',
                action: () => editor.chain().focus().toggleStrike().run(),
                isActive: () => editor.isActive('strike'),
            },

            {
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M15.95 2.393l5.657 5.657a1 1 0 0 1 0 1.414l-7.779 7.779-2.12.707-1.415 1.414a1 1 0 0 1-1.414 0l-4.243-4.243a1 1 0 0 1 0-1.414l1.414-1.414.707-2.121 7.779-7.779a1 1 0 0 1 1.414 0zm.707 3.536l-6.364 6.364 1.414 1.414 6.364-6.364-1.414-1.414zM4.282 16.889l2.829 2.829-1.414 1.414-4.243-1.414 2.828-2.829z"/></svg>`,
                title: 'Highlight',
                action: () => editor.chain().focus().toggleHighlight().run(),
                isActive: () => editor.isActive('highlight'),
            },

            {
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6">
      <path fill="none" d="M0 0h24v24H0z"/><path d="M3 3.993C3 3.445 3.445 3 3.993 3h16.014c.548 0 .993.445.993.993v16.014a.994.994 0 0 1-.993.993H3.993A.994.994 0 0 1 3 20.007V3.993zM5 5v14h14V5H5zm5.622 3.415l4.879 3.252a.4.4 0 0 1 0 .666l-4.88 3.252a.4.4 0 0 1-.621-.332V8.747a.4.4 0 0 1 .622-.332z"/></svg>`,
                title: 'iframe',
                action: () => addIframe(),
                isActive: () => editor.isActive('addIframe'),
            },

            {
                type: 'divider',
            },

            {
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M2 11h2v2H2v-2zm4 0h12v2H6v-2zm14 0h2v2h-2v-2z"/></svg>`,
                title: 'Horizontal Rule',
                action: () => editor.chain().focus().setHorizontalRule().run(),
            },

            {
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M15 18h1.5a2.5 2.5 0 1 0 0-5H3v-2h13.5a4.5 4.5 0 1 1 0 9H15v2l-4-3 4-3v2zM3 4h18v2H3V4zm6 14v2H3v-2h6z"/></svg>`,
                title: 'Hard Break',
                action: () => editor.chain().focus().setHardBreak().run(),
            },
            {
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M12.651 14.065L11.605 20H9.574l1.35-7.661-7.41-7.41L4.93 3.515 20.485 19.07l-1.414 1.414-6.42-6.42zm-.878-6.535l.27-1.53h-1.8l-2-2H20v2h-5.927L13.5 9.257 11.773 7.53z"/></svg>`,
                title: 'Clear Format',
                action: () =>
                    editor.chain().focus().clearNodes().unsetAllMarks().run(),
            },
            {
                type: 'divider',
            },
            {
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M8 7v4L2 6l6-5v4h5a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H8z"/></svg>`,
                title: 'Undo',
                action: () => editor.chain().focus().undo().run(),
            },
            {
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6"><path fill="none" d="M0 0h24v24H0z"/><path d="M18.172 7H11a6 6 0 1 0 0 12h9v2h-9a8 8 0 1 1 0-16h7.172l-2.536-2.536L17.05 1.05 22 6l-4.95 4.95-1.414-1.414L18.172 7z"/></svg>`,
                title: 'Redo',
                action: () => {
                    setTimeout(() => {
                        editor.chain().focus().redo().run()
                    }, 0)
                },
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
            className="editor__header sticky bg-neutral-100 rounded-tl-2xl rounded-tr-2xl dark:bg-neutral-800 px-2 lg:px-0 py-5 overflow-hidden lg:overflow-visible flex justify-center z-10"
            style={{
                top: windowSizeWidth <= 600 ? 0 : wpadminbarH,
            }}
        >
            <div className=" w-full max-w-screen-md">
                <div className="flex items-center overflow-x-auto -mx-2.5 lg:overflow-x-visible">
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
