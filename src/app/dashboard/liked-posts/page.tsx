import Card11 from '@/components/Card11/Card11'
import Card6 from '@/components/Card6/Card6'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import React, { Suspense } from 'react'

const DashboardLikedPosts = async () => {
    const supabase = createServerComponentClient({ cookies })
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

    console.log(data)
    return (
        <div className={`nc-PageCategory`}>
            <div className="container pb-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
                <div>
                    {/* LOOP ITEMS */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
                        {data &&
                            data.map((post, id) => (
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
                </div>
            </div>
        </div>
    )
}

export default DashboardLikedPosts
