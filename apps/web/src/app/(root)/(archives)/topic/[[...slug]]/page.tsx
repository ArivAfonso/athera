'use client'

import React, { useEffect, useState } from 'react'
import Card11 from '@/components/Card11/Card11'
import TopicType from '@/types/TopicType'
import Image from 'next/image'
import Card6 from '@/components/Card6/Card6'
import { Metadata } from 'next'
import PostsSection from '@/components/PostsSection/PostsSection'
import PostType from '@/types/PostType'
import { createClient } from '@/utils/supabase/client'
import CircleLoading from '@/components/CircleLoading/CircleLoading'
import { Heading2 } from 'ui'
import Empty from '@/components/Empty'

async function addPosts(pageParam: number) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('posts')
        .select(
            `
            id,
            title,
            created_at,
            scheduled_at,
            description,
            image,
            likeCount:likes(count),
            commentCount:comments(count),
            post_topics(topic:topics(id,name,color)),
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
            `
        )
        .eq('post_topics.topic_id', 1)
        .is('scheduled_at', null)
        .order('created_at', { ascending: false })
        .range(pageParam * 24, (pageParam + 1) * 24 - 1)

    const newPosts = data as unknown as PostType[]

    return newPosts
}

async function getTopics(context: { params: { slug: any } }) {
    const supabase = createClient()

    const id = context.params.slug[1]
    const { data, error } = await supabase
        .from('topics')
        .select(
            `
            id,
            name,
            color,
            image,
            posts(
                id,
                title,
                created_at,
                scheduled_at,
                description,
                image,
                likeCount:likes(count),
                commentCount:comments(count),
                post_topics(topic:topics(id,name,color)),
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
            `
        )
        .eq('id', id)
        .is('posts.scheduled_at', null)
        .single()

    const catData: TopicType = data as unknown as TopicType

    console.log(error, data, catData)

    return catData
}

// export async function generateMetadata(
//     props: any,
//     searchParams: any
// ): Promise<Metadata> {
//     const data: TopicType = await getTopics(props)

//     return {
//         title: data.name + ' - Latest articles on Athera',
//         description: `Read the latest articles on ${data.name}.`,
//     }
// }

const PageTopic = async (context: any) => {
    const [catData, setCatData] = useState<TopicType>()

    useEffect(() => {
        async function getData() {
            const data = await getTopics(context)
            setCatData(data)
        }

        getData()
    }, [context])

    useEffect(() => {
        if (catData?.name) {
            document.title = `${catData.name} - Latest articles on Athera`
        }
    }, [catData])

    return (
        <div className="PageTopic">
            <div className="w-full px-2 pt-2 xl:max-w-screen-2xl mx-auto">
                {!catData ? (
                    <CircleLoading />
                ) : (
                    <>
                        {catData.image ? (
                            <div className="relative aspect-w-16 aspect-h-13 sm:aspect-h-9 lg:aspect-h-8 xl:aspect-h-5 rounded-3xl md:rounded-[40px] overflow-hidden z-0">
                                <Image
                                    alt="Topic header image"
                                    fill
                                    src={catData.image || ''}
                                    className="object-cover w-full h-full rounded-3xl md:rounded-[40px]"
                                    sizes="(max-width: 1280px) 100vw, 1536px"
                                />
                                <div className="flex items-center bg-black text-white bg-opacity-30 flex-col justify-center">
                                    <h2 className="align-middle flex items-center text-5xl font-semibold md:text-7xl text-center justify-center">
                                        {catData.name.replaceAll('-', ' ')}
                                    </h2>
                                    <span className="block mt-4 text-neutral-300">
                                        {catData.posts?.length} Articles
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center h-48">
                                <Heading2 className="mb-2 underline decoration-blue-200 dark:decoration-blue-800">
                                    {catData?.name}
                                </Heading2>

                                <h2 className="text-center font-medium text-sm">
                                    Found {catData?.posts?.length} posts
                                </h2>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="container pb-16 lg:pb-28 lg:pt-10 space-y-16 lg:space-y-28">
                <div>
                    {
                        //@ts-ignore
                        catData?.posts[0] ? (
                            <PostsSection
                                postFn={addPosts}
                                posts={catData.posts}
                                id={`topic-${catData.id}`}
                            />
                        ) : (
                            <Empty
                                mainText="No posts found"
                                subText="This topic doesn't have any posts yet."
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default PageTopic
