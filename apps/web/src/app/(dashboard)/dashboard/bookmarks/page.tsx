'use client'

import Empty from '@/components/Empty'
import NewsSection from '@/components/NewsSection/NewsSection'
import NewsType from '@/types/NewsType'
import { createClient } from '@/utils/supabase/client'
import React, { useEffect, useState } from 'react'
import Loading from './loading'
import toast from 'react-hot-toast'
import { Alert } from 'ui'

const DashboardBookmarks = () => {
    const supabase = createClient()
    const [myNews, setMyNews] = useState<NewsType[]>([])
    const [loading, setLoading] = useState(true)

    async function addNews(pageParam: number) {
        const { data: session } = await supabase.auth.getUser()
        if (!session.user) {
            toast.custom((t) => (
                <Alert
                    type="danger"
                    message="You need to be logged in to view this page"
                />
            ))
            return
        }

        const { data, error } = await supabase
            .from('bookmarks')
            .select(
                `
                news (
                    title,
                    id,
                    created_at,
                    estimatedReadingTime,
                    description,
                    image,
                    source(
                        id,
                        name,
                        description,
                        url,
                        image
                    ),
                    news_topics(topic:topics(id,name,color)),
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
            .eq('user', session.user?.id)
            .limit(24, { referencedTable: 'news' })
            .order('created_at', { referencedTable: 'news', ascending: false })
            .range(pageParam * 48, (pageParam + 1) * 48 - 1)

        const newItems = (data as unknown as { news: NewsType }[]).map(
            (item) => item.news
        )

        return newItems
    }

    async function getNews() {
        const { data: session } = await supabase.auth.getUser()
        if (!session.user) {
            toast.custom((t) => (
                <Alert
                    type="danger"
                    message="You need to be logged in to view this page"
                />
            ))
            return
        }

        const { data, error } = await supabase
            .from('bookmarks')
            .select(
                `
                news (
                    title,
                    id,
                    created_at,
                    estimatedReadingTime,
                    description,
                    image,
                    source(
                        id,
                        name,
                        description,
                        url,
                        image
                    ),
                    news_topics(topic:topics(id,name,color)),
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
            .eq('user', session.user?.id)
            .order('created_at', { referencedTable: 'news', ascending: false })

        const fetchedNews = (data as unknown as { news: NewsType }[]).map(
            (item) => item.news
        )

        return fetchedNews
    }

    useEffect(() => {
        async function fetchData() {
            const news = await getNews()
            setMyNews(news || [])
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <>
            <title>My Bookmarks - Athera</title>
            <div className="PageBookmarks">
                <div className="container max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32 space-y-10 sm:space-y-12">
                    {/* HEADING */}
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                        Bookmarks
                    </h2>
                    <div>
                        {loading && <Loading />}
                        {myNews[0] ? (
                            <NewsSection
                                news={myNews}
                                rows={3}
                                id="bookmarks"
                                newsFn={addNews}
                                onHideNews={(newsId: string) => {}}
                            />
                        ) : (
                            <Empty
                                mainText="No News Found"
                                subText="You have not bookmarked any news yet."
                                className="text-center p-4"
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardBookmarks
