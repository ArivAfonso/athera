'use client'

import React, { Suspense, useEffect, useState } from 'react'
import TopicBadgeList from '@/components/TopicBadgeList/TopicBadgeList'
import { Avatar, Img } from 'ui'
import NewsCardLikeAndComment from '@/components/NewsCardLikeAndComment/NewsCardLikeAndComment'
import PostBookmark from '@/components/PostBookmark/PostBookmark'
import NewsType from '@/types/NewsType'
import { SquareArrowOutUpRightIcon } from 'lucide-react'
import WidgetSocialsFollow from '@/components/WidgetSocialsFollow/WidgetSocialsFollow'
import CardTopic1 from '@/components/CardTopic1/CardTopic1'
import Heading2 from '@/components/Heading2/Heading2'

import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const LazyNewsCommentSection = React.lazy(
    () => import('@/components/NewsCommentSection/NewsCommentSection')
)
const LazyRelatedNews = React.lazy(
    () => import('@/components/NewsDetailModal/RelatedNews')
)

const NewsCommentSectionSkeleton = () => (
    <div className="animate-pulse">
        {/* Comment form skeleton */}
        <div className="flex items-start space-x-4 mb-8">
            <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="flex-1">
                <div className="h-24 rounded-xl bg-neutral-200 dark:bg-neutral-700"></div>
                <div className="mt-2 flex justify-end">
                    <div className="h-9 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                </div>
            </div>
        </div>

        {/* Comments list skeleton */}
        {[...Array(3)].map((_, index) => (
            <div
                key={index}
                className="flex items-start space-x-4 mb-5 pb-5 border-b border-neutral-200 dark:border-neutral-700"
            >
                <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                <div className="flex-1">
                    <div className="h-4 w-32 mb-2 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                    <div className="h-3 w-24 mb-3 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                    <div className="space-y-2">
                        <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                        <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-700 w-5/6"></div>
                    </div>
                    <div className="flex space-x-3 mt-3">
                        <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                        <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
)

const RelatedNewsSkeleton = () => (
    <div className="animate-pulse container pb-10">
        <div className="px-3">
            <div className="h-8 w-40 rounded bg-neutral-200 dark:bg-neutral-700 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="rounded-3xl overflow-hidden">
                        <div className="aspect-w-3 aspect-h-3 bg-neutral-200 dark:bg-neutral-700"></div>
                        <div className="p-4">
                            <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700 mb-3"></div>
                            <div className="h-5 rounded bg-neutral-200 dark:bg-neutral-700 mb-2"></div>
                            <div className="h-5 rounded bg-neutral-200 dark:bg-neutral-700 w-3/4 mb-3"></div>
                            <div className="flex items-center space-x-2">
                                <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                                <div className="h-3 w-3 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                                <div className="h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

// Server component to fetch news data
async function getNewsData(id: string) {
    const supabase = createClient()
    console.log(`Fetching news with ID: ${id}`)

    // Fetch news by slug or ID
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
                image,
                description
            ),
            likeCount:likes(count),
            commentCount:comments(count),
            news_topics(topic:topics(id,name,color))
        `
        )
        .eq('id', id)
        .single()

    if (error || !data) {
        console.log(error)
        return null
    }

    return data as unknown as NewsType
}

export default function NewsPage({ params }: { params: { slug: string[] } }) {
    const id = params.slug[1]
    // ... rest of your code

    const [news, setNews] = useState<NewsType>()

    // Fetch news data
    useEffect(() => {
        async function getData() {
            const newsData = await getNewsData(id)
            setNews(newsData as unknown as NewsType)
        }
        getData()
    }, [id])

    return news ? (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto bg-white dark:bg-neutral-900 rounded-b-3xl">
                {/* Content area */}
                <div className="flex flex-col md:flex-row">
                    <div className="p-6 md:p-8 pt-36 flex-1">
                        {/* Topics */}
                        <div className="mb-4">
                            <TopicBadgeList
                                topics={news?.news_topics || []}
                                className="flex flex-wrap gap-2"
                                itemClass="text-sm"
                            />
                        </div>

                        <h1
                            className={`text-neutral-900 font-semibold text-3xl md:text-4xl md:!leading-[120%] lg:text-5xl dark:text-neutral-100 max-w-4xl`}
                            title={news?.title}
                        >
                            {news?.title}
                        </h1>

                        {/* Mobile source info */}
                        <div className="flex items-center space-x-3 mt-6 mb-4 md:hidden">
                            <Avatar
                                radius="rounded-full"
                                sizeClass="h-10 w-10"
                                imgUrl={
                                    news?.source
                                        ? news?.source.image
                                        : undefined
                                }
                                userName={news?.source ? news?.source.name : ''}
                            />
                            <div className="flex flex-col">
                                <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                                    {news?.source
                                        ? news?.source.name
                                        : 'Unknown Source'}
                                </span>
                                <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                                    <span>
                                        {new Date(
                                            news?.created_at || ''
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                    {news?.author && (
                                        <>
                                            <span className="mx-2">•</span>
                                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                                {news?.author.split(' ')
                                                    .length > 1
                                                    ? `${news?.author.split(' ')[0]} ${news?.author.split(' ').slice(-1)}`
                                                    : news?.author}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed md:line-clamp-none">
                                {news?.summary}
                            </p>
                            <Img
                                alt="single"
                                containerClassName="container mt-8 mb-2 flex justify-center items-center mx-auto"
                                className="rounded-xl"
                                src={news?.image}
                                width={800}
                                height={480}
                            />
                        </div>

                        {/* Action bar */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                            <NewsCardLikeAndComment
                                likes={news?.likeCount?.[0]?.count || 0}
                                comments={news?.commentCount?.[0]?.count || 0}
                                id={news?.id}
                                className="text-sm"
                            />
                            <PostBookmark postId={news?.id} />
                        </div>

                        {/* News Comment Section */}
                        <div className="mt-8">
                            <Suspense fallback={<NewsCommentSectionSkeleton />}>
                                <LazyNewsCommentSection
                                    newsId={news?.id}
                                    currentUserID=""
                                />
                            </Suspense>
                        </div>
                    </div>

                    <div className="md:flex flex-col gap-y-4 hidden m-6">
                        {/* Desktop source info */}
                        <div className="hidden md:block w-72 p-4 rounded-3xl border border-neutral-100 dark:border-neutral-700">
                            <div className="flex items-center w-full">
                                <Avatar
                                    imgUrl={
                                        news?.source
                                            ? news?.source.image
                                            : undefined
                                    }
                                    userName={
                                        news?.source
                                            ? news?.source.name
                                            : 'Unknown Source'
                                    }
                                    sizeClass="h-12 w-12 text-lg"
                                    radius="rounded-full"
                                />
                                <div className="ml-4 text-left">
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                                        {news?.source
                                            ? news?.source.name
                                            : 'Unknown Source'}
                                    </h2>
                                    <span className="text-sm text-neutral-500 dark:text-neutral-300">
                                        Published on{' '}
                                        {new Date(
                                            news?.created_at || ''
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>

                            {news?.author && (
                                <div className="mt-4 text-left w-full">
                                    <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        Author
                                    </span>
                                    <span className="block text-sm text-neutral-900 dark:text-neutral-100">
                                        {news?.author}
                                    </span>
                                </div>
                            )}

                            {news?.source && news?.source.description && (
                                <div className="mt-4 text-left w-full">
                                    <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        About the source
                                    </span>
                                    <span className="block text-sm text-neutral-500 dark:text-neutral-400 line-clamp-4">
                                        {news?.source.description}
                                    </span>
                                </div>
                            )}

                            <div className="mt-4">
                                <a
                                    href={news?.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-2 px-4 text-sm text-center bg-primary-6000 hover:bg-primary-700 text-neutral-50 rounded-full font-medium transition-colors"
                                >
                                    Visit original article
                                </a>
                            </div>
                        </div>
                        <div className="w-72">
                            <WidgetSocialsFollow news={news} />
                        </div>
                        {news?.commentCount[0].count > 4 && (
                            <div className="WidgetCategories rounded-3xl overflow-hidden border border-neutral-100 dark:border-neutral-700">
                                <Heading2 title="🧬 News Topics" />
                                <div className="flow-root">
                                    <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
                                        {news?.news_topics.map((category) => (
                                            <CardTopic1
                                                className="p-4 xl:p-5 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                                key={category.topic.id}
                                                topic={category.topic}
                                                size="normal"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Similar widgets for related news will be populated client-side */}
                    </div>
                </div>
                {/* Related posts */}
                <Suspense fallback={<RelatedNewsSkeleton />}>
                    <LazyRelatedNews id={news?.id} authorId={news?.author} />
                </Suspense>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse space-y-4">
                <div className="h-8 w-1/2 bg-neutral-200 rounded"></div>
                <div className="h-6 w-full bg-neutral-200 rounded"></div>
                <div className="h-6 w-full bg-neutral-200 rounded"></div>
            </div>
        </div>
    )
}
