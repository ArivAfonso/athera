'use client'

import Empty from '@/components/Empty'
import PostsSection from '@/components/PostsSection/PostsSection'
import PostType from '@/types/PostType'
import { createClient } from '@/utils/supabase/client'
import React, { Suspense, useEffect, useState } from 'react'
import Loading from './loading'
import toast from 'react-hot-toast'
import { Alert } from 'ui'

const DashboardLikedPosts = () => {
    const supabase = createClient()
    const [myPosts, setMyPosts] = React.useState<PostType[]>([])
    const [loading, setLoading] = React.useState(true)

    async function addPosts(pageParam: number) {
        const { data: session } = await supabase.auth.getUser()

        if (!session.user) {
            toast.custom((t) => (
                <Alert
                    type="danger"
                    message="You need to be logged in to view this page"
                />
            ))
            return
        }
        const { data, error } = await supabase
            .from('likes')
            .select(
                `
            posts (
                title,
                id,
                created_at,
                estimatedReadingTime,
                description,
                image,
                author (
                    name,
                    id,
                    verified,
                    username,
                    avatar
                ),
                post_topics(topic:topics(id,name,color)),
                bookmarks(user(id)),
                likeCount:likes(count),
                commentCount:comments(count),
                likes(
                    liker(
                        id
                    )
                )
            )
            `
            )
            .eq('liker', session.user?.id)
            .limit(24, { referencedTable: 'posts' })
            .order('created_at', { referencedTable: 'posts', ascending: false })
            .range(pageParam * 48, (pageParam + 1) * 48 - 1)

        const newPosts = (data as unknown as { posts: PostType }[]).map(
            (item) => item.posts
        )

        return newPosts
    }

    async function getPosts() {
        const { data: session } = await supabase.auth.getUser()

        if (!session.user) {
            toast.custom((t) => (
                <Alert
                    type="danger"
                    message="You need to be logged in to view this page"
                />
            ))
            return
        }
        const { data, error } = await supabase
            .from('likes')
            .select(
                `
            posts (
                title,
                id,
                created_at,
                estimatedReadingTime,
                description,
                image,
                author (
                    name,
                    id,
                    verified,
                    username,
                    avatar
                ),
                post_topics(topic:topics(id,name,color)),
                bookmarks(user(id)),
                likeCount:likes(count),
                commentCount:comments(count),
                likes(
                    liker(
                        id
                    )
                )
            )
            `
            )
            .eq('liker', session.user?.id)
            .order('created_at', { referencedTable: 'posts', ascending: false })

        const myPosts = (data as unknown as { posts: PostType }[]).map(
            (item) => item.posts
        )

        return myPosts
    }

    useEffect(() => {
        async function fetchData() {
            const posts = await getPosts()
            setMyPosts(posts || [])
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <div className={`PageTopic`}>
            <div className="container max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32 space-y-10 sm:space-y-12">
                {/* HEADING */}
                <h2 className="text-2xl sm:text-3xl font-semibold">
                    Liked Posts
                </h2>
                <div>
                    {
                        /* LOADING */
                        loading && <Loading />
                    }
                    {/* LOOP ITEMS */}
                    {myPosts[0] ? (
                        <PostsSection
                            posts={myPosts}
                            id="likes"
                            // @ts-ignore
                            postFn={addPosts}
                            rows={3}
                        />
                    ) : (
                        <Empty
                            mainText="No Posts Found"
                            subText="You haven't liked any posts yet."
                            className="text-center p-4"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardLikedPosts
