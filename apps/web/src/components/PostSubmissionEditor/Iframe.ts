import { Node } from '@tiptap/core'
import 'react-resizable/css/styles.css'

export interface IframeOptions {
    allowFullscreen: boolean
    HTMLAttributes: {
        [key: string]: any
    }
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        iframe: {
            /**
             * Add an iframe
             */
            setIframe: (options: { src: string }) => ReturnType
        }
    }
}

export default Node.create<IframeOptions>({
    name: 'iframe',

    group: 'block',

    atom: true,

    addOptions() {
        return {
            allowFullscreen: true,
            HTMLAttributes: {
                class: 'nc-iframe-wrapper',
            },
        }
    },

    addAttributes() {
        return {
            src: {
                default: null,
            },
            frameborder: {
                default: 0,
            },
            allowfullscreen: {
                default: this.options.allowFullscreen,
                parseHTML: () => this.options.allowFullscreen,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'iframe',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            this.options.HTMLAttributes,
            [
                'div',
                { class: 'resizable-container' },
                [
                    'iframe',
                    {
                        ...HTMLAttributes,
                        style: 'width: 100%; height: 100%; border: none;',
                    },
                ],
            ],
        ]
    },

    addCommands() {
        return {
            setIframe:
                (options: { src: string }) =>
                ({ tr, dispatch }) => {
                    const { selection } = tr
                    const node = this.type.create(options)

                    if (dispatch) {
                        tr.replaceRangeWith(selection.from, selection.to, node)
                    }

                    return true
                },
        }
    },
})
