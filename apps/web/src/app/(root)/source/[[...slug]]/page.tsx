'use client'

import React, { useState, useEffect } from 'react'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import SourceType from '@/types/SourceType'
import NewsType from '@/types/NewsType'
import { createClient } from '@/utils/supabase/client'
import { Img, Heading2 } from 'ui'
import Loading from './loading'
import NewsCard from '@/components/NewsCard/NewsCard'
import Empty from '@/components/Empty'
import NewsSection from '@/components/NewsSection/NewsSection'

// Removed CircleLoading import to use skeleton UI

// Skeleton UI for source page
const SourceSkeleton = () => (
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

async function getSourceData(context: { params: { slug: any } }) {
    const supabase = createClient()
    const source_name = context.params.slug[0]
    const { data, error } = await supabase
        .from('sources')
        .select(
            `
            id,
            name,
            image,
            description,
            background,
            url
            `
        )
        .eq('id', source_name)
        .single()
    return data as SourceType
}

async function fetchSourceNews(sourceId: string, pageParam: number) {
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
                description,
                url,
                image
            ),
            likeCount:likes(count),
            commentCount:comments(count),
            news_topics(topic:topics(id,name,color))
            `
        )
        .eq('source', sourceId)
        .order('created_at', { ascending: false })
        .range(pageParam * 48, (pageParam + 1) * 48 - 1)

    console.log(error)

    // Reject all news without a source
    const filteredData = data?.filter(
        // @ts-ignore
        (news: NewsType) => news.source !== null && news.source !== undefined
    )

    console.log('filteredData:', filteredData)
    return filteredData as unknown as NewsType[]
}

const PageSource = (context: any) => {
    const [data, setData] = useState<SourceType>({} as SourceType)
    const [loadingSource, setLoadingSource] = useState(true)
    const [sourceNews, setSourceNews] = useState<NewsType[]>([])
    const [loadingNews, setLoadingNews] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const source: SourceType = await getSourceData(context)
            if (source) {
                setData(source)
                setLoadingSource(false)
            }
        }
        fetchData()
    }, [context])

    useEffect(() => {
        async function getNews() {
            if (data && data.id) {
                const fetchedNews = await fetchSourceNews(data.id, 0)
                setSourceNews(fetchedNews)
                setLoadingNews(false)
            }
        }
        getNews()
    }, [data])

    useEffect(() => {
        if (data?.name) {
            document.title = `${data.name} - Athera`
        }
    }, [data])

    return (
        <>
            {loadingSource ? (
                <Loading />
            ) : (
                <>
                    <div className="PageSource">
                        {/* HEADER SECTION */}
                        <div className="relative w-full">
                            {data.background && (
                                <div className="absolute inset-0 h-52 md:h-64 2xl:h-72 w-full">
                                    <Img
                                        alt=""
                                        containerClassName="w-full h-full"
                                        sizes="(max-width: 1280px) 100vw, 1536px"
                                        src={data.background || ''}
                                        className="object-cover w-full h-full"
                                        fill
                                        priority
                                    />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 h-52 md:h-64 2xl:h-72"></div>
                            <div className="container relative pt-28 2xl:pt-44 pb-10">
                                <div className="relative bg-white dark:bg-neutral-900 p-5 lg:p-8 rounded-3xl md:rounded-[40px] shadow-xl flex flex-col md:flex-row">
                                    <div className="absolute -top-16 left-0 right-0 mx-auto md:mx-0 md:static md:left-auto flex items-center justify-center md:justify-start md:block w-32 lg:w-40 flex-shrink-0">
                                        <div className="relative flex-shrink-0 inline-flex items-center justify-center overflow-hidden text-neutral-100 uppercase font-semibold rounded-full w-20 h-20 text-xl lg:text-2xl lg:w-36 lg:h-36 ring-4 ring-white dark:ring-neutral-800 shadow-2xl z-0">
                                            <Img
                                                alt="Avatar"
                                                src={data.image}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-5 md:pt-1 md:ml-6 xl:ml-12 flex-grow text-center md:text-left">
                                        <div className="max-w-screen-sm space-y-3.5">
                                            <h2 className="inline-flex items-center justify-center md:justify-start text-2xl sm:text-3xl lg:text-4xl font-semibold">
                                                <span>{data.name}</span>
                                            </h2>
                                            <span className="block text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                                {data.description}
                                            </span>
                                            {data.url && (
                                                <a
                                                    href={data.url}
                                                    className="flex items-center justify-center md:justify-start text-xs font-medium space-x-2.5 cursor-pointer text-neutral-500 dark:text-neutral-400 truncate"
                                                >
                                                    <GlobeAltIcon className="flex-shrink-0 w-4 h-4" />
                                                    <span className="text-neutral-700 dark:text-neutral-300 truncate">
                                                        {data.url}
                                                    </span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* END HEADER SECTION */}

                        {/* NEWS POSTS FROM THIS SOURCE */}
                        <div className="container pb-16 lg:pb-28 lg:pt-10">
                            {loadingNews ? (
                                <SourceSkeleton />
                            ) : sourceNews && sourceNews.length > 0 ? (
                                <NewsSection
                                    id={data.id}
                                    news={sourceNews}
                                    newsFn={(page: number) =>
                                        fetchSourceNews(data.id, page)
                                    }
                                    onHideNews={(newsId: string) => {
                                        // Implement as needed, for example:
                                        setSourceNews((prev) =>
                                            prev.filter(
                                                (item) => item.id !== newsId
                                            )
                                        )
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
                </>
            )}
        </>
    )
}

export default PageSource
