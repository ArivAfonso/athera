import Card11 from '@/components/Card11/Card11'
import Card6 from '@/components/Card6/Card6'
import Empty from '@/components/Empty'
import PostType from '@/types/PostType'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import React, { Suspense } from 'react'

const DashboardLikedPosts = async () => {
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
        .eq('liker', session?.session?.user.id)

    data?.map((post) => {
        //@ts-ignore
        post.posts.isLiked = true
        //@ts-ignore
        post.posts.bookmarks.map((bookmark) => {
            if (bookmark.user.id === session?.session?.user.id) {
                //@ts-ignore
                post.isBookmarked = true
            } else {
                //@ts-ignore
                post.isBookmarked = false
            }
        })
    })

    const myPosts = data as unknown as { posts: PostType }[]

    return (
        <div className={`nc-PageCategory`}>
            <div className="container max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32 space-y-10 sm:space-y-12">
                {/* HEADING */}
                <h2 className="text-2xl sm:text-3xl font-semibold">
                    Liked Posts
                </h2>
                <div>
                    {/* LOOP ITEMS */}
                    {myPosts[0] ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {myPosts.map((post, id) => (
                                <div key={id}>
                                    <div className="hidden sm:block">
                                        {/* Render Card11 on larger screens */}
                                        <Card11 post={post.posts} />
                                    </div>
                                    <div className="sm:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {/* Render Card5 on smaller screens */}
                                        <Card6 post={post.posts} />
                                    </div>
                                </div>
                            ))}
                        </div>
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
