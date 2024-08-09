import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
    name: 'heading',
    addOptions() {
        return {
            levels: [1, 2, 3, 4, 5, 6],
            HTMLAttributes: {},
        }
    },
    content: 'inline*',
    group: 'block',
    defining: true,
    addAttributes() {
        return {
            level: {
                default: 1,
                rendered: false,
            },
            id: {
                default: null,
                parseHTML: (element) => element.getAttribute('id'),
                renderHTML: (attributes) => {
                    if (!attributes.id) {
                        return {}
                    }
                    return { id: attributes.id }
                },
            },
        }
    },
    parseHTML() {
        return this.options.levels.map((level: number) => ({
            tag: `h${level}`,
            attrs: { level },
        }))
    },
    renderHTML({ node, HTMLAttributes }) {
        const hasLevel = this.options.levels.includes(node.attrs.level)
        const level = hasLevel ? node.attrs.level : this.options.levels[0]

        return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
            0,
        ]
    },
})
