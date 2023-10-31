'use client'

import React, { useEffect } from 'react'
import NcImage from '@/components/NcImage/NcImage'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import NoResultsFound from '@/components/NoResultsFound/NoResultsFound'
import ModalDeletePost from './ModalDeletePost'
import PostType from '@/types/PostType'
import stringToSlug from '@/utils/stringToSlug'
import Link from 'next/link'

const DashboardPosts = () => {
    const [posts, setPosts] = React.useState<PostType[]>([])

    const [showDeleteModal, setShowDeleteModal] = React.useState(false)
    const [postIdToDelete, setPostIdToDelete] = React.useState('')

    useEffect(() => {
        async function fetchData() {
            try {
                const supabase = createClientComponentClient()
                const { data: session, error } =
                    await supabase.auth.getSession()

                // First, fetch the posts
                const { data } = await supabase
                    .from('posts')
                    .select(`id, title, image, comments(count), likes(count)`)
                    .eq('author', session.session?.user.id)
                //@ts-ignore
                setPosts(data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDeletePost = async (postId: string) => {
        const supabase = createClientComponentClient() // Change to server component client
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
            setPosts(updatedPosts) // Assuming you have 'setPosts' function to update the posts state
        }
    }

    return (
        <>
            <title>My Posts</title>
            <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
                {posts && posts.length > 0 ? (
                    <div className="flex flex-col space-y-8">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full px-1 sm:px-6 lg:px-8">
                                <div className="shadow dark:border dark:border-neutral-800 overflow-hidden sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                                            <tr className="text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    No.
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Article
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Comments
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Likes
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="relative px-6 py-3"
                                                >
                                                    <span className="sr-only">
                                                        Edit
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                                            {posts &&
                                                posts.map((post, key) => (
                                                    <tr key={key}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-neutral-700">
                                                            {key + 1}{' '}
                                                            {/* Adding the source number */}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center w-96 lg:w-auto max-w-md overflow-hidden">
                                                                <NcImage
                                                                    containerClassName="flex-shrink-0 h-12 w-12 rounded-lg relative z-0 overflow-hidden lg:h-14 lg:w-14"
                                                                    src={
                                                                        post.image
                                                                    }
                                                                    fill
                                                                    sizes="80px"
                                                                    alt="post"
                                                                />
                                                                <div className="ml-4 flex-grow">
                                                                    <Link
                                                                        href={`/post/${stringToSlug(
                                                                            post.title
                                                                        )}/${
                                                                            post.id
                                                                        }`}
                                                                    >
                                                                        <h2 className="inline-flex line-clamp-2 text-sm font-semibold  dark:text-neutral-300">
                                                                            {
                                                                                post.title
                                                                            }
                                                                        </h2>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-neutral-500 dark:text-neutral-400">
                                                            <span>
                                                                {post.comments
                                                                    ?.length -
                                                                    1}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-teal-100 dark:bg-teal-900 text-teal-900 dark:text-white lg:text-sm">
                                                                {post.likes
                                                                    ?.length -
                                                                    1}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-neutral-300">
                                                            <button
                                                                href={`/edit/${post.id}`}
                                                                className="text-primary-800 dark:text-primary-500 hover:text-primary-900"
                                                            >
                                                                Edit
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
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <NoResultsFound message="Awww You haven't posted anything!!" />
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
