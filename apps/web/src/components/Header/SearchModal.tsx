'use client'

import { FC, Fragment, ReactNode, useRef, useState } from 'react'
import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {
    ExclamationTriangleIcon,
    FolderIcon,
    LifebuoyIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { debounce } from 'es-toolkit'
import stringToSlug from '@/utils/stringToSlug'
import TopicType from '@/types/TopicType'
import NewsType from '@/types/NewsType'
import SourceType from '@/types/SourceType'
import { Search, SearchIcon } from 'lucide-react'
import NewsDetailModal from '../NewsDetailModal/NewsDetailModal'

interface Props {
    renderTrigger?: () => ReactNode
    type?: 'icon' | 'bar'
}

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

const SearchModal: FC<Props> = ({ renderTrigger, type = 'icon' }) => {
    const [open, setOpen] = useState(false)
    const [rawQuery, setRawQuery] = useState('')
    const [news, setNews] = useState<NewsType[]>([])
    const [topics, setTopics] = useState<TopicType[]>([])
    const [sources, setSources] = useState<SourceType[]>([])
    // New state for selected news and modal visibility
    const [selectedNews, setSelectedNews] = useState<NewsType | null>(null)
    const [showNewsModal, setShowNewsModal] = useState(false)

    const router = useRouter()

    const query = rawQuery.toLowerCase().replace(/^[#>]/, '')
    const supabase = createClient()

    const latestQuery = useRef('')

    const fetchResults = debounce(async () => {
        const query = rawQuery.toLowerCase().replace(/^[#>]/, '')
        if (query.length < 3) return
        latestQuery.current = query

        if (rawQuery.trim().startsWith('$')) {
            // Fetch sources instead of users
            const { data } = await supabase
                .from('sources')
                .select('name, id')
                .ilike('name', `%${query.slice(1).trim()}%`)
                .limit(10)

            if (rawQuery === '' || query !== latestQuery.current) {
                setSources([])
            } else if (data) {
                setSources(data as unknown as SourceType[])
            }
        } else if (rawQuery.trim().startsWith('#')) {
            // Fetch topics
            const { data } = await supabase
                .from('topics')
                .select('name, id')
                .ilike('name', `${query.slice(1).trim()}%`)
                .limit(10)

            if (rawQuery === '' || query !== latestQuery.current) {
                setTopics([])
            } else if (data) {
                setTopics(data as unknown as TopicType[])
            }
        } else {
            // Fetch news instead of posts
            const { data } = await supabase
                .from('news')
                .select(
                    `
                    id,
                    title,
                    created_at,
                    description,
                    author,
                    link,
                    summary,
                    image,
                    likeCount:likes(count),
                    commentCount:comments(count),
                    news_topics(topic:topics(id,name,color,newsCount:news(count))),
                    source(
                        id,
                        name,
                        description,
                        url,
                        image
                    )
                `
                )
                .ilike('title', `%${query}%`)
                .limit(10)

            if (rawQuery === '' || query !== latestQuery.current) {
                setNews([])
            } else if (data) {
                setNews(data as unknown as NewsType[])
            }
        }
    }, 200) // 200ms debounce time

    return (
        <>
            {type === 'icon' && (
                <div onClick={() => setOpen(true)} className="cursor-pointer">
                    {renderTrigger ? (
                        renderTrigger()
                    ) : (
                        <button className="flex w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none items-center justify-center">
                            <svg
                                width={22}
                                height={22}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M22 22L20 20"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {type === 'bar' && (
                <form
                    className="relative flex flex-1"
                    autoComplete="off"
                    onClick={() => setOpen(true)}
                >
                    <label htmlFor="search-field" className="sr-only">
                        Search
                    </label>
                    <SearchIcon
                        className="pointer-events-none absolute inset-y-0 start-0 h-full w-5 text-neutral-400"
                        aria-hidden="true"
                        strokeWidth={1.5}
                    />
                    <input
                        id="search-field"
                        className="block h-full w-full border-0 py-0 ps-8 pe-0 text-neutral-900 placeholder:text-neutral-400 focus:ring-0 sm:text-sm bg-transparent dark:text-white"
                        placeholder="Search..."
                        type="search"
                        inert
                        style={{ color: 'transparent' }}
                        name="search"
                    />
                </form>
            )}

            <Transition
                show={open}
                as={Fragment}
                afterLeave={() => setRawQuery('')}
                appear
            >
                <Dialog
                    as="div"
                    className="relative z-[99]"
                    onClose={() => setOpen(false)}
                >
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40 transition-opacity" />
                    </TransitionChild>

                    <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-100"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-100"
                        >
                            <DialogPanel
                                className="block mx-auto max-w-2xl transform divide-y dark:divide-gray-800 divide-gray-100 overflow-hidden rounded-xl dark:bg-neutral-900 bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
                                as="form"
                            >
                                <Combobox name="searchpallet">
                                    <div className="relative">
                                        <Search
                                            className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                        <ComboboxInput
                                            className="h-12 w-full border-0 bg-transparent pl-11 pr-4 dark:text-gray-100 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                            placeholder="Search..."
                                            onChange={async (event) => {
                                                const newQuery =
                                                    event.target.value
                                                if (newQuery.trim() === '') {
                                                    setNews([])
                                                    setSources([])
                                                    setTopics([])
                                                } else if (
                                                    newQuery.trim() !== '?' &&
                                                    newQuery !== null
                                                ) {
                                                    setRawQuery(newQuery)
                                                    await fetchResults()
                                                }
                                            }}
                                            onKeyDown={(event: any) => {
                                                if (
                                                    event.key === 'Enter' &&
                                                    (rawQuery.trim() !== '' ||
                                                        rawQuery === '?' ||
                                                        rawQuery === '$' ||
                                                        rawQuery === '#')
                                                ) {
                                                    event.preventDefault()
                                                    setOpen(false)
                                                    // In news options below, we open modal instead of router.push
                                                }
                                            }}
                                        />
                                    </div>
                                    {(news.length > 0 ||
                                        topics.length > 0 ||
                                        sources.length > 0) && (
                                        <ComboboxOptions
                                            static
                                            className="list-none max-h-80 dark:bg-neutral-900 scroll-py-10 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
                                        >
                                            {news.length > 0 && (
                                                <li>
                                                    <h2 className="text-xs font-semibold dark:text-gray-200 text-gray-900">
                                                        News
                                                    </h2>
                                                    <ul className="list-none -mx-4 mt-2 text-sm dark:text-gray-300 text-gray-700">
                                                        {news.map(
                                                            (item, key) => (
                                                                <ComboboxOption
                                                                    key={key}
                                                                    onClick={() => {
                                                                        setSelectedNews(
                                                                            item
                                                                        )
                                                                        setShowNewsModal(
                                                                            true
                                                                        )
                                                                        setOpen(
                                                                            false
                                                                        )
                                                                    }}
                                                                    value={item}
                                                                    className={({
                                                                        active,
                                                                    }) =>
                                                                        classNames(
                                                                            'flex select-none items-center px-4 py-2 cursor-pointer',
                                                                            active &&
                                                                                'bg-indigo-600 text-white'
                                                                        )
                                                                    }
                                                                >
                                                                    {({
                                                                        active,
                                                                    }) => (
                                                                        <>
                                                                            <MagnifyingGlassIcon
                                                                                className={classNames(
                                                                                    'h-6 w-6 flex-none',
                                                                                    active
                                                                                        ? 'text-white'
                                                                                        : 'text-gray-400'
                                                                                )}
                                                                                aria-hidden="true"
                                                                            />
                                                                            <span className="ml-3 flex-auto truncate">
                                                                                {
                                                                                    item.title
                                                                                }
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </ComboboxOption>
                                                            )
                                                        )}
                                                    </ul>
                                                </li>
                                            )}
                                            {topics.length > 0 && (
                                                <li>
                                                    <h2 className="text-xs font-semibold dark:text-gray-200 text-gray-900">
                                                        Topics
                                                    </h2>
                                                    <ul className="-mx-4 list-none mt-2 text-sm dark:text-gray-300 text-gray-700">
                                                        {topics.map(
                                                            (topic, key) => (
                                                                <ComboboxOption
                                                                    key={key}
                                                                    value={
                                                                        topic
                                                                    }
                                                                    className={({
                                                                        active,
                                                                    }) =>
                                                                        classNames(
                                                                            'flex select-none items-center px-4 py-2 cursor-pointer',
                                                                            active &&
                                                                                'bg-indigo-600 text-white'
                                                                        )
                                                                    }
                                                                    onClick={() => {
                                                                        router.push(
                                                                            `/topic/${stringToSlug(
                                                                                topic.name
                                                                            )}/${topic.id}`
                                                                        )
                                                                        setOpen(
                                                                            false
                                                                        )
                                                                    }}
                                                                >
                                                                    {({
                                                                        active,
                                                                    }) => (
                                                                        <>
                                                                            <FolderIcon
                                                                                className={classNames(
                                                                                    'h-6 w-6 flex-none',
                                                                                    active
                                                                                        ? 'text-white'
                                                                                        : 'text-gray-400'
                                                                                )}
                                                                                aria-hidden="true"
                                                                            />
                                                                            <span className="ml-3 flex-auto truncate">
                                                                                {
                                                                                    topic.name
                                                                                }
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </ComboboxOption>
                                                            )
                                                        )}
                                                    </ul>
                                                </li>
                                            )}
                                            {sources.length > 0 && (
                                                <li>
                                                    <h2 className="text-xs font-semibold dark:text-gray-200 text-gray-900">
                                                        Sources
                                                    </h2>
                                                    <ul className="-mx-4 mt-2 list-none text-sm dark:text-gray-300 text-gray-700">
                                                        {sources.map(
                                                            (source, key) => (
                                                                <ComboboxOption
                                                                    key={key}
                                                                    value={
                                                                        source
                                                                    }
                                                                    className={({
                                                                        active,
                                                                    }) =>
                                                                        classNames(
                                                                            'flex select-none items-center px-4 py-2 cursor-pointer',
                                                                            active &&
                                                                                'bg-indigo-600 text-white'
                                                                        )
                                                                    }
                                                                    onClick={() => {
                                                                        router.push(
                                                                            `/source/${source.id}`
                                                                        )
                                                                        setOpen(
                                                                            false
                                                                        )
                                                                    }}
                                                                >
                                                                    {({
                                                                        active,
                                                                    }) => (
                                                                        <>
                                                                            <UserIcon
                                                                                className={classNames(
                                                                                    'h-6 w-6 flex-none',
                                                                                    active
                                                                                        ? 'text-white'
                                                                                        : 'text-gray-400'
                                                                                )}
                                                                                aria-hidden="true"
                                                                            />
                                                                            <span className="ml-3 flex-auto truncate">
                                                                                {
                                                                                    source.name
                                                                                }
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </ComboboxOption>
                                                            )
                                                        )}
                                                    </ul>
                                                </li>
                                            )}
                                        </ComboboxOptions>
                                    )}

                                    {rawQuery === '?' && (
                                        <div className="py-14 px-6 text-center text-sm sm:px-14">
                                            <LifebuoyIcon
                                                className="mx-auto h-6 w-6 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            <p className="mt-4 font-semibold text-gray-900 dark:text-gray-100">
                                                Help with searching
                                            </p>
                                            <p className="mt-2 text-gray-500">
                                                Use this tool to quickly search
                                                for sources, news and topics
                                                across our platform.
                                            </p>
                                        </div>
                                    )}
                                    {query !== '' &&
                                        rawQuery !== '?' &&
                                        news.length === 0 &&
                                        topics.length === 0 &&
                                        sources.length === 0 && (
                                            <div className="py-14 px-6 text-center text-sm sm:px-14">
                                                <ExclamationTriangleIcon
                                                    className="mx-auto h-6 w-6 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                                <p className="mt-4 font-semibold text-gray-900">
                                                    No content found
                                                </p>
                                                <p className="mt-2 text-gray-500">
                                                    We couldn’t find any content
                                                    with that term. Please try
                                                    again.
                                                </p>
                                            </div>
                                        )}
                                    <div className="flex flex-wrap items-center dark:bg-slate-900 bg-gray-50 py-2.5 px-4 text-xs dark:text-gray-200 text-gray-700">
                                        Type{' '}
                                        <kbd
                                            className={classNames(
                                                'mx-1 flex h-5 w-5 items-center justify-center rounded border dark:bg-neutral-900 bg-white font-semibold sm:mx-2',
                                                rawQuery.startsWith('#')
                                                    ? 'border-indigo-600 text-indigo-600'
                                                    : 'border-gray-400 text-gray-900 dark:text-gray-100 dark:border-gray-700'
                                            )}
                                        >
                                            #
                                        </kbd>{' '}
                                        <span className="sm:hidden">
                                            for topics,
                                        </span>
                                        <span className="hidden sm:inline">
                                            to access topics,
                                        </span>
                                        <kbd
                                            className={classNames(
                                                'mx-1 flex h-5 w-5 items-center justify-center rounded border dark:bg-neutral-900 bg-white font-semibold sm:mx-2',
                                                rawQuery.startsWith('$')
                                                    ? 'border-indigo-600 text-indigo-600'
                                                    : 'border-gray-400 text-gray-900 dark:text-gray-100 dark:border-gray-700'
                                            )}
                                        >
                                            $
                                        </kbd>{' '}
                                        for sources,{' '}
                                        <kbd
                                            className={classNames(
                                                'mx-1 flex h-5 w-5 items-center justify-center rounded border dark:bg-neutral-900 bg-white font-semibold sm:mx-2',
                                                rawQuery === '?'
                                                    ? 'border-indigo-600 text-indigo-600'
                                                    : 'border-gray-400 text-gray-900 dark:text-gray-100 dark:border-gray-700'
                                            )}
                                        >
                                            ?
                                        </kbd>{' '}
                                        for help
                                    </div>
                                </Combobox>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
            {selectedNews && (
                <NewsDetailModal
                    show={showNewsModal}
                    news={selectedNews}
                    onClose={() => setShowNewsModal(false)}
                />
            )}
        </>
    )
}

export default SearchModal
