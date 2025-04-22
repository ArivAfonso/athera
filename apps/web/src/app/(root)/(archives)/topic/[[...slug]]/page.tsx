'use client'

import React, { useEffect, useState } from 'react'
import TopicType from '@/types/TopicType'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { Heading2, Img } from 'ui'
import Empty from '@/components/Empty'
import NewsSection from '@/components/NewsSection/NewsSection'
import Loading from './loading'

// Removed CircleLoading import to use skeleton UI

// Skeleton UI for topic page
const TopicSkeleton = () => (
    <div className="container py-8 animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-neutral-700 rounded w-1/3 mb-4 mx-auto"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                    <div className="h-40 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                </div>
            ))}
        </div>
    </div>
)

async function getTopics(context: { params: { slug: any } }, pageParam = 0) {
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
            news!inner(
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
        .range(pageParam * 48, (pageParam + 1) * 48 - 1, {
            referencedTable: 'news',
        })
        .single()

    const catData: TopicType = data as unknown as TopicType

    return catData
}

const PageTopic = async (context: any) => {
    const [catData, setCatData] = useState<TopicType>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getData() {
            // Measure total time taken for getTopics from the component perspective
            const startTime = performance.now()
            const data = await getTopics(context)
            const endTime = performance.now()
            console.log(
                'Total getTopics call time from PageTopic:',
                Math.round(endTime - startTime),
                'ms'
            )
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
                    <Loading />
                ) : (
                    <>
                        {catData.image ? (
                            <div className="relative aspect-w-16 aspect-h-13 sm:aspect-h-9 lg:aspect-h-8 xl:aspect-h-5 rounded-3xl md:rounded-[40px] overflow-hidden z-0">
                                <Img
                                    alt="Topic header image"
                                    fill
                                    priority
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
                    <TopicSkeleton />
                ) : catData && catData.news && catData.news.length > 0 ? (
                    <NewsSection
                        id={catData.id}
                        news={catData.news}
                        type="topics"
                        newsFn={(page: number) => getTopics(context, page)}
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
