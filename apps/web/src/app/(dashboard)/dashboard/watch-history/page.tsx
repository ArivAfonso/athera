'use client'

import Empty from '@/components/Empty'
import PostsSection from '@/components/PostsSection/PostsSection'
import PostType from '@/types/PostType'
import { createClient } from '@/utils/supabase/client'
import React, { Suspense, useEffect } from 'react'

async function getPosts() {
    const supabase = createClient()
    const { data: session } = await supabase.auth.getUser()
    const { data, error } = await supabase
        .from('watch_history')
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
                    id,
                    verified,
                    name,
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
        .eq('user_id', session.user?.id)
        .order('created_at', { ascending: false })
        .limit(24)

    return (data as unknown as { posts: PostType }[]).map((item) => item.posts)
}

const DashboardWatchHistory = () => {
    const supabase = createClient()

    const [myPosts, setMyPosts] = React.useState<PostType[]>([])

    useEffect(() => {
        async function fetchData() {
            const posts = await getPosts()
            setMyPosts(posts)
        }
        fetchData()
    }, [])

    async function addPosts(pageParam: number) {
        const { data: session } = await supabase.auth.getUser()
        const { data: newData, error } = await supabase
            .from('watch_history')
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
                        id,
                        verified,
                        name,
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
            .eq('user_id', session.user?.id)
            .order('created_at', { ascending: false })
            .range(pageParam * 24, (pageParam + 1) * 24 - 1)

        const newPosts = (newData as unknown as { posts: PostType }[]).map(
            (item) => item.posts
        )

        return newPosts
    }

    return (
        <>
            <title>Watch History - Athera</title>
            <div className={`PageTopic`}>
                <div className="container max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32 space-y-10 sm:space-y-12">
                    {/* HEADING */}
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                        Watch History
                    </h2>
                    <div>
                        {/* LOOP ITEMS */}
                        {myPosts[0] ? (
                            <PostsSection
                                posts={myPosts}
                                rows={3}
                                id="watch-history"
                                watchOption={true}
                                postFn={addPosts}
                            />
                        ) : (
                            <Empty
                                mainText="No Posts Found"
                                subText="You have not bookmarked any posts yet."
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardWatchHistory
