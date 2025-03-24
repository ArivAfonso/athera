'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import NewsType from '@/types/NewsType'
import NewsCard from '@/components/NewsCard/NewsCard'
import NewsCardWide from '@/components/NewsCardWide/NewsCardWide'
import NewsCardLong from '@/components/NewsCardLong/NewsCardLong'
import NewsCardBig from '@/components/NewsCardBig/NewsCardBig'
import SectionMagazine1 from '@/components/Sections/SectionMagazine1'
import { Tab } from '@headlessui/react'
import Empty from '@/components/Empty'
import CircleLoading from '@/components/CircleLoading/CircleLoading'
import {
    BookmarkIcon,
    FlameIcon,
    LightbulbIcon,
    TrendingUpIcon,
    RssIcon,
} from 'lucide-react'
import TopicType from '@/types/TopicType'
import CardTopic1 from '@/components/CardTopic1/CardTopic1'
import CardTopic2 from '@/components/CardTopic2/CardTopic2'
import CardTopic6 from '@/components/CardTopic6/CardTopic6'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const ForYouFeed = () => {
    const [featuredNews, setFeaturedNews] = useState<NewsType[]>([])
    const [trendingNews, setTrendingNews] = useState<NewsType[]>([])
    const [recommendedNews, setRecommendedNews] = useState<NewsType[]>([])
    const [recentNews, setRecentNews] = useState<NewsType[]>([])
    const [topics, setTopics] = useState<TopicType[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTab, setSelectedTab] = useState(0)
    const supabase = createClient()

    useEffect(() => {
        const fetchRecommendedNews = async () => {
            try {
                // Featured/For You
                const { data: featured } = await supabase
                    .from('news')
                    .select(
                        `
                        id, title, created_at, description, author, link, summary, image,
                        source(*), news_topics(topic:topics(*)),
                        likeCount:likes(count), commentCount:comments(count), likes(liker(id))
                    `
                    )
                    .order('likeCount', { ascending: false })
                    .limit(9)

                // Trending
                const { data: trending } = await supabase
                    .from('news')
                    .select(
                        `
                        id, title, created_at, description, author, link, summary, image,
                        source(*), news_topics(topic:topics(*)),
                        likeCount:likes(count), commentCount:comments(count), likes(liker(id))
                    `
                    )
                    .limit(12)

                // Recommended
                const { data: recommended } = await supabase
                    .from('news')
                    .select(
                        `
                        id, title, created_at, description, author, link, summary, image,
                        source(*), news_topics(topic:topics(*)),
                        likeCount:likes(count), commentCount:comments(count), likes(liker(id))
                    `
                    )
                    .order('created_at', { ascending: false })
                    .limit(12)

                // Recent/Discover
                const { data: recent } = await supabase
                    .from('news')
                    .select(
                        `
                        id, title, created_at, description, author, link, summary, image,
                        source(*), news_topics(topic:topics(*)),
                        likeCount:likes(count), commentCount:comments(count), likes(liker(id))
                    `
                    )
                    .order('created_at', { ascending: false })
                    .range(6, 20)

                const { data: topics } = await supabase
                    .from('topics')
                    .select(
                        `
                        id,
                        name,
                        color,
                        image,
                        newsCount:news(count)
                    `
                    )
                    .ilike('image', '%https://%')
                    .limit(20)

                console.log(topics)

                setTopics((topics as unknown as TopicType[]) || [])
                setFeaturedNews((featured as unknown as NewsType[]) || [])
                setTrendingNews((trending as unknown as NewsType[]) || [])
                setRecommendedNews((recommended as unknown as NewsType[]) || [])
                setRecentNews((recent as unknown as NewsType[]) || [])
                setLoading(false)
            } catch (error) {
                console.error('Error fetching news:', error)
                setLoading(false)
            }
        }

        fetchRecommendedNews()
    }, [supabase])

    // Handle hiding news items
    const handleHideNews = (newsId: string) => {
        setFeaturedNews((prev) => prev.filter((item) => item.id !== newsId))
        setTrendingNews((prev) => prev.filter((item) => item.id !== newsId))
        setRecommendedNews((prev) => prev.filter((item) => item.id !== newsId))
        setRecentNews((prev) => prev.filter((item) => item.id !== newsId))
    }

    if (loading) return <CircleLoading />

    if (
        !featuredNews.length &&
        !trendingNews.length &&
        !recommendedNews.length &&
        !recentNews.length
    ) {
        return (
            <Empty
                mainText="No recommendations yet"
                subText="We're still learning about your interests. Browse some news to help us provide better recommendations!"
                className="h-screen flex items-center justify-center"
            />
        )
    }

    const tabCategories = [
        { name: 'For You', icon: <LightbulbIcon className="w-5 h-5" /> },
        { name: 'Trending', icon: <TrendingUpIcon className="w-5 h-5" /> },
        { name: 'Discover', icon: <RssIcon className="w-5 h-5" /> },
    ]

    return (
        <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                        Your Feed
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Stay up to date with the latest news tailored for you
                    </p>
                </header>

                <Tab.Group
                    selectedIndex={selectedTab}
                    onChange={setSelectedTab}
                >
                    <Tab.List className="flex bg-white dark:bg-neutral-800 rounded-xl p-1 max-w-md mx-auto mb-12 shadow-sm">
                        {tabCategories.map((category) => (
                            <Tab
                                key={category.name}
                                className={({ selected }) =>
                                    classNames(
                                        'w-full py-3 px-4 text-sm font-medium rounded-lg',
                                        'flex items-center justify-center gap-2',
                                        selected
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
                                    )
                                }
                            >
                                {category.icon}
                                {category.name}
                            </Tab>
                        ))}
                    </Tab.List>

                    <Tab.Panels>
                        {/* FOR YOU TAB */}
                        <Tab.Panel>
                            <div className="space-y-12">
                                {/* Featured Section */}
                                <section>
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
                                        Featured
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {featuredNews
                                            .slice(0, 3)
                                            .map((news) => (
                                                <div key={news.id}>
                                                    <NewsCard
                                                        news={news}
                                                        onHideNews={
                                                            handleHideNews
                                                        }
                                                        className="h-full"
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </section>

                                {/* Recommended Section */}
                                <section>
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2 mb-6">
                                        <BookmarkIcon className="w-5 h-5 text-blue-500" />
                                        Recommended For You
                                    </h2>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {recommendedNews
                                            .slice(0, 6)
                                            .map((news) => (
                                                <div key={news.id}>
                                                    <NewsCardWide
                                                        news={news}
                                                        onHideNews={
                                                            handleHideNews
                                                        }
                                                        className="h-full"
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </section>
                            </div>
                        </Tab.Panel>

                        {/* TRENDING TAB */}
                        <Tab.Panel>
                            <div className="space-y-12">
                                {/* Hot Right Now */}
                                <section>
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2 mb-6">
                                        <FlameIcon className="w-5 h-5 text-red-500" />
                                        Hot Right Now
                                    </h2>
                                    <SectionMagazine1
                                        news={trendingNews.slice(0, 5)}
                                        heading=""
                                        className="mb-6"
                                    />
                                </section>

                                {/* Featured Topic Row */}
                                <section className="py-4">
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
                                        <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                                            Trending Topics
                                        </span>
                                    </h2>
                                    <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                                        {topics.slice(0, 6).map((topic) => (
                                            <div
                                                key={topic.id}
                                                className="flex-shrink-0 w-48"
                                            >
                                                <div className="bg-gradient-to-br from-neutral-50 to-blue-50 dark:from-neutral-800 dark:to-blue-900/20 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                                    <CardTopic1 topic={topic} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Continuous News Flow - First Section */}
                                <section>
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
                                        Popular Stories
                                    </h2>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {trendingNews
                                            .slice(5, 9)
                                            .map((news) => (
                                                <div key={news.id}>
                                                    <NewsCardWide
                                                        news={news}
                                                        onHideNews={
                                                            handleHideNews
                                                        }
                                                        className="h-full"
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </section>

                                {/* Continuous News Flow - Featured Item */}
                                <section>
                                    {trendingNews[9] && (
                                        <NewsCardBig
                                            news={trendingNews[9]}
                                            // onHideNews={handleHideNews}
                                            className="w-full"
                                        />
                                    )}
                                </section>

                                {/* Continuous News Flow - Second Section */}
                                <section>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {trendingNews
                                            .slice(10, 13)
                                            .map((news) => (
                                                <div key={news.id}>
                                                    <NewsCard
                                                        news={news}
                                                        onHideNews={
                                                            handleHideNews
                                                        }
                                                        className="h-full"
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </section>
                            </div>
                        </Tab.Panel>

                        {/* DISCOVER TAB */}
                        <Tab.Panel>
                            <div className="space-y-12">
                                {/* Fresh Perspectives */}
                                <section>
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
                                        Fresh Perspectives
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {recentNews.slice(0, 3).map((news) => (
                                            <div key={news.id}>
                                                <NewsCard
                                                    news={news}
                                                    onHideNews={handleHideNews}
                                                    className="h-full"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Explore More */}
                                <section>
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
                                        Explore More
                                    </h2>
                                    <div className="space-y-6">
                                        {recentNews.slice(3, 9).map((news) => (
                                            <div key={news.id}>
                                                <NewsCardWide
                                                    news={news}
                                                    onHideNews={handleHideNews}
                                                    className="h-full"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    )
}

export default ForYouFeed
