import Card11 from '@/components/Card11/Card11'
import Card6 from '@/components/Card6/Card6'
import Empty from '@/components/Empty'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import React, { Suspense } from 'react'

const revalidate = 60

const DashboardBookmarks = async () => {
    const supabase = createServerComponentClient({ cookies })
    const { data: session } = await supabase.auth.getSession()

    const { data, error } = await supabase
        .from('bookmarks')
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
        .eq('user', session?.session?.user.id)

    data?.map((post) => {
        //@ts-ignore
        post.posts.isBookmarked = true
        //@ts-ignore
        post.posts.likes.map((like) => {
            if (like.liker.id === session?.session?.user.id) {
                //@ts-ignore
                post.posts.isLiked = true
            } else {
                //@ts-ignore
                post.posts.isLiked = false
            }
        })
    })

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
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 lg:mt-10">
                                {data.map((post, id) => (
                                    <div key={id}>
                                        <div className="hidden sm:block">
                                            {/* Render Card11 on larger screens */}
                                            {/* @ts-ignore */}
                                            <Card11 post={post.posts} />
                                        </div>
                                        <div className="sm:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {/* Render Card5 on smaller screens */}
                                            {/* @ts-ignore */}
                                            <Card6 post={post.posts} />
                                        </div>
                                    </div>
                                ))}
                            </div>
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

export default DashboardBookmarks
