'use client'

import Empty from '@/components/Empty'
import NewsSection from '@/components/NewsSection/NewsSection'
import NewsType from '@/types/NewsType'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'

const DashboardWatchHistory = () => {
    const supabase = createClient()

    const [myNews, setMyNews] = React.useState<NewsType[]>([])
    const router = useRouter()

    async function getNews() {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getUser()

        if (!session.user) {
            router.push('/login')
        }
        const { data, error } = await supabase
            .from('watch_history')
            .select(
                `
                news (
                    title,
                    id,
                    created_at,
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
            .eq('user_id', session.user ? session.user.id : '')
            .order('created_at', { ascending: false })
            .limit(24)

        return (data as unknown as { news: NewsType }[]).map(
            (item) => item.news
        )
    }

    useEffect(() => {
        async function fetchData() {
            const news = await getNews()
            setMyNews(news)
        }
        fetchData()
    }, [])

    async function addNews(pageParam: number) {
        const { data: session } = await supabase.auth.getUser()

        if (!session.user) {
            router.push('/login')
        }
        const { data: newData, error } = await supabase
            .from('watch_history')
            .select(
                `
                news (
                    title,
                    id,
                    created_at,
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
            .eq('user_id', session.user ? session.user.id : '')
            .order('created_at', { ascending: false })
            .range(pageParam * 48, (pageParam + 1) * 48 - 1)

        const newNews = (newData as unknown as { news: NewsType }[]).map(
            (item) => item.news
        )

        return newNews
    }

    return (
        <>
            <title>Watch History - Athera</title>
            <div className={`PageHistory`}>
                <div className="container max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32 space-y-10 sm:space-y-12">
                    {/* HEADING */}
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                        News History
                    </h2>
                    <div>
                        {/* LOOP ITEMS */}
                        {myNews[0] ? (
                            <NewsSection
                                news={myNews}
                                id="watch-history"
                                newsFn={addNews}
                                onHideNews={(newsId: string) => {}}
                            />
                        ) : (
                            <Empty
                                mainText="No News Found"
                                subText="You haven't watched any news yet."
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardWatchHistory
