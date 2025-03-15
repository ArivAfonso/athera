import React, { FC, useEffect } from 'react'
import {
    useEditor,
    EditorContent,
    Editor,
    ReactNodeViewRenderer,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Iframe from './Iframe'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import java from 'highlight.js/lib/languages/java'
import python from 'highlight.js/lib/languages/python'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import ruby from 'highlight.js/lib/languages/ruby'
import php from 'highlight.js/lib/languages/php'
import go from 'highlight.js/lib/languages/go'
import swift from 'highlight.js/lib/languages/swift'
import kotlin from 'highlight.js/lib/languages/kotlin'
import rust from 'highlight.js/lib/languages/rust'
import scala from 'highlight.js/lib/languages/scala'
import r from 'highlight.js/lib/languages/r'
// load all highlight.js languages
import { createLowlight } from 'lowlight'
//
import MenuBar from './MenuBar'
import './styles.scss'
import MyBubbleMenu from './MyBubbleMenu'
import CodeBlockComponent from './CodeBlockComponent'
import { Transaction } from '@tiptap/pm/state'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { Mathematics } from './extensions/mathematics/MathematicsExtension'
import { cn } from '@/utils/cn'
import { Markdown } from 'tiptap-markdown'

import Image from '@tiptap/extension-image'
import ResizableImage from './extensions/image-resize'

interface Props {
    onUpdate: (editor: Editor) => void
    defaultContent?: JSON
}

const TiptapEditor: FC<Props> = ({ onUpdate, defaultContent = '' }) => {
    const lowlight = createLowlight()

    lowlight.register('html', html)
    lowlight.register('css', css)
    lowlight.register('js', js)
    lowlight.register('ts', ts)
    lowlight.register('java', java)
    lowlight.register('python', python)
    lowlight.register('c', c)
    lowlight.register('cpp', cpp)
    lowlight.register('csharp', csharp)
    lowlight.register('ruby', ruby)
    lowlight.register('php', php)
    lowlight.register('go', go)
    lowlight.register('swift', swift)
    lowlight.register('kotlin', kotlin)
    lowlight.register('rust', rust)
    lowlight.register('scala', scala)
    lowlight.register('r', r)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Highlight.configure({
                multicolor: true,
            }),
            Underline,
            Table,
            TableCell,
            TableHeader,
            TableRow,
            Iframe,
            Subscript,
            Superscript,
            CodeBlockLowlight.extend({
                addNodeView() {
                    // @ts-ignore
                    return ReactNodeViewRenderer(CodeBlockComponent)
                },
            }).configure({ lowlight }),
            Link.configure({
                openOnClick: false,
            }),
            Mathematics.configure({
                HTMLAttributes: {
                    class: cn(
                        'text-foreground rounded p-1 hover:bg-accent cursor-pointer'
                    ),
                },
                katexOptions: {
                    throwOnError: false,
                },
            }),
            Placeholder.configure({
                placeholder: 'Write your post content here…',
                showOnlyCurrent: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Markdown,
            Image.configure({
                inline: true,
            }),
            ResizableImage,
        ],
        editorProps: {
            attributes: {
                class: 'focus:outline-none prose mx-auto prose-neutral lg:prose-lg dark:prose-invert max-w-screen-md min-h-[500px]',
            },
        },
        content: defaultContent,

        onUpdate: ({ editor }) => {
            // @ts-ignore
            onUpdate(editor)
        },
    })

    useEffect(() => {
        if (editor?.isEmpty && defaultContent !== '<p></p>') {
            editor.commands.setContent(defaultContent)
        }
    }, [defaultContent, editor])

    return (
        <div className="TiptapEditor ">
            <div className="editor">
                {editor && <MyBubbleMenu editor={editor} />}
                {editor && (
                    <div className="sticky top-20 z-50">
                        <MenuBar editor={editor} />
                    </div>
                )}
                <EditorContent
                    className="editor__content cursor-text focus:border-primary-300 focus:ring focus:ring-primary-200/50"
                    editor={editor}
                />
            </div>
        </div>
    )
}

export default TiptapEditor
