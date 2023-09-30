import React, { FC } from 'react'
import ModalCategories from '../../ModalCategories'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import CategoryFilterListBox from '@/components/CategoryFilterListBox/CategoryFilterListBox'
import Card11 from '@/components/Card11/Card11'
import Image from 'next/image'
import SectionTrending from '@/components/Sections/SectionTrending'
import PostType from '@/types/PostType'
import CategoryType from '@/types/CategoryType'
import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

async function getData(context: { params: { slug: any } }) {
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
            author(
                name,
                username,
                avatar
            )
        )
    )
    `
        )
        .eq('id', id)
    const postData: CategoryType | null = data as unknown as CategoryType
    console.log(postData[0].post_categories)
    //@ts-ignore
    return postData[0]
}

export async function generateMetadata(
    props: any,
    searchParams: any
): Promise<Metadata> {
    const data: CategoryType = await getData(props)

    return {
        title: data.name,
        description: `News articles and other content about ${data.name}`,
        openGraph: {
            title: data.name,
            type: 'article',
        },
    }
}

const PageCategory = async (context: any) => {
    const data: CategoryType = await getData(context)
    console.log(data.posts_categories)
    const trendingPosts = data?.posts_categories?.filter((_, i) => i < 4)

    return (
        <div className={`nc-PageCategory`}>
            {/* HEADER */}
            <div className="w-full px-2 xl:max-w-screen-2xl mx-auto">
                <div className="relative aspect-w-16 aspect-h-13 sm:aspect-h-9 lg:aspect-h-8 xl:aspect-h-5 rounded-3xl md:rounded-[40px] overflow-hidden z-0">
                    <h2 className="inline-block align-middle text-5xl font-semibold md:text-6xl ">
                        Videos
                    </h2>
                </div>
            </div>
            {/* ====================== END HEADER ====================== */}

            <div className="container pt-10 pb-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
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
                    {trendingPosts && (
                        <SectionTrending
                            heading=""
                            className="py-16 lg:py-28"
                            posts={trendingPosts}
                        />
                    )}
                    {/* LOOP ITEMS */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
                        {data.posts_categories &&
                            data.posts_categories.map((post, id) => (
                                <Card11 key={id} post={post.posts} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageCategory
