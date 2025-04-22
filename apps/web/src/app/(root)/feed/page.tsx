'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import NewsType from '@/types/NewsType'
import NewsCard from '@/components/NewsCard/NewsCard'
import NewsCardWide from '@/components/NewsCardWide/NewsCardWide'
import NewsCardLong from '@/components/NewsCardLong/NewsCardLong'
import NewsCardBig from '@/components/NewsCardBig/NewsCardBig'
import SectionMagazine1 from '@/components/Sections/SectionMagazine1'
import { Tab } from '@headlessui/react'
import Empty from '@/components/Empty'
import {
    BookmarkIcon,
    FlameIcon,
    LightbulbIcon,
    TrendingUpIcon,
    RssIcon,
} from 'lucide-react'
import TopicType from '@/types/TopicType'
import CardTopic1 from '@/components/CardTopic1/CardTopic1'
import { getUserCountry } from '@/utils/getUserCountry'
import HeaderFilter from '@/components/Sections/HeaderFilter'
import NewsSection from '@/components/NewsSection/NewsSection'
import SectionSliderNewTopics from '@/components/SectionSliderNewTopics/SectionSliderNewTopics'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

// Skeleton UI for loading state
const FeedSkeleton = () => (
    <div className="px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="h-8 bg-gray-300 dark:bg-neutral-700 rounded w-1/3 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded w-1/4 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                    <div className="h-40 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded w-4/6"></div>
                </div>
            ))}
        </div>
    </div>
)

const ForYouFeed = () => {
    const [featuredNews, setFeaturedNews] = useState<NewsType[]>([])
    const [trendingNews, setTrendingNews] = useState<NewsType[]>([])
    const [recommendedNews, setRecommendedNews] = useState<NewsType[]>([])
    const [recentNews, setRecentNews] = useState<NewsType[]>([])
    const [topics, setTopics] = useState<TopicType[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTab, setSelectedTab] = useState(0)
    const supabase = createClient()

    // Pagination setup for Discover
    const PAGE_SIZE = 48
    const [userCountry, setUserCountry] = useState<string | null>(null)
    const fetchDiscoverNews = useCallback(
        async (page: number) => {
            let q = supabase
                .from('news')
                .select(
                    `
                    id, title, created_at, description, author, link, summary, image,
                    source!inner(*), news_topics(topic:topics(*)),
                    likeCount:likes(count), commentCount:comments(count), likes(liker(id))
                `
                )
                .order('created_at', { ascending: false })
            // apply country filter
            if (userCountry) {
                q = q.or(`country.is.null, country.ilike.%${userCountry}%`, {
                    foreignTable: 'source',
                })
            } else {
                q = q.is('source.country', null)
            }
            const start = 6 + (page - 1) * PAGE_SIZE
            const end = start + PAGE_SIZE - 1
            const { data } = await q.range(start, end)
            const items = (data as unknown as NewsType[]) || []
            return items.filter((n) => n.source)
        },
        [supabase, userCountry]
    )

    // Paginated fetch for 'For You' (recommended)
    const PAGE_SIZE_FORYOU = 48
    const fetchRecommendedPaginated = useCallback(
        async (page: number) => {
            const start = (page - 1) * PAGE_SIZE_FORYOU
            const end = start + PAGE_SIZE_FORYOU - 1
            let q = supabase
                .from('news')
                .select(
                    `id, title, created_at, description, author, link, summary, image,
                source!inner(*), news_topics(topic:topics(*)),
                likeCount:likes(count), commentCount:comments(count), likes(liker(id))`
                )
                .order('created_at', { ascending: false })
                .range(start, end)
            // apply country filter
            if (userCountry) {
                q = q.or(`country.is.null, country.ilike.%${userCountry}%`, {
                    foreignTable: 'source',
                })
            } else {
                q = q.is('source.country', null)
            }
            const { data } = await q
            const items = (data as unknown as NewsType[]) || []
            return items.filter((n) => n.source)
        },
        [supabase, userCountry]
    )

    // Paginated fetch for 'Trending'
    const PAGE_SIZE_TRENDING = 48
    const fetchTrendingPaginated = useCallback(
        async (page: number) => {
            const start = (page - 1) * PAGE_SIZE_TRENDING
            const end = start + PAGE_SIZE_TRENDING - 1
            let q = supabase
                .from('news')
                .select(
                    `id, title, created_at, description, author, link, summary, image,
                source!inner(*), news_topics(topic:topics(*)),
                likeCount:likes(count), commentCount:comments(count), likes(liker(id))`
                )
                .order('created_at', { ascending: false })
                .range(start, end)
            // apply country filter
            if (userCountry) {
                q = q.or(`country.is.null, country.ilike.%${userCountry}%`, {
                    foreignTable: 'source',
                })
            } else {
                q = q.is('source.country', null)
            }
            const { data } = await q
            const items = (data as unknown as NewsType[]) || []
            return items.filter((n) => n.source)
        },
        [supabase, userCountry]
    )

    useEffect(() => {
        const fetchRecommendedNews = async () => {
            const country = await getUserCountry()
            setUserCountry(country)
            try {
                // Featured/For You
                let query = supabase
                    .from('news')
                    .select(
                        `
                        id, 
                        title, 
                        description, 
                        summary, 
                        image, 
                        author, 
                        link, 
                        created_at,
                        source!inner(
                            id,
                            name,
                            image,
                            description,
                            url,
                            country
                        ),
                        likeCount:likes(count),
                        commentCount:comments(count),
                        news_topics(topic:topics(id,name,color))
        `
                    )
                    .order('likeCount', { ascending: false })
                    .limit(9)
                // apply country filter
                if (country) {
                    query = query.or(
                        `country.is.null, country.ilike.%${country}%`,
                        { foreignTable: 'source' }
                    )
                } else {
                    query = query.is('source.country', null)
                }
                const { data: featured, error: newsError } = await query

                // Trending
                let trendingQuery = supabase
                    .from('news')
                    .select(
                        `
                        id, title, created_at, description, author, link, summary, image,
                        source!inner(*), news_topics(topic:topics(*)),
                        likeCount:likes(count), commentCount:comments(count), likes(liker(id))
                    `
                    )
                    .limit(12)
                // apply country filter
                if (country) {
                    trendingQuery = trendingQuery.or(
                        `country.is.null, country.ilike.%${country}%`,
                        { foreignTable: 'source' }
                    )
                } else {
                    trendingQuery = trendingQuery.is('source.country', null)
                }
                const { data: trending } = await trendingQuery

                // Recommended
                let recommendedQuery = supabase
                    .from('news')
                    .select(
                        `
                        id, title, created_at, description, author, link, summary, image,
                        source!inner(*), news_topics(topic:topics(*)),
                        likeCount:likes(count), commentCount:comments(count), likes(liker(id))
                    `
                    )
                    .order('created_at', { ascending: false })
                    .limit(12)
                // apply country filter
                if (country) {
                    recommendedQuery = recommendedQuery.or(
                        `country.is.null, country.ilike.%${country}%`,
                        { foreignTable: 'source' }
                    )
                } else {
                    recommendedQuery = recommendedQuery.is(
                        'source.country',
                        null
                    )
                }
                const { data: recommended } = await recommendedQuery

                // Initial fetch for Discover
                const initialRecent = await fetchDiscoverNews(1)

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

                setTopics((topics as unknown as TopicType[]) || [])
                // filter out items with null or incomplete source
                setFeaturedNews(
                    (featured as unknown as NewsType[])?.filter(
                        (n) => n.source && n.source.id
                    ) || []
                )
                setTrendingNews(
                    (trending as unknown as NewsType[])?.filter(
                        (n) => n.source && n.source.id
                    ) || []
                )
                setRecommendedNews(
                    (recommended as unknown as NewsType[])?.filter(
                        (n) => n.source && n.source.id
                    ) || []
                )
                setRecentNews(
                    (initialRecent as NewsType[])?.filter(
                        (n) => n.source && n.source.id
                    ) || []
                )
                setLoading(false)
            } catch (error) {
                console.error('Error fetching news:', error)
                setLoading(false)
            }
        }

        fetchRecommendedNews()
    }, [supabase, fetchDiscoverNews])

    // Handle hiding news items
    const handleHideNews = (newsId: string) => {
        setFeaturedNews((prev) => prev.filter((item) => item.id !== newsId))
        setTrendingNews((prev) => prev.filter((item) => item.id !== newsId))
        setRecommendedNews((prev) => prev.filter((item) => item.id !== newsId))
        setRecentNews((prev) => prev.filter((item) => item.id !== newsId))
    }

    if (loading) return <FeedSkeleton />

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
                                {/* Magazine-style Discover layout rows for For You */}
                                {recommendedNews.length > 0 &&
                                    [0, 1, 2].map((row) => {
                                        const items = recommendedNews.slice(
                                            row * 4,
                                            row * 4 + 4
                                        )
                                        const bigLeft = row % 2 === 0
                                        return (
                                            <div key={row} className="mb-10">
                                                <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                                    {bigLeft ? (
                                                        <>
                                                            {items[0] && (
                                                                <NewsCardBig
                                                                    size="large"
                                                                    news={
                                                                        items[0]
                                                                    }
                                                                    className="w-full"
                                                                />
                                                            )}
                                                            <div className="grid gap-6 md:gap-8">
                                                                {items
                                                                    .slice(1)
                                                                    .map(
                                                                        (n) => (
                                                                            <NewsCardWide
                                                                                key={
                                                                                    n.id
                                                                                }
                                                                                news={
                                                                                    n
                                                                                }
                                                                                onHideNews={
                                                                                    handleHideNews
                                                                                }
                                                                                className="h-full"
                                                                            />
                                                                        )
                                                                    )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="grid gap-6 md:gap-8">
                                                                {items
                                                                    .slice(0, 3)
                                                                    .map(
                                                                        (n) => (
                                                                            <NewsCardWide
                                                                                key={
                                                                                    n.id
                                                                                }
                                                                                news={
                                                                                    n
                                                                                }
                                                                                onHideNews={
                                                                                    handleHideNews
                                                                                }
                                                                                className="h-full"
                                                                            />
                                                                        )
                                                                    )}
                                                            </div>
                                                            {items[3] && (
                                                                <NewsCardBig
                                                                    size="large"
                                                                    news={
                                                                        items[3]
                                                                    }
                                                                    className="w-full"
                                                                />
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="block sm:hidden">
                                                    {items.map((n) => (
                                                        <NewsCardWide
                                                            key={n.id}
                                                            news={n}
                                                            onHideNews={
                                                                handleHideNews
                                                            }
                                                            className="mb-4 h-full"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                {/* Slider for Topics */}
                                <SectionSliderNewTopics
                                    className="py-8"
                                    heading=""
                                    subHeading=""
                                    topics={topics}
                                    topicCardType="card4"
                                    itemPerRow={5}
                                />
                                {/* Infinite scroll section for For You */}
                                <NewsSection
                                    news={recommendedNews}
                                    id="for-you"
                                    newsFn={fetchRecommendedPaginated}
                                    onHideNews={handleHideNews}
                                />
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

                                    <div className="block sm:hidden">
                                        {trendingNews
                                            .slice(0, 5)
                                            .map((news) => (
                                                <NewsCardWide
                                                    key={news.id}
                                                    news={news}
                                                    onHideNews={handleHideNews}
                                                    className="mb-4"
                                                />
                                            ))}
                                    </div>
                                </section>

                                {/* Magazine-style Discover layout rows for Trending */}
                                {trendingNews.length > 0 &&
                                    [0, 1, 2, 3].map((row) => {
                                        const items = trendingNews.slice(
                                            row * 4,
                                            row * 4 + 4
                                        )
                                        const bigLeft = row % 2 === 0
                                        return (
                                            <div key={row} className="mb-10">
                                                <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                                    {bigLeft ? (
                                                        <>
                                                            {items[0] && (
                                                                <NewsCardBig
                                                                    size="large"
                                                                    news={
                                                                        items[0]
                                                                    }
                                                                    className="w-full"
                                                                />
                                                            )}
                                                            <div className="grid gap-6 md:gap-8">
                                                                {items
                                                                    .slice(1)
                                                                    .map(
                                                                        (n) => (
                                                                            <NewsCardWide
                                                                                key={
                                                                                    n.id
                                                                                }
                                                                                news={
                                                                                    n
                                                                                }
                                                                                onHideNews={
                                                                                    handleHideNews
                                                                                }
                                                                                className="h-full"
                                                                            />
                                                                        )
                                                                    )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="grid gap-6 md:gap-8">
                                                                {items
                                                                    .slice(0, 3)
                                                                    .map(
                                                                        (n) => (
                                                                            <NewsCardWide
                                                                                key={
                                                                                    n.id
                                                                                }
                                                                                news={
                                                                                    n
                                                                                }
                                                                                onHideNews={
                                                                                    handleHideNews
                                                                                }
                                                                                className="h-full"
                                                                            />
                                                                        )
                                                                    )}
                                                            </div>
                                                            {items[3] && (
                                                                <NewsCardBig
                                                                    size="large"
                                                                    news={
                                                                        items[3]
                                                                    }
                                                                    className="w-full"
                                                                />
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="block sm:hidden">
                                                    {items.map((n) => (
                                                        <NewsCardWide
                                                            key={n.id}
                                                            news={n}
                                                            onHideNews={
                                                                handleHideNews
                                                            }
                                                            className="mb-4 h-full"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                {/* Slider for Trending Topics */}
                                <SectionSliderNewTopics
                                    className="py-8"
                                    heading=""
                                    subHeading=""
                                    topics={topics}
                                    topicCardType="card4"
                                    itemPerRow={5}
                                />
                                {/* Infinite scroll section for Trending */}
                                <NewsSection
                                    news={trendingNews}
                                    id="trending"
                                    newsFn={fetchTrendingPaginated}
                                    onHideNews={handleHideNews}
                                />
                            </div>
                        </Tab.Panel>

                        {/* DISCOVER TAB */}
                        <Tab.Panel>
                            <section className="space-y-12">
                                <HeaderFilter heading="Discover" />
                                {!recentNews.length && (
                                    <span>Nothing we found!</span>
                                )}
                                {/* Magazine-style first 16 items: 4 rows of 1 big + 3 wide cards alternating */}
                                {recentNews.length > 0 &&
                                    [0, 1, 2, 3].map((row) => {
                                        const items = recentNews.slice(
                                            row * 4,
                                            row * 4 + 4
                                        )
                                        const bigLeft = row % 2 === 0
                                        return (
                                            <div
                                                key={row}
                                                className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10"
                                            >
                                                {bigLeft ? (
                                                    <>
                                                        {items[0] && (
                                                            <NewsCardBig
                                                                size="large"
                                                                news={items[0]}
                                                                className="w-full"
                                                            />
                                                        )}
                                                        <div className="grid gap-6 md:gap-8">
                                                            {items
                                                                .slice(1)
                                                                .map((n) => (
                                                                    <NewsCardWide
                                                                        key={
                                                                            n.id
                                                                        }
                                                                        news={n}
                                                                        onHideNews={
                                                                            handleHideNews
                                                                        }
                                                                        className="h-full"
                                                                    />
                                                                ))}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="grid gap-6 md:gap-8">
                                                            {items
                                                                .slice(0, 3)
                                                                .map((n) => (
                                                                    <NewsCardWide
                                                                        key={
                                                                            n.id
                                                                        }
                                                                        news={n}
                                                                        onHideNews={
                                                                            handleHideNews
                                                                        }
                                                                        className="h-full"
                                                                    />
                                                                ))}
                                                        </div>
                                                        {items[3] && (
                                                            <NewsCardBig
                                                                size="large"
                                                                news={items[3]}
                                                                className="w-full"
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )
                                    })}
                                {/* Slider for Discover Topics */}
                                <SectionSliderNewTopics
                                    className="py-8"
                                    heading=""
                                    subHeading=""
                                    topics={topics}
                                    topicCardType="card4"
                                    itemPerRow={5}
                                />
                                {/* Remaining posts in normal NewsSection */}
                                {recentNews.length > 16 && (
                                    <NewsSection
                                        news={recentNews.slice(16)}
                                        id="discover"
                                        newsFn={fetchDiscoverNews}
                                        onHideNews={handleHideNews}
                                    />
                                )}
                            </section>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    )
}

export default ForYouFeed
