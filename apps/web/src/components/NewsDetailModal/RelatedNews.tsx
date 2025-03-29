'use client'

import React, { FC, useEffect, useState } from 'react'
import { Heading } from 'ui'
import Card11 from '@/components/Card11/Card11'
import NewsType from '@/types/NewsType'
import Card9 from '@/components/Card9/Card9'
import { createClient } from '@/utils/supabase/client'
import MySlider from '@/components/MySlider'
import NewsCardLong from '@/components/NewsCardLong/NewsCardLong'
import NewsDetailModal from './NewsDetailModal'

export interface RelatedNewsType {
    latestNewsInTopic: NewsType[]
}

async function getAuthorNews(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('news')
        .select(
            `id,
            title,
            created_at,
            description,
            image,
            summary,
            link,
            likeCount:likes(count),
            commentCount:comments(count),
            news_topics(topic:topics(id,name,color)),
            author,
            source(
                id,
                name,
                url,
                image
            )`
        )
        .eq('author', id)
        .limit(20)

    if (error) {
        console.error('Error fetching author news:', error)
        return []
    }

    return data
}

async function getRelatedNews(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase.rpc('related_news', {
        news_id: id,
        match_threshold: 0.8,
        match_count: 10,
    })

    if (error) {
        console.error('Error fetching related news:', error)
        return []
    }

    data?.map((news: any) => {
        news.likeCount = news.likecount
        news.commentCount = news.commentcount
    })
    return data
}

export interface SingleRelatedNewsProps {
    id: string
    authorId: string
}

const SingleRelatedNews: FC<SingleRelatedNewsProps> = ({ id, authorId }) => {
    const [authorNews, setAuthorNews] = useState<NewsType[]>([])
    const [relatedNews, setRelatedNews] = useState<NewsType[]>([])
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedNews, setSelectedNews] = useState<NewsType | null>(null)

    const handleHideRelatedNews = async (newsId: string) => {
        //Update localStorage
        const hiddenNewsItem = localStorage.getItem('hiddenNews')
        const hiddenNews = hiddenNewsItem ? JSON.parse(hiddenNewsItem) : []

        localStorage.setItem(
            'hiddenNews',
            JSON.stringify([...hiddenNews, newsId])
        )

        //Remove the news from the UI
        setRelatedNews(relatedNews?.filter((news) => news.id !== newsId))
    }

    const handleHideAuthorNews = async (newsId: string) => {
        //Update localStorage
        const hiddenNewsItem = localStorage.getItem('hiddenNews')
        const hiddenNews = hiddenNewsItem ? JSON.parse(hiddenNewsItem) : []

        localStorage.setItem(
            'hiddenNews',
            JSON.stringify([...hiddenNews, newsId])
        )

        //Remove the news from the UI
        setAuthorNews(authorNews?.filter((news) => news.id !== newsId))
    }

    const handleOpenNewsDetail = (news: NewsType) => {
        setSelectedNews(news)
        setShowDetailModal(true)
    }

    useEffect(() => {
        const getData = async () => {
            const data = await getAuthorNews(authorId)
            setAuthorNews(data as unknown as NewsType[])
        }

        getData()
    }, [])

    useEffect(() => {
        const getData = async () => {
            const data = await getRelatedNews(id)
            setRelatedNews(data as unknown as NewsType[])
        }

        getData()
    }, [])

    return (
        <div className="relative pb-16">
            {/* RELATED NEWS */}
            <div className="container">
                {relatedNews.length >= 3 && (
                    <div className="px-3">
                        <div className="text-lg font-semibold pb-6">
                            Related News
                        </div>
                        <MySlider
                            data={relatedNews}
                            renderItem={(item, indx) => (
                                <NewsCardLong
                                    key={indx}
                                    news={item}
                                    onHideNews={handleHideRelatedNews}
                                    openNewsDetail={handleOpenNewsDetail}
                                />
                            )}
                            itemPerRow={4}
                        />
                    </div>
                )}

                {/* MORE FROM AUTHOR */}
                {authorNews.length >= 4 && (
                    <div className="mt-10 px-3">
                        <div className="text-lg font-semibold pb-6">
                            More From Author
                        </div>
                        <MySlider
                            data={authorNews}
                            renderItem={(item, indx) => (
                                <NewsCardLong
                                    key={indx}
                                    news={item}
                                    onHideNews={handleHideAuthorNews}
                                    openNewsDetail={handleOpenNewsDetail}
                                />
                            )}
                            itemPerRow={4}
                        />
                    </div>
                )}
            </div>

            {/* News Detail Modal */}
            {showDetailModal && selectedNews && (
                <NewsDetailModal
                    show={showDetailModal}
                    news={selectedNews}
                    onClose={() => setShowDetailModal(false)}
                />
            )}
        </div>
    )
}

export default SingleRelatedNews
