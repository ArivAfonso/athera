import React, { FC, useState, useEffect, useRef } from 'react'

interface Props {
    onUpdate: (editor: any) => void
    defaultTitle?: string
}

const TitleEditor: FC<Props> = ({ onUpdate, defaultTitle = '' }) => {
    const [title, setTitle] = useState(defaultTitle)
    const inputRef = useRef<HTMLInputElement>(null)

    const simulatedEditor = {
        getText: () => title,
        isEmpty: title.trim() === '',
        commands: {
            setContent: (content: string) => {
                setTitle(content)
                return simulatedEditor
            },
        },
    }

    useEffect(() => {
        onUpdate(simulatedEditor)
    }, [title])

    useEffect(() => {
        if (defaultTitle !== '' && title !== defaultTitle) {
            setTitle(defaultTitle)
        }
    }, [defaultTitle])

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full focus:outline-none outline-none ring-0 shadow-none border-0 p-0 m-0 max-w-screen-md text-neutral-900 font-semibold text-3xl md:text-4xl md:!leading-[120%] lg:text-5xl dark:text-neutral-100 bg-transparent"
                placeholder="New source title here…"
                aria-label="Title"
                style={{
                    WebkitAppearance: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                }}
            />
        </div>
    )
}

export default TitleEditor

interface Props {
    onUpdate: (editor: any) => void
    defaultDescription?: string
}

export const DescriptionEditor: FC<Props> = ({
    onUpdate,
    defaultDescription = '',
}) => {
    const [description, setDescription] = useState(defaultDescription)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    const simulatedEditor = {
        getText: () => description,
        isEmpty: description.trim() === '',
        commands: {
            setContent: (content: string) => {
                setDescription(content)
                return simulatedEditor
            },
        },
    }

    useEffect(() => {
        onUpdate(simulatedEditor)
    }, [description])

    useEffect(() => {
        if (defaultDescription !== '' && description !== defaultDescription) {
            setDescription(defaultDescription)
        }
    }, [defaultDescription])

    return (
        <div className="relative">
            <textarea
                ref={textAreaRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full focus:outline-none outline-none ring-0 shadow-none border-0 p-0 m-0 max-w-screen-md text-neutral-900 font-medium text-base dark:text-neutral-100 bg-transparent"
                placeholder="Enter description here…"
                aria-label="Description"
                style={{
                    WebkitAppearance: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                }}
                rows={4}
            />
        </div>
    )
}
