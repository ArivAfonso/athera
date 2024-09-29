'use client'

import stringToSlug from '@/utils/stringToSlug'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { TrashIcon } from 'lucide-react'
import router from 'next/router'
import { Img, PlaceIcon } from 'ui'
import Badge from '../Badge/Badge'
import TopicBadgeList from '../TopicBadgeList/TopicBadgeList'
import Link from 'next/link'
import DraftType from '@/types/DraftType'
import { useEffect, useRef, useState } from 'react'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { useInfiniteQuery } from '@tanstack/react-query'

interface DraftsTableProps {
    drafts: DraftType[]
    draftHasTopic: boolean
    onDeleteDraft: (draftId: string) => void
    draftFn: (pageParam: number) => Promise<DraftType[]>
}

function DraftsTable({
    drafts,
    onDeleteDraft,
    draftFn,
    draftHasTopic,
}: DraftsTableProps) {
    const [addPostsFinished, setAddPostsFinished] = useState(false)

    //Set up infinite query
    const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: ['drafts'],
            queryFn: async ({ pageParam = 1 }) => {
                if (addPostsFinished) return Promise.resolve([])
                //@ts-ignore
                const response = await draftFn(pageParam)
                if (response.length === 0) setAddPostsFinished(true)
                return response
            },
            getNextPageParam: (lastPage, allPages) => {
                return allPages.length + 1
            },
            initialPageParam: 1, //THIS LINE HERE!
            initialData: {
                pages: drafts ? [drafts] : [],
                pageParams: [1],
            },
        })

    const lastPostRef = useRef(null)
    const entry = useIntersectionObserver(lastPostRef, {
        root: null,
        rootMargin: '1000px',
        threshold: 0.1,
    })

    const _drafts = data.pages?.flatMap((page) => page)

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage) {
            fetchNextPage()
        }
    }, [entry?.isIntersecting, hasNextPage])

    return (
        <table className="min-w-full divide-y overflow-x-auto divide-gray-300 dark:divide-neutral-600">
            <thead>
                <tr>
                    <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-start text-sm font-normal text-neutral-600 dark:text-neutral-400 sm:pl-0 capitalize"
                    >
                        Draft
                    </th>
                    {draftHasTopic && (
                        <th
                            scope="col"
                            className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                        >
                            Topics
                        </th>
                    )}
                    <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                    >
                        Edited At
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                    >
                        Time
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-600">
                {_drafts.map((draft, key) => {
                    return (
                        <tr key={key}>
                            <td className="whitespace-nowrap py-4 sm:py-5 ps-4 pe-3 text-sm sm:ps-0">
                                <Link
                                    href={`/dashboard/edit-draft/${stringToSlug(
                                        draft.title
                                    )}/${draft.id}`}
                                    className="flex items-center"
                                >
                                    <div className="h-12 w-12 sm:h-16 sm:w-16 relative flex-shrink-0">
                                        {draft.image ? (
                                            <>
                                                <Img
                                                    src={draft.image}
                                                    alt={draft.title}
                                                    className="rounded-md object-cover w-full h-full"
                                                    fill
                                                />
                                            </>
                                        ) : (
                                            <div className="text-gray-500">
                                                <PlaceIcon fill="#6b7280" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="ms-4">
                                        <div className="font-medium text-gray-900 dark:text-neutral-200 w-84 max-w-sm flex whitespace-normal">
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: draft.title || '',
                                                }}
                                            ></span>
                                        </div>
                                        <div className="mt-1 text-gray-500">
                                            {draft.created_at}
                                        </div>
                                    </div>
                                </Link>
                            </td>

                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                {draft.draft_topics && (
                                    <TopicBadgeList
                                        topics={draft.draft_topics}
                                        chars={20}
                                        className="flex space-x-1 justify-center"
                                    />
                                )}
                            </td>

                            <td className="whitespace-nowrap text-center px-3 py-5 text-sm text-gray-500">
                                {draft.edited_at}
                            </td>

                            <td className="whitespace-nowrap text-center px-3 py-5 text-sm text-gray-500">
                                <Badge
                                    name={draft.estimatedReadingTime + ' mins'}
                                    color="blue"
                                    className="rounded-md"
                                />
                            </td>

                            <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium text-neutral-300">
                                <button
                                    onClick={() => {
                                        router.push(
                                            `/dashboard/edit-draft/${draft.id}`
                                        )
                                    }}
                                    className="text-primary-800 dark:text-primary-500 hover:text-primary-900"
                                >
                                    <PencilSquareIcon
                                        strokeWidth={1.5}
                                        className="h-6 w-6"
                                    />
                                </button>
                                {` | `}
                                <button
                                    onClick={() => {
                                        onDeleteDraft(draft.id)
                                    }}
                                    className="text-rose-600 hover:text-rose-900"
                                >
                                    <TrashIcon
                                        strokeWidth={1.5}
                                        className="h-6 w-6"
                                    />
                                </button>
                            </td>
                        </tr>
                    )
                })}
                <div ref={lastPostRef} style={{ all: 'initial' }}></div>
                {isFetchingNextPage && (
                    <>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <tr key={index}>
                                <td className="hitespace-nowrap pl-4 sm:py-5 ps-4 pe-3 text-sm sm:ps-0">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-16 w-16 bg-gray-300 dark:bg-gray-600 rounded-md space-y-2 animate-pulse"></div>
                                        <div>
                                            <div className="h-4 bg-gray-300 dark:bg-gray-600 w-48 animate-pulse"></div>
                                            <div className="h-4 mt-2 bg-gray-300 dark:bg-gray-600 w-48 animate-pulse"></div>
                                            <div className="h-3 mt-2 bg-gray-300 dark:bg-gray-600 w-20 animate-pulse"></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="hitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                    <div className="h-7 w-7 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                                </td>
                                <td className="hitespace-nowrap px-3 py-5 text-sm text-gray-500 flex mt-3 items-center">
                                    <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse mr-1"></div>
                                    <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"></div>
                                </td>
                                <td className="hitespace-nowrap px-3 py-5 text-sm text-gray-500 pl-8">
                                    <div className="h-7 w-7 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 pl-8">
                                    <div className="h-7 w-7 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                                </td>
                                <td className="hitespace-nowrap px-3 py-5 text-sm font-medium text-gray-500 flex mt-3 items-center">
                                    <div className="h-7 w-7 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse mr-"></div>
                                    {` | `}
                                    <div className="h-7 w-7 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse ml-1"></div>
                                </td>
                            </tr>
                        ))}
                    </>
                )}
            </tbody>
        </table>
    )
}

export default DraftsTable
