import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import React, { ChangeEvent } from 'react'
import { Select } from 'ui'

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
            className="absolute bg-transparent right-2 top-2 w-auto h-auto pl-5 py-1"
        >
            <option className="" value="null">
                auto
            </option>
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
