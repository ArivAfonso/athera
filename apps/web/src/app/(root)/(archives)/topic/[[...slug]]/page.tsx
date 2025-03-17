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
import NewsCard from '@/components/NewsCard/NewsCard'
import NewsType from '@/types/NewsType'
import NewsSection from '@/components/NewsSection/NewsSection'

async function addNews(topicId: string, pageParam: number) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('news')
        .select(
            `
            id,
            title,
            created_at,
            description,
            link,
            summary,
            author,
            image,
            source(
                id,
                name,
                url,
                image
            ),
            likeCount:likes(count),
            commentCount:comments(count),
            news_topics(topic:topics(id,name,color))
            `
        )
        .eq('source', topicId)
        .order('created_at', { ascending: false })
        .range(pageParam * 48, (pageParam + 1) * 48 - 1)

    if (error) {
        console.error('Error fetching news:', error)
        return []
    }

    return data as unknown as NewsType[]
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
            news(
                id,
                title,
                created_at,
                description,
                author,
                link,
                summary,
                image,
                likeCount:likes(count),
                commentCount:comments(count),
                news_topics(topic:topics(id,name,color,newsCount:news(count))),
                source(
                    id,
                    name,
                    description,
                    url,
                    image
                )
            )
            `
        )
        .eq('id', id)
        .single()

    const catData: TopicType = data as unknown as TopicType

    console.log(error, data, catData)

    return catData
}

const PageTopic = async (context: any) => {
    const [catData, setCatData] = useState<TopicType>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getData() {
            const data = await getTopics(context)
            setCatData(data)
            setLoading(false)
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
                                        {catData.news?.length} Articles
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center h-48">
                                <Heading2 className="mb-2 underline decoration-blue-200 dark:decoration-blue-800">
                                    {catData?.name}
                                </Heading2>

                                <h2 className="text-center font-medium text-sm">
                                    Found {catData?.news?.length} articles
                                </h2>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* NEWS POSTS FROM THIS SOURCE */}
            <div className="container pb-16 lg:pb-28 lg:pt-10">
                {loading ? (
                    <CircleLoading />
                ) : catData && catData.news && catData.news.length > 0 ? (
                    <NewsSection
                        id={catData.id}
                        news={catData.news}
                        newsFn={(page: number) => addNews(catData.id, page)}
                        onHideNews={(newsId: string) => {
                            // setCatData((prev) => ({ ...prev, news: prev.news.filter((item) => item.id !== newsId) }));
                        }}
                    />
                ) : (
                    <Empty
                        mainText="No posts found"
                        subText="There are no posts from this source at the moment."
                    />
                )}
            </div>
        </div>
    )
}

export default PageTopic
