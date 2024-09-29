import { Node } from '@tiptap/core'

export function addIdsToHeadings(json: any): any {
    if (!json || typeof json !== 'object') {
        return json
    }

    if (json.type === 'doc' || json.type === 'paragraph') {
        if (Array.isArray(json.content)) {
            json.content = json.content.map((node: any) =>
                addIdsToHeadings(node)
            )
        }
        return json
    }

    if (['heading', 'h1', 'h2', 'h3'].includes(json.type)) {
        const text = extractTextContent(json)
        const id = generateUniqueId(text)
        json.attrs = { ...json.attrs, id }
    }

    if (Array.isArray(json.content)) {
        json.content = json.content.map((node: any) => addIdsToHeadings(node))
    }

    return json
}

function extractTextContent(node: any): string {
    if (typeof node.text === 'string') {
        return node.text
    }
    if (Array.isArray(node.content)) {
        return node.content.map(extractTextContent).join('')
    }
    return ''
}

function generateUniqueId(text: string): string {
    // Convert text to lowercase, remove non-alphanumeric characters, and replace spaces with hyphens
    const baseId = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    // Truncate to a reasonable length
    const truncatedId = baseId.slice(0, 50)

    // Add a unique suffix (you might want to implement a more sophisticated system to ensure uniqueness)
    const uniqueSuffix = Math.random().toString(36).substr(2, 5)

    return `${truncatedId}-${uniqueSuffix}`
}

type HeadingNode = {
    tag: string
    id: string
    text: string
    level: number
    children?: HeadingNode[]
}

export function parseHeadings(json: any): HeadingNode[] {
    const headings: HeadingNode[] = []
    let currentLevel = 0
    let stack: HeadingNode[] = []

    function traverse(node: any) {
        if (node.type === 'heading' || ['h1', 'h2', 'h3'].includes(node.type)) {
            const level = node.attrs.level || parseInt(node.type.charAt(1))
            const text = extractTextContent2(node)
            const heading: HeadingNode = {
                tag: `h${level}`,
                id: node.attrs.id,
                level,
                text,
                children: [],
            }

            while (currentLevel >= level && stack.length > 0) {
                stack.pop()
                currentLevel--
            }

            if (stack.length === 0) {
                headings.push(heading)
            } else {
                stack[stack.length - 1].children!.push(heading)
            }

            stack.push(heading)
            currentLevel = level
        }

        if (Array.isArray(node.content)) {
            node.content.forEach(traverse)
        }
    }

    traverse(json)
    return headings
}

function extractTextContent2(node: any): string {
    if (typeof node.text === 'string') {
        return node.text
    }
    if (Array.isArray(node.content)) {
        return node.content.map(extractTextContent).join('')
    }
    return ''
}

interface HeadingCheck {
    isValid: boolean
    missingIds: string[]
    duplicateIds: string[]
}

export function checkHeadingIds(json: any): HeadingCheck {
    const result: HeadingCheck = {
        isValid: true,
        missingIds: [],
        duplicateIds: [],
    }

    const idSet = new Set<string>()

    function traverse(node: any, path: string = '') {
        if (!node || typeof node !== 'object') {
            return
        }

        if (['heading', 'h1', 'h2', 'h3'].includes(node.type)) {
            const level = node.attrs?.level || parseInt(node.type.charAt(1), 10)
            const headingText = extractTextContent3(node)
            const currentPath = `${path}/${headingText}`

            if (!node.attrs?.id) {
                result.isValid = false
                result.missingIds.push(`${currentPath} (h${level})`)
            } else {
                if (idSet.has(node.attrs.id)) {
                    result.isValid = false
                    result.duplicateIds.push(
                        `${currentPath} (h${level}): ${node.attrs.id}`
                    )
                } else {
                    idSet.add(node.attrs.id)
                }
            }
        }

        if (Array.isArray(node.content)) {
            node.content.forEach((child: any, index: number) =>
                traverse(child, `${path}/content[${index}]`)
            )
        }
    }

    traverse(json)
    return result
}

function extractTextContent3(node: any): string {
    if (typeof node.text === 'string') {
        return node.text
    }
    if (Array.isArray(node.content)) {
        return node.content.map(extractTextContent).join('')
    }
    return ''
}
