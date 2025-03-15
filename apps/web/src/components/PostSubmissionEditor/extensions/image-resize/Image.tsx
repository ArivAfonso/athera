import React, { useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Resizable } from 're-resizable'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Direction } from 're-resizable/lib/resizer'
import {
    AlignCenter,
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    ArrowLeft,
    ArrowRight,
} from 'lucide-react'

interface WrapperProps {
    node: ProsemirrorNode
    updateAttributes: (attrs: unknown) => void
    editor: any
}

const parsePosition = (positionString: string) => {
    const positions: string[] = positionString.split(';').filter(Boolean)
    const styleObject: { [key: string]: string } = {}
    positions.forEach((pos: string) => {
        const [property, value]: string[] = pos
            .split(':')
            .map((s: string) => s.trim())
        styleObject[property] = value
    })
    return styleObject
}

export default function ImageResizeWrapper(props: WrapperProps) {
    const [alignment, setAlignment] = useState('left')

    const defWidth = props.node.attrs.width
    const defHeight = props.node.attrs.height

    const handleAlignLeft = () => {
        setAlignment('left')
    }

    const handleAlignCenter = () => {
        setAlignment('center')
    }

    const handleAlignRight = () => {
        setAlignment('right')
    }

    const dotsPosition = [
        'top: -4px; left: -4px; cursor: nwse-resize;',
        'top: -4px; right: -4px; cursor: nesw-resize;',
        'bottom: -4px; left: -4px; cursor: nesw-resize;',
        'bottom: -4px; right: -4px; cursor: nwse-resize;',
    ]

    // Remove isClicked state and related handlers
    // const [isClicked, setIsClicked] = useState(false)
    // const handleImageClick = () => {
    //     setIsClicked(true)
    // }
    // const handleContainerClick = () => {
    //     setIsClicked(true)
    // }
    // const handleMouseLeave = () => {
    //     setIsClicked(false)
    // }

    // Add isSelected based on Tiptap's selection
    const { editor, node } = props
    const isSelected =
        editor.isFocused && editor.view.state.selection.node === node

    return (
        <NodeViewWrapper className="image-resizer">
            {/* Conditionally render Top Menu Bar */}
            {isSelected && (
                <div
                    className="dark:bg-neutral-900 bg-neutral-100 text-neutral-600 dark:text-neutral-400 flex justify-center items-center rounded-lg shadow p-2 mb-2 space-x-2"
                    style={{
                        maxWidth: '150px',
                        margin: '0 auto',
                        boxSizing: 'border-box',
                    }}
                >
                    <button
                        onClick={handleAlignLeft}
                        className="flex items-center justify-center w-8 h-8 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded"
                        title="Move Left"
                        type="button"
                    >
                        <AlignLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleAlignCenter}
                        className="flex items-center justify-center w-8 h-8 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded"
                        title="Center"
                        type="button"
                    >
                        <AlignCenter className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleAlignRight}
                        className="flex items-center justify-center w-8 h-8 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded"
                        title="Move Right"
                        type="button"
                    >
                        <AlignRightIcon className="h-5 w-5" />
                    </button>
                </div>
            )}

            <div
                style={{
                    marginTop: '10px',
                    position: 'relative',
                }}
                // Remove onClick and onMouseLeave
                // onClick={handleContainerClick}
                // onMouseLeave={handleMouseLeave}
            >
                <Resizable
                    // className="resizable-image"
                    defaultSize={{
                        width: defWidth ? defWidth : '200',
                        height: defHeight ? defHeight : '80',
                    }}
                    onResize={(
                        e: MouseEvent | TouchEvent,
                        direction: Direction,
                        ref: HTMLElement
                    ) => {
                        props.updateAttributes({
                            width: ref.style.width,
                            height: ref.style.height,
                        })
                    }}
                    maxWidth={'100%'}
                    minWidth={400} // Set minimum width
                    minHeight={200} // Set minimum height
                    style={{
                        backgroundImage: `url(${props.node.attrs.src})`,
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                        position: 'relative',
                        marginLeft: alignment === 'right' ? 'auto' : '0',
                        marginRight: alignment === 'left' ? 'auto' : '0',
                        margin: alignment === 'center' ? '0 auto' : undefined,
                    }}
                    lockAspectRatio={false}
                >
                    {isSelected &&
                        dotsPosition.map((position, index) => (
                            <div
                                key={index}
                                style={{
                                    position: 'absolute',
                                    width: '8px',
                                    height: '8px',
                                    backgroundColor: '#8c8c8c',
                                    borderRadius: '30%',
                                    ...parsePosition(position),
                                }}
                            />
                        ))}
                </Resizable>
            </div>
        </NodeViewWrapper>
    )
}
