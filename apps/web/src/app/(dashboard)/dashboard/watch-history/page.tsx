import Card11 from '@/components/Card11/Card11'
import Card6 from '@/components/Card6/Card6'
import Empty from '@/components/Empty'
import PostsSection from '@/components/PostsSection/PostsSection'
import PostType from '@/types/PostType'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'

const DashboardWatchHistory = async () => {
    const supabase = createClient(cookies())
    const { data: session } = await supabase.auth.getSession()

    if (!session.session) {
        redirect('/login')
    }

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
                post_categories(category:categories(id,name,color)),
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
        .eq('user_id', session?.session?.user.id)

    console.log(error)
    const myPosts = (data as unknown as { posts: PostType }[]).map(
        (item) => item.posts
    )

    return (
        <>
            <title>My Bookmarks - Athera</title>
            <div className={`nc-PageCategory`}>
                <div className="container max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32 space-y-10 sm:space-y-12">
                    {/* HEADING */}
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                        Bookmarks
                    </h2>
                    <div>
                        {/* LOOP ITEMS */}
                        {data ? (
                            <PostsSection
                                posts={myPosts}
                                rows={3}
                                watchOption={true}
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
