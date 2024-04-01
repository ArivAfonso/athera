import Empty from '@/components/Empty'
import CategoryType from '@/types/CategoryType'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/utils/supabase/client'
import { debounce, set } from 'lodash'
import React, { FC, useEffect, useRef, useState } from 'react'

interface Tags {
    edges: Edge[]
    __typename: string
}
interface Edge {
    node: TagNodeShort
    __typename: string
}

export interface TagNodeShort {
    name: string
}

interface TagsInputProps {
    onChange: (tags: String[]) => void
    defaultValue?: String[]
}

const TagsInput: FC<TagsInputProps> = ({ onChange, defaultValue }) => {
    const MAX_TAGS_LENGTH = 5
    //
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    let [isOpen, setIsOpen] = useState(false)
    const [tags, setTags] = useState<String[]>(defaultValue || [])
    const [ogTags, setOgTags] = useState<String[]>(defaultValue || [])

    useEffect(() => {
        if (tags.length >= MAX_TAGS_LENGTH) {
            setIsOpen(false)
        }

        onChange(tags)
    }, [onChange, tags, tags.length])

    const [data, setData] = useState<String[] | null>(null)

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .limit(10)

            console.log(data)

            if (error) {
                console.log(error)
                return
            }
            setData(data.map((item) => item.name))
            setOgTags(data.map((item) => item.name))
        }
        fetchData()
    }, [])

    const fetchCategories = debounce(async (inputValue: String) => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('categories')
            .select('name')
            .ilike('name', `${inputValue}%`)
            .limit(10)

        console.log(data)

        if (error) {
            console.log(error)
            return
        }

        setData(data.map((item) => item.name))
    }, 300) // 500ms delay

    function closePopover() {
        setIsOpen(false)
    }

    function openPopover() {
        setIsOpen(true)
    }

    const checkIncludes = (tag: String) => {
        return tags.some((item) => item === tag)
    }

    const setNewTags = (tag: String) => {
        if (!checkIncludes(tag)) {
            setTags((prevTags) => [...prevTags, tag])
        }

        if (inputRef.current) {
            inputRef.current.value = ''
            inputRef.current.focus()
        }
    }

    useEffect(() => {
        if (defaultValue && defaultValue.length > 0) {
            setTags(defaultValue)
        }
        console.log(defaultValue)
    }, [defaultValue])

    useEffect(() => {
        if (eventClickOutsideDiv) {
            document.removeEventListener('click', eventClickOutsideDiv)
        }
        isOpen && document.addEventListener('click', eventClickOutsideDiv)
        return () => {
            document.removeEventListener('click', eventClickOutsideDiv)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    const eventClickOutsideDiv = (event: MouseEvent) => {
        if (!isOpen || !containerRef.current) {
            return
        }

        // CLICK IN_SIDE
        if (
            containerRef.current.contains(event.target as Node) ||
            inputRef.current?.contains(event.target as Node)
        ) {
            return
        }

        // CLICK OUT_SIDE
        setIsOpen(false)
    }

    const handleRemoveTag = (tag: String) => {
        setTags(tags.filter((t) => t !== tag))
        setTimeout(() => {
            inputRef.current?.focus()
        }, 100)
    }

    return (
        <div className="relative w-full mt--2 text-sm">
            <ul className="flex flex-wrap ">
                {tags.map((tag, index) => (
                    <li
                        className="flex items-center justify-center mr-1 my-0.5 px-2 py-1.5 rounded bg-neutral-100 dark:bg-neutral-800"
                        key={index}
                    >
                        #{` `}
                        {tag}
                        <button
                            className="ml-1 px-0.5 text-red-400 text-base flex items-center justify-center"
                            onClick={(event) => {
                                event.stopPropagation()
                                handleRemoveTag(tag)
                            }}
                            title="Remove tag"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </li>
                ))}

                {tags.length < MAX_TAGS_LENGTH && (
                    <li>
                        {/* <Popover.Button>Solutions</Popover.Button> */}
                        <input
                            ref={inputRef}
                            className="px-0.5 py-1.5 my-0.5 h-full border-none focus:outline-none focus:ring-0 !bg-transparent shadow-none"
                            type="text"
                            placeholder={
                                !tags.length
                                    ? `Add tags (${tags.length}/${MAX_TAGS_LENGTH})...`
                                    : `Add tag (${tags.length}/${MAX_TAGS_LENGTH})`
                            }
                            maxLength={20}
                            onFocus={openPopover}
                            onChange={(e) => {
                                if (
                                    e.currentTarget.value.length > 20 ||
                                    e.currentTarget.value.length === 0
                                ) {
                                    setData(ogTags)
                                }
                                fetchCategories(
                                    e.currentTarget.value
                                        .charAt(0)
                                        .toUpperCase() +
                                        e.currentTarget.value.slice(1)
                                )
                            }}
                            onKeyDown={(e) => {
                                if (e.code !== 'Enter' && e.code !== 'Space') {
                                    return
                                }
                                e.preventDefault()
                                setNewTags(
                                    e.currentTarget.value
                                        .charAt(0)
                                        .toUpperCase() +
                                        e.currentTarget.value.slice(1)
                                )
                            }}
                        />
                    </li>
                )}
            </ul>

            {isOpen && (
                <div
                    ref={containerRef}
                    className="absolute top-full mt-4 inset-x-0 p-5 bg-white dark:bg-neutral-800 shadow-lg rounded-2xl z-50 ring-1 ring-black/[0.03]"
                >
                    <h3 className="text-xl font-semibold">Top tags</h3>
                    <div className="w-full border-b my-4 border-neutral-300 dark:border-neutral-700"></div>
                    {/* {error && <p className="text-red-500">{error.message}</p>}
          {loading && <CircleLoading />} */}
                    {data && data.length > 0 ? (
                        <ul className="flex flex-wrap">
                            {data.map((tag, index) => (
                                <li key={index}>
                                    <button
                                        className="flex items-center justify-center mr-2 my-1 px-2 py-1.5 rounded bg-neutral-100 disabled:hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-6000 dark:disabled:hover:bg-neutral-700 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-70"
                                        onClick={() => {
                                            if (checkIncludes(tag)) {
                                                return
                                            }
                                            setNewTags(tag)
                                        }}
                                        disabled={checkIncludes(tag)}
                                    >
                                        #{` `}
                                        {tag}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Empty
                            mainText="No categories found"
                            subText="Looks like your creating a brand new Category."
                            className="text-center p-4"
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default TagsInput
