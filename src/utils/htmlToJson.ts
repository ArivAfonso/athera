import React from 'react'

interface HTMLNode {
    tag: string
    attributes: { [key: string]: string }
    children: (HTMLNode | string)[]
}

export function htmlToJSON(htmlString: string): HTMLNode[] {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')

    function parseNode(node: Node): HTMLNode | string {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent || ''
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            const children = Array.from(element.childNodes).map(parseNode)

            const attributes: { [key: string]: string } = {}
            for (let i = 0; i < element.attributes.length; i++) {
                const attr = element.attributes[i]
                attributes[attr.name] = attr.value
            }

            return {
                tag: element.tagName.toLowerCase(),
                attributes,
                children,
            }
        }
        return ''
    }

    return Array.from(doc.body.childNodes)
        .map(parseNode)
        .filter((node) => node !== '')
}
