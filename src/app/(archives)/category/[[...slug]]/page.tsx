import React, { FC } from 'react'
import Card11 from '@/components/Card11/Card11'
import CategoryType from '@/types/CategoryType'
import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Card6 from '@/components/Card6/Card6'

const PageCategory = async (context: any) => {
    const supabase = createServerComponentClient({ cookies })

    const id = context.params.slug[1]
    const { data, error } = await supabase
        .from('categories')
        .select(
            `
    name,
    color,
    post_categories(
        post:posts(
            id,
            title,
            created_at,
            description,
            image,
            likeCount:likes(count),
            commentCount:comments(count),
            post_categories(category:categories(id,name,color)),
            bookmarks(user(id)),
            likes(
                liker(
                    id
                )
            ),
            author(
                id,
                verified,
                name,
                username,
                avatar
            )
        )
    )
    `
        )
        .eq('id', id)
        .single()

    const catData: CategoryType | null = data as unknown as CategoryType

    const { data: session } = await supabase.auth.getSession()

    catData.post_categories?.map((post) => {
        post.post.post_categories[0].category = {
            name: catData.name,
            id: id,
            color: catData.color,
        }
        post.post.likes.map((like) => {
            if (like.liker.id === session?.session?.user.id) {
                post.post.isLiked = true
            }
        })
        post.post.bookmarks.map((bookmark) => {
            if (bookmark.user.id === session?.session?.user.id)
                post.post.isBookmarked = true
            else post.post.isBookmarked = false
        })
    })

    return (
        <div className={`nc-PageCategory`}>
            <title>{catData.name} - Athera</title>
            {/* HEADER */}
            <div className="w-full px-2 xl:max-w-screen-2xl mx-auto">
                <div className="flex flex-col justify-center items-center h-48">
                    {' '}
                    {/* Adjust the height (h-48) as needed */}
                    <h1 className="text-center text-7xl font-semibold md:text-8xl mb-2">
                        {' '}
                        {/* Add margin-bottom (mb-2) */}
                        {catData.name}
                    </h1>
                    <h2 className="text-center text-2xl md:text-3xl">
                        Found {catData.post_categories?.length} posts
                    </h2>
                </div>
            </div>
            {/* ====================== END HEADER ====================== */}

            <div className="container pb-16 lg:pb-28 lg:pt-10 space-y-16 lg:space-y-28">
                <div>
                    {/* <div className="flex flex-col sm:justify-between sm:flex-row">
                        <div className="flex space-x-2.5">
                            {/* Check if data.otherCategories is defined before passing it 
                            {data.otherCategories && (
                                <ModalCategories
                                    categories={data.otherCategories.slice(
                                        0,
                                        30
                                    )}
                                />
                            )}
                        </div>
                    </div> */}
                    {/* {trendingPosts && (
                        <SectionTrending
                            heading=""
                            className="py-16 lg:py-28"
                            posts={trendingPosts}
                        />
                    )} */}
                    {/* LOOP ITEMS */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
                        {catData.post_categories &&
                            catData.post_categories.map((post, id) => (
                                <div key={id}>
                                    <div className="hidden sm:block">
                                        {/* Render Card11 on larger screens */}
                                        <Card11 post={post.post} />
                                    </div>
                                    <div className="sm:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {/* Render Card5 on smaller screens */}
                                        <Card6 post={post.post} />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageCategory
