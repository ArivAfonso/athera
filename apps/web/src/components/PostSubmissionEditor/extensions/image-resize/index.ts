import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ImageResizeWrapper from './Image'

interface ImageOptions {
    inline: boolean
    allowBase64: boolean
    HTMLAttributes: Record<string, string>
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        image: {
            /**
             * Add an image
             */
            setImage: (options: {
                src: string
                alt?: string
                title?: string
                height?: string
                width?: string
                dataID?: string
            }) => ReturnType
        }
    }
}

const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export default Node.create<ImageOptions>({
    name: 'image',

    addOptions() {
        return {
            inline: false,
            allowBase64: false,
            HTMLAttributes: {},
        }
    },

    inline() {
        return this.options.inline
    },

    group() {
        return this.options.inline ? 'inline' : 'block'
    },

    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
            height: {
                default: null,
            },
            width: {
                default: null,
            },
            marginLeft: {
                default: null,
            },
            dataID: {
                default: null,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'img',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        const { height, width, marginLeft } = HTMLAttributes
        const attributes = {
            ...HTMLAttributes,
            style: `height: ${height} !important; width: ${width} !important; margin-left: ${marginLeft}px !important;`,
        }
        return ['img', mergeAttributes(this.options.HTMLAttributes, attributes)]
    },

    addCommands() {
        return {
            setImage:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options,
                    })
                },
        }
    },

    addNodeView() {
        //@ts-ignore
        return ReactNodeViewRenderer(ImageResizeWrapper)
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: inputRegex,
                type: this.type,
                getAttributes: (match) => {
                    const [, , alt, src, title, height, width] = match
                    return { src, alt, title, height, width }
                },
            }),
        ]
    },
})
