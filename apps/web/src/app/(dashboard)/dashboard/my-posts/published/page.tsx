'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { Img } from 'ui'
import { createClient } from '@/utils/supabase/client'
import ModalDeletePost from '../ModalDeletePost'
import PostType from '@/types/PostType'
import { useRouter } from 'next/navigation'
import { SearchIcon, SquarePenIcon, Trash2Icon } from 'lucide-react'
import LoadingPublishedPosts from './loading'
import { debounce } from 'lodash'
import PostsTable from '@/components/PostsTable/PostsTable'

const DashboardPosts = () => {
    const [posts, setPosts] = React.useState<PostType[]>([])
    const [myPosts, setMyPosts] = React.useState<PostType[]>([])
    const [loading, setLoading] = React.useState(true)
    const [session, setSession] = useState(null)
    const router = useRouter()

    const [showDeleteModal, setShowDeleteModal] = React.useState(false)
    const [postIdToDelete, setPostIdToDelete] = React.useState('')
    const [searchTerm, setSearchTerm] = React.useState('')

    const fetchPosts = debounce(async (inputValue: String) => {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getUser()

        const { data, error } = await supabase
            .from('posts')
            .select(
                `id, title, created_at, image, post_topics(topic:topics(id,name,color)), bookmarkCount:bookmarks(count), commentCount:comments(count), likeCount:likes(count)`
            )
            .is('scheduled_at', null)
            .ilike('title', `${inputValue}%`)
            .eq('author', session.user?.id)

        data?.forEach((item) => {
            item.created_at = new Date(
                item.created_at ? item.created_at : ''
            ).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        })
        if (error) {
            return
        }

        //@ts-ignore
        setPosts(data)
    }, 300) // 500ms delay

    async function addPosts(pageParam: number) {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getUser()
        const { data, error } = await supabase
            .from('posts')
            .select(
                `id, title, created_at, image, post_topics(topic:topics(id,name,color)), bookmarkCount:bookmarks(count), commentCount:comments(count), likeCount:likes(count)`
            )
            .is('scheduled_at', null)
            .eq('author', session.user?.id)
            .range(pageParam * 24, (pageParam + 1) * 24 - 1)

        data?.forEach((item) => {
            item.created_at = new Date(
                item.created_at ? item.created_at : ''
            ).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        })

        return data as unknown as PostType[]
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const supabase = createClient()
                const { data: session } = await supabase.auth.getUser()

                // First, fetch the posts
                const { data, error } = await supabase
                    .from('posts')
                    .select(
                        `id, title, created_at, image, post_topics(topic:topics(id,name,color)), bookmarkCount:bookmarks(count), commentCount:comments(count), likeCount:likes(count)`
                    )
                    .is('scheduled_at', null)
                    .eq('author', session.user?.id)

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
                //@ts-ignore
                setMyPosts(data)
                setLoading(false)
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
        const { data: session } = await supabase.auth.getUser()
        await supabase.storage
            .from('posts')
            .remove([`${session.user?.id}/${postId}`])
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

    const onDeletePost = (postId: string) => {
        setShowDeleteModal(true)
        setPostIdToDelete(postId)
    }

    return (
        <>
            <title>My Posts</title>
            {loading && <LoadingPublishedPosts />}
            <div className="max-w-4xl mx-auto overflow-x-hidden pt-14 sm:pt-26 pb-24 lg:pb-32">
                <div className="sm:flex">
                    <div className="flex sm:flex-auto flex-col sm:items-center sm:justify-between sm:flex-row pb-8">
                        <h2 className="text-2xl sm:text-3xl font-semibold">
                            My Posts
                        </h2>
                    </div>
                </div>
                <div className="flex flex-col space-y-8">
                    {posts && posts.length > 0 && (
                        <div className="flow-root">
                            <form
                                action=""
                                method="POST"
                                className="flex-1 text-slate-900 dark:text-slate-200"
                            >
                                <div className="bg-slate-50 dark:bg-neutral-700 flex items-center space-x-1 py-2 px-4 rounded-xl h-full">
                                    <SearchIcon strokeWidth={1.5} />
                                    <input
                                        type="search"
                                        placeholder="Type and press enter"
                                        className="border-none bg-transparent focus:outline-none focus:ring-0 w-full text-sm "
                                        onChange={(e) => {
                                            if (
                                                e.target.value.trim().length ===
                                                0
                                            ) {
                                                setPosts(myPosts)
                                                return
                                            }

                                            fetchPosts(e.target.value)
                                        }}
                                    />
                                </div>
                            </form>
                            <div className="overflow-x-auto mt-4 -mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <PostsTable
                                        posts={posts}
                                        onDeletePost={onDeletePost}
                                        postFn={addPosts}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
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
