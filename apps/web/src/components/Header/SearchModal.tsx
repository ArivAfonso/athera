'use client'

import { FC, Fragment, ReactNode, useRef, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {
    ExclamationTriangleIcon,
    FolderIcon,
    LifebuoyIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { Route } from '@/routers/types'
import { redirect, useRouter } from 'next/navigation'
import { UrlObject } from 'url'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import PostType from '@/types/PostType'
import { debounce } from 'lodash'
import stringToSlug from '@/utils/stringToSlug'
import CategoryType from '@/types/CategoryType'
import AuthorType from '@/types/AuthorType'

interface Props {
    renderTrigger?: () => ReactNode
}

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

const SearchModal: FC<Props> = ({ renderTrigger }) => {
    const [open, setOpen] = useState(false)
    const [rawQuery, setRawQuery] = useState('')
    const [posts, setPosts] = useState<PostType[]>([])
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [authors, setAuthors] = useState<AuthorType[]>([])

    const router = useRouter()

    const query = rawQuery.toLowerCase().replace(/^[#>]/, '')
    const supabase = createClientComponentClient()

    // ...

    const latestQuery = useRef('')

    const fetchResults = debounce(async () => {
        const query = rawQuery.toLowerCase().replace(/^[#>]/, '')
        if (query.length < 3) return
        latestQuery.current = query

        if (rawQuery.trim().startsWith('$')) {
            // Fetch users
            const { data } = await supabase
                .from('users')
                .select('name, username, id')
                .ilike('name', `%${query.slice(1).trim()}%`)
                .limit(10)

            if (rawQuery === '' || query !== latestQuery.current) {
                setAuthors([])
            } else if (data) {
                //@ts-ignore
                setAuthors(data)
            }
        } else if (rawQuery.trim().startsWith('#')) {
            // Fetch categories
            const { data } = await supabase
                .from('categories')
                .select('name, id')
                .ilike('name', `${query.slice(1).trim()}%`)
                .limit(10)

            if (rawQuery === '' || query !== latestQuery.current) {
                setCategories([])
            } else if (data) {
                //@ts-ignore
                setCategories(data)
            }
        } else {
            // Fetch posts
            const { data } = await supabase
                .from('posts')
                .select('title, id')
                .ilike('title', `%${query}%`)
                .limit(10)

            if (rawQuery === '' || query !== latestQuery.current) {
                setPosts([])
            } else if (data) {
                //@ts-ignore
                setPosts(data)
            }
        }
    }, 500) // 500ms debounce time

    return (
        <>
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

            <Transition.Root
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
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-100"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-100"
                        >
                            <Dialog.Panel
                                className="block mx-auto max-w-2xl transform divide-y dark:divide-gray-800 divide-gray-100 overflow-hidden rounded-xl dark:bg-neutral-900 bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
                                as="form"
                            >
                                {/* <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        if (query.trim() !== '') {
                                            router.push(
                                                `/search/${encodeURIComponent(
                                                    query
                                                )}`
                                            )
                                        }
                                    }}
                                > */}
                                <Combobox name="searchpallet">
                                    <div className="relative">
                                        <MagnifyingGlassIcon
                                            className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                        <Combobox.Input
                                            className="h-12 w-full border-0 bg-transparent pl-11 pr-4 dark:text-gray-100 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                            placeholder="Search..."
                                            onChange={async (event) => {
                                                const newQuery =
                                                    event.target.value
                                                if (newQuery.trim() === '') {
                                                    setPosts([])
                                                    setAuthors([])
                                                    setCategories([])
                                                } else if (
                                                    newQuery.trim() !== '?' &&
                                                    newQuery !== null
                                                ) {
                                                    setRawQuery(newQuery)
                                                    await fetchResults()
                                                }
                                            }}
                                            onKeyDown={(event:any) => {
                                                if (
                                                    event.key === 'Enter' &&
                                                    (rawQuery.trim() !== '' ||
                                                        rawQuery === '?' ||
                                                        rawQuery === '$' ||
                                                        rawQuery === '#')
                                                ) {
                                                    event.preventDefault()
                                                    setOpen(false)
                                                    router.push(
                                                        `/search/${encodeURIComponent(
                                                            rawQuery
                                                        )}`
                                                    )
                                                }
                                            }}
                                        />
                                    </div>
                                    {(posts.length > 0 ||
                                        categories.length > 0 ||
                                        authors.length > 0) && (
                                        <Combobox.Options
                                            static
                                            className="max-h-80 dark:bg-neutral-900 scroll-py-10 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
                                        >
                                            {posts.length > 0 && (
                                                <li>
                                                    <h2 className="text-xs font-semibold dark:text-gray-200 text-gray-900">
                                                        Posts
                                                    </h2>
                                                    <ul className="-mx-4 mt-2 text-sm dark:text-gray-300 text-gray-700">
                                                        {posts.map(
                                                            (post, key) => (
                                                                <Combobox.Option
                                                                    key={key}
                                                                    onClick={() => {
                                                                        router.push(
                                                                            `/post/${stringToSlug(
                                                                                post.title
                                                                            )}/${
                                                                                post.id
                                                                            }`
                                                                        )
                                                                        setOpen(
                                                                            false
                                                                        )
                                                                    }}
                                                                    value={post}
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
                                                                                    post.title
                                                                                }
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </Combobox.Option>
                                                            )
                                                        )}
                                                    </ul>
                                                </li>
                                            )}
                                            {categories.length > 0 && (
                                                <li>
                                                    <h2 className="text-xs font-semibold dark:text-gray-200 text-gray-900">
                                                        Categories
                                                    </h2>
                                                    <ul className="-mx-4 mt-2 text-sm dark:text-gray-300 text-gray-700">
                                                        {categories.map(
                                                            (category, key) => (
                                                                <Combobox.Option
                                                                    key={key}
                                                                    value={
                                                                        category
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
                                                                            `/category/${stringToSlug(
                                                                                category.name
                                                                            )}/${
                                                                                category.id
                                                                            }`
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
                                                                                    category.name
                                                                                }
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </Combobox.Option>
                                                            )
                                                        )}
                                                    </ul>
                                                </li>
                                            )}
                                            {authors.length > 0 && (
                                                <li>
                                                    <h2 className="text-xs font-semibold dark:text-gray-200 text-gray-900">
                                                        Authors
                                                    </h2>
                                                    <ul className="-mx-4 mt-2 text-sm dark:text-gray-300 text-gray-700">
                                                        {authors.map(
                                                            (user, key) => (
                                                                <Combobox.Option
                                                                    key={key}
                                                                    value={user}
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
                                                                            `/author/${user.username}`
                                                                        )
                                                                        setOpen(
                                                                            false
                                                                        )
                                                                    }}
                                                                >
                                                                    <UserIcon className="h-6 w-6" />
                                                                    <span className="ml-3 flex-auto truncate">
                                                                        {user
                                                                            .name
                                                                            .length >
                                                                        20
                                                                            ? user.name.slice(
                                                                                  0,
                                                                                  20
                                                                              ) +
                                                                              '...'
                                                                            : user.name}{' '}
                                                                        <span className="text-gray-500 dark:text-gray-400">
                                                                            • @
                                                                            {user
                                                                                .username
                                                                                .length >
                                                                            10
                                                                                ? user.username.slice(
                                                                                      0,
                                                                                      10
                                                                                  ) +
                                                                                  '...'
                                                                                : user.username}
                                                                        </span>
                                                                    </span>
                                                                </Combobox.Option>
                                                            )
                                                        )}
                                                    </ul>
                                                </li>
                                            )}
                                        </Combobox.Options>
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
                                                for users and projects across
                                                our entire platform. You can
                                                also use the search modifiers
                                                found in the footer below to
                                                limit the posts to just users or
                                                projects.
                                            </p>
                                        </div>
                                    )}
                                    {query !== '' &&
                                        rawQuery !== '?' &&
                                        posts.length === 0 &&
                                        categories.length === 0 &&
                                        authors.length === 0 && (
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
                                            for categories,
                                        </span>
                                        <span className="hidden sm:inline">
                                            to access categories,
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
                                        for users,{' '}
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
                                        {/* <Link
                                            href={'/search'}
                                            className="mx-1 flex h-5 px-1.5 items-center justify-center rounded border bg-white sm:mx-2 border-primary-6000 text-neutral-900"
                                            onClick={() => setOpen(false)}
                                        >
                                            Go to search page
                                        </Link>{' '} */}
                                    </div>
                                </Combobox>
                                {/* </form> */}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

export default SearchModal
