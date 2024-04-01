'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import NcImage from '@/components/NcImage/NcImage'
import { createClient } from '@/utils/supabase/client'
import ModalDeletePost from '../ModalDeletePost'
import PostType from '@/types/PostType'
import stringToSlug from '@/utils/stringToSlug'
import Link from 'next/link'
import Badge from '@/components/Badge/Badge'
import CategoryBadgeList from '@/components/CategoryBadgeList/CategoryBadgeList'
import { useRouter } from 'next/navigation'
import { SquarePenIcon, Trash2Icon } from 'lucide-react'

const DashboardPosts = () => {
    const [posts, setPosts] = React.useState<PostType[]>([])
    const [myPosts, setMyPosts] = React.useState<PostType[]>([])
    const router = useRouter()

    const [showDeleteModal, setShowDeleteModal] = React.useState(false)
    const [postIdToDelete, setPostIdToDelete] = React.useState('')

    useEffect(() => {
        async function fetchData() {
            try {
                const supabase = createClient()
                const { data: session } = await supabase.auth.getSession()

                // First, fetch the posts
                const { data, error } = await supabase
                    .from('posts')
                    .select(
                        `id, title, created_at, image, post_categories(category:categories(id,name,color)), bookmarkCount:bookmarks(count), commentCount:comments(count), likeCount:likes(count)`
                    )
                    .eq('author', session.session?.user.id)

                data?.forEach((item) => {
                    item.created_at = new Date(
                        item.created_at ? item.created_at : ''
                    ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                })
                //@ts-ignore
                setPosts(data)

                // Then, fetch the drafts
                const { data: draftData, error: draftError } = await supabase
                    .from('drafts')
                    .select(
                        `id, title, created_at, estimatedReadingTime, edited_at, image, draft_categories(category:categories(id,name,color))`
                    )
                    .eq('author', session.session?.user.id)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDeletePost = async (postId: string) => {
        const supabase = createClient() // Change to server component client
        const { error } = await supabase.from('posts').delete().eq('id', postId)
        const { data: session } = await supabase.auth.getSession()
        await supabase.storage
            .from('posts')
            .remove([`${session.session?.user.id}/${postId}`])
        if (error) {
            // Handle the error
            console.error('Error deleting post:', error)
        } else {
            // Remove the deleted post from the posts state
            const updatedPosts = posts?.filter((post) => post.id !== postId)
            setPosts(updatedPosts)
            setMyPosts(updatedPosts)
        }
    }

    return (
        <>
            <title>My Posts</title>
            <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
                <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row pb-8">
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                        My Posts
                    </h2>
                </div>
                {posts && posts.length > 0 && (
                    <div className="flex flex-col space-y-8">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
                                                Categories
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
                                        {posts.map((post, key) => {
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
                                                                <NcImage
                                                                    src={
                                                                        post.image ||
                                                                        ''
                                                                    }
                                                                    alt={
                                                                        post.title
                                                                    }
                                                                    className="rounded-md object-cover w-full h-full"
                                                                    fill
                                                                />
                                                            </div>
                                                            <div className="ms-4">
                                                                <div className="font-medium text-gray-900 dark:text-neutral-200 w-84 max-w-sm flex whitespace-normal">
                                                                    <span
                                                                        dangerouslySetInnerHTML={{
                                                                            __html:
                                                                                post.title ||
                                                                                '',
                                                                        }}
                                                                    ></span>
                                                                </div>
                                                                <div className="mt-1 text-gray-500">
                                                                    {
                                                                        post.created_at
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                        <Badge
                                                            name={
                                                                (post
                                                                    .likeCount[0]
                                                                    .count as ReactNode) ||
                                                                0
                                                            }
                                                            color="red"
                                                            className="rounded-md"
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                        <CategoryBadgeList
                                                            categories={
                                                                post.post_categories
                                                            }
                                                            chars={20}
                                                            className="flex space-x-1 justify-center"
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-8 py-5 text-sm text-gray-500">
                                                        <Badge
                                                            name={
                                                                (post
                                                                    .bookmarkCount[0]
                                                                    .count as ReactNode) ||
                                                                0
                                                            }
                                                            color="blue"
                                                            className="rounded-md"
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-8 py-5 text-sm text-gray-500">
                                                        <Badge
                                                            name={
                                                                (post
                                                                    .commentCount[0]
                                                                    .count as ReactNode) ||
                                                                0
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
                                                                setShowDeleteModal(
                                                                    true
                                                                )
                                                                setPostIdToDelete(
                                                                    post.id
                                                                )
                                                            }}
                                                            className="text-rose-600 hover:text-rose-900"
                                                        >
                                                            <Trash2Icon
                                                                className="h-6 w-6"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {showDeleteModal && (
                    <ModalDeletePost
                        show={showDeleteModal}
                        id={postIdToDelete}
                        onCloseModalDeletePost={() => setShowDeleteModal(false)}
                        onDeletePost={handleDeletePost} // Pass onDeletePost method
                    />
                )}
            </div>
        </>
    )
}

export default DashboardPosts
