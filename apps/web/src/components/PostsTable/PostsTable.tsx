'use client'

import stringToSlug from '@/utils/stringToSlug'
import { SquarePenIcon, Trash2Icon } from 'lucide-react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import TopicBadgeList from '../TopicBadgeList/TopicBadgeList'
import Link from 'next/link'
import { Img } from 'ui'
import Badge from '../Badge/Badge'
import PostType from '@/types/PostType'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface PostsTableProps {
    posts: PostType[]
    onDeletePost: (id: string) => void
    postFn: (pageParam: number) => Promise<PostType[]>
}

function PostsTable({ posts, onDeletePost, postFn }: PostsTableProps) {
    const [addPostsFinished, setAddPostsFinished] = useState(false)

    const router = useRouter()

    //Set up infinite query
    const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: ['posts'],
            queryFn: async ({ pageParam = 1 }) => {
                if (addPostsFinished) return Promise.resolve([])
                const response = await postFn(pageParam)
                if (response.length === 0) setAddPostsFinished(true)
                return response
            },
            getNextPageParam: (lastPage, allPages) => {
                return allPages.length + 1
            },
            initialPageParam: 1, //THIS LINE HERE!
            initialData: {
                pages: posts ? [posts] : [],
                pageParams: [1],
            },
        })

    const lastPostRef = useRef(null)
    const entry = useIntersectionObserver(lastPostRef, {
        root: null,
        rootMargin: '1000px',
        threshold: 0.1,
    })

    const _posts = data.pages?.flatMap((page) => page)

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage) {
            fetchNextPage()
        }
    }, [entry?.isIntersecting, hasNextPage])

    return (
        <table className="min-w-full divide-y divide-gray-300 dark:divide-neutral-600">
            <thead>
                <tr>
                    <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-start text-sm font-normal text-neutral-600 dark:text-neutral-400 sm:pl-0 capitalize"
                    >
                        Post
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                    >
                        Likes
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                    >
                        Topics
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                    >
                        Bookmarks
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                    >
                        Comments
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-600">
                {_posts.map((post, key) => {
                    return (
                        <tr key={key}>
                            <td className="whitespace-nowrap py-4 sm:py-5 ps-4 pe-3 text-sm sm:ps-0">
                                <Link
                                    href={`/post/${stringToSlug(
                                        post.title
                                    )}/${post.id}`}
                                    className="flex items-center"
                                >
                                    <div className="h-12 w-12 sm:h-16 sm:w-16 relative flex-shrink-0">
                                        <Img
                                            src={post.image || ''}
                                            alt={post.title}
                                            className="rounded-md object-cover w-full h-full"
                                            fill
                                        />
                                    </div>
                                    <div className="ms-4">
                                        <div className="font-medium text-gray-900 dark:text-neutral-200 w-84 max-w-sm flex whitespace-normal">
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: post.title || '',
                                                }}
                                                className="line-clamp-2"
                                            ></span>
                                        </div>
                                        <div className="mt-1 text-gray-500">
                                            {post.created_at}
                                        </div>
                                    </div>
                                </Link>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                <Badge
                                    name={
                                        (post.likeCount[0]
                                            .count as ReactNode) || 0
                                    }
                                    color="red"
                                    className="rounded-md"
                                />
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                <TopicBadgeList
                                    topics={post.post_topics}
                                    chars={20}
                                    className="flex space-x-1 justify-center"
                                />
                            </td>
                            <td className="whitespace-nowrap px-8 py-5 text-sm text-gray-500">
                                <Badge
                                    name={
                                        (post.bookmarkCount[0]
                                            .count as ReactNode) || 0
                                    }
                                    color="blue"
                                    className="rounded-md"
                                />
                            </td>
                            <td className="whitespace-nowrap px-8 py-5 text-sm text-gray-500">
                                <Badge
                                    name={
                                        (post.commentCount[0]
                                            .count as ReactNode) || 0
                                    }
                                    color="blue"
                                    className="rounded-md"
                                />
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium text-neutral-300">
                                <button
                                    onClick={() => {
                                        router.push(
                                            `/dashboard/edit-post/${post.id}`
                                        )
                                    }}
                                    className="text-primary-800 dark:text-primary-500 hover:text-primary-900"
                                >
                                    <SquarePenIcon className="h-6 w-6" />
                                </button>
                                {` | `}
                                <button
                                    onClick={() => {
                                        onDeletePost(post.id)
                                    }}
                                    className="text-rose-600 hover:text-rose-900"
                                >
                                    <Trash2Icon
                                        className="h-6 w-6"
                                        strokeWidth={1.5}
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

export default PostsTable
