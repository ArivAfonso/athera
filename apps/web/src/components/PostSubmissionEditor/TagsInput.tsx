import Empty from '@/components/Empty'
import TopicType from '@/types/TopicType'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/utils/supabase/client'
import { debounce, set } from 'lodash'
import React, { FC, useEffect, useRef, useState } from 'react'

interface Topics {
    edges: Edge[]
    __typename: string
}
interface Edge {
    node: TopicNodeShort
    __typename: string
}

export interface TopicNodeShort {
    name: string
}

interface TopicsInputProps {
    onChange: (topics: String[]) => void
    defaultValue?: String[]
}

const TopicsInput: FC<TopicsInputProps> = ({ onChange, defaultValue }) => {
    const MAX_TOPICS_LENGTH = 5
    //
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    let [isOpen, setIsOpen] = useState(false)
    const [topics, setTopics] = useState<String[]>(defaultValue || [])
    const [ogTopics, setOgTopics] = useState<String[]>(defaultValue || [])

    useEffect(() => {
        if (topics.length >= MAX_TOPICS_LENGTH) {
            setIsOpen(false)
        }

        onChange(topics)
    }, [onChange, topics, topics.length])

    const [data, setData] = useState<String[] | null>(null)

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('topics')
                .select('*')
                .limit(10)

            if (error) {
                return
            }
            setData(
                data
                    .map((item) => item.name)
                    .filter((name): name is string => name !== null)
            )
            setOgTopics(
                data
                    .map((item) => item.name)
                    .filter((name): name is string => name !== null)
            )
        }
        fetchData()
    }, [])

    const fetchTopics = debounce(async (inputValue: String) => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('topics')
            .select('name')
            .ilike('name', `${inputValue}%`)
            .limit(10)

        if (error) {
            return
        }

        setData(
            data
                .map((item) => item.name)
                .filter((name): name is string => name !== null)
        )
    }, 300) // 300ms delay

    function closePopover() {
        setIsOpen(false)
    }

    function openPopover() {
        setIsOpen(true)
    }

    const checkIncludes = (topic: String) => {
        return topics.some((item) => item === topic)
    }

    const setNewTopics = (topic: String) => {
        if (!checkIncludes(topic)) {
            setTopics((prevTopics) => [...prevTopics, topic])
        }

        if (inputRef.current) {
            inputRef.current.value = ''
            inputRef.current.focus()
        }
    }

    useEffect(() => {
        if (defaultValue && defaultValue.length > 0) {
            setTopics(defaultValue)
        }
    }, [])

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

    const handleRemoveTopic = (topic: String) => {
        setTopics(topics.filter((t) => t !== topic))
        setTimeout(() => {
            inputRef.current?.focus()
        }, 100)
    }

    return (
        <div className="relative w-full mt--2 text-sm">
            <ul className="flex flex-wrap ">
                {topics.map((topic, index) => (
                    <li
                        className="flex items-center justify-center mr-1 my-0.5 px-2 py-1.5 rounded bg-neutral-100 dark:bg-neutral-800"
                        key={index}
                    >
                        #{` `}
                        {topic}
                        <button
                            className="ml-1 px-0.5 text-red-400 text-base flex items-center justify-center"
                            onClick={() => {
                                handleRemoveTopic(topic)
                            }}
                            type="button"
                            title="Remove topic"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </li>
                ))}

                {topics.length < MAX_TOPICS_LENGTH && (
                    <li>
                        {/* <Popover.Button>Solutions</Popover.Button> */}
                        <input
                            ref={inputRef}
                            className="px-0.5 py-1.5 my-0.5 h-full border-none focus:outline-none focus:ring-0 !bg-transparent shadow-none"
                            type="text"
                            placeholder={
                                !topics.length
                                    ? `Add topics (${topics.length}/${MAX_TOPICS_LENGTH})...`
                                    : `Add topic (${topics.length}/${MAX_TOPICS_LENGTH})`
                            }
                            maxLength={20}
                            onFocus={openPopover}
                            onChange={(e) => {
                                if (
                                    e.currentTarget.value.length > 20 ||
                                    e.currentTarget.value.length === 0
                                ) {
                                    setData(ogTopics)
                                }
                                fetchTopics(
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
                                setNewTopics(
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
                    <h3 className="text-xl font-semibold">Top topics</h3>
                    <div className="w-full border-b my-4 border-neutral-300 dark:border-neutral-700"></div>

                    {data && data.length > 0 ? (
                        <ul className="flex flex-wrap">
                            {data.map((topic, index) => (
                                <li key={index}>
                                    <button
                                        className="flex items-center justify-center mr-2 my-1 px-2 py-1.5 rounded bg-neutral-100 disabled:hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-6000 dark:disabled:hover:bg-neutral-700 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-70"
                                        onClick={() => {
                                            if (checkIncludes(topic)) {
                                                return
                                            }
                                            setNewTopics(topic)
                                        }}
                                        disabled={checkIncludes(topic)}
                                    >
                                        #{` `}
                                        {topic}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Empty
                            mainText="No topics found"
                            subText="Looks like your creating a brand new Topic."
                            className="text-center p-4"
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default TopicsInput
