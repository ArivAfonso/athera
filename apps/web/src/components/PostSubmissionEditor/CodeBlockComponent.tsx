import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import React, { ChangeEvent } from 'react'
import { Select } from 'ui'

function getLang(str: string) {
    switch (str) {
        case 'js':
            return 'JavaScript'
        case 'ts':
            return 'TypeScript'
        case 'html':
            return 'HTML'
        case 'css':
            return 'CSS'
        case 'java':
            return 'Java'
        case 'python':
            return 'Python'
        case 'c':
            return 'C'
        case 'cpp':
            return 'C++'
        case 'csharp':
            return 'C#'
        case 'ruby':
            return 'Ruby'
        case 'php':
            return 'PHP'
        case 'go':
            return 'Go'
        case 'swift':
            return 'Swift'
        case 'kotlin':
            return 'Kotlin'
        case 'rust':
            return 'Rust'
        case 'scala':
            return 'Scala'
        case 'r':
            return 'R'
        case 'auto':
            return 'Auto'
        default:
            return str
    }
}

interface Props {
    node: {
        attrs: {
            language: string
        }
    }
    updateAttributes: (attrs: { language: string }) => void
    extension: {
        options: {
            lowlight: {
                listLanguages: () => string[]
            }
        }
    }
}

const CodeBlockComponent: React.FC<Props> = ({
    node: {
        attrs: { language: defaultLanguage },
    },
    updateAttributes,
    extension,
}) => (
    <NodeViewWrapper className="relative">
        <Select
            contentEditable={false}
            defaultValue={defaultLanguage}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                updateAttributes({ language: event.target.value })
            }
            className="absolute right-2 top-2 w-auto h-auto pl-5 py-1"
        >
            <option className="" value="null">
                auto
            </option>
            <option disabled>—</option>
            {extension.options.lowlight
                .listLanguages()
                .map((lang: string, index: number) => (
                    <option key={index} value={lang}>
                        {lang}
                    </option>
                ))}
        </Select>
        <pre spellCheck="false">
            <NodeViewContent as="code" />
        </pre>
    </NodeViewWrapper>
)

export default CodeBlockComponent
