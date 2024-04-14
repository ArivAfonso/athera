import Empty from '@/components/Empty'
import PostsSection from '@/components/PostsSection/PostsSection'
import PostType from '@/types/PostType'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import React, { Suspense } from 'react'

const DashboardLikedPosts = async () => {
    console.log('hi')
    const supabase = createClient(cookies())
    const { data: session } = await supabase.auth.getSession()

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
        .eq('liker', session?.session?.user.id)

    const myPosts = (data as unknown as { posts: PostType }[]).map(
        (item) => item.posts
    )

    return (
        <div className={`nc-PageTopic`}>
            <div className="container max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32 space-y-10 sm:space-y-12">
                {/* HEADING */}
                <h2 className="text-2xl sm:text-3xl font-semibold">
                    Liked Posts
                </h2>
                <div>
                    {/* LOOP ITEMS */}
                    {myPosts[0] ? (
                        <PostsSection posts={myPosts} rows={3} />
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
