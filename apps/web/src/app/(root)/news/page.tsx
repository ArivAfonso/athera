'use client'

import React, { useEffect, useState } from 'react'
import NewsCard from '@/components/NewsCard/NewsCard'
import { createClient } from '@/utils/supabase/client'
import CircleLoading from '@/components/CircleLoading/CircleLoading'
import Empty from '@/components/Empty'
import { Heading2 } from 'ui'
import NewsType from '@/types/NewsType'

// Define the necessary type (or import NewsType if available)

async function fetchNews(pageParam: number) {
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
        .order('created_at', { ascending: false })
        .range(pageParam * 48, (pageParam + 1) * 48 - 1)
    console.log(data, error)
    return data as unknown as NewsType[]
}

const NewsPage = () => {
    const [newsList, setNewsList] = useState<NewsType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getNews() {
            const fetchedNews = await fetchNews(0)
            setNewsList(fetchedNews)
            setLoading(false)
        }
        getNews()
    }, [])

    return (
        <div className="NewsPage">
            <div className="w-full px-2 pt-2 xl:max-w-screen-2xl mx-auto">
                <Heading2 className="mb-4">Latest News</Heading2>
            </div>
            <div className="container pb-16 lg:pb-28 lg:pt-10">
                {loading ? (
                    <CircleLoading />
                ) : newsList && newsList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {newsList.map((news, key) => (
                            <NewsCard
                                key={key}
                                news={news}
                                onHideNews={() => {
                                    // ...existing code or empty handler...
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <Empty
                        mainText="No news found"
                        subText="There is no news to display at the moment."
                    />
                )}
            </div>
        </div>
    )
}

export default NewsPage
