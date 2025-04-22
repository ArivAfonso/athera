'use client'

import React, { useState, useEffect, useRef } from 'react'
import TopicFilterListBox from '@/components/TopicFilterListBox/TopicFilterListBox'
import { Input, Nav, NavItem } from 'ui'
import CardTopic2 from '@/components/CardTopic2/CardTopic2'
import { useRouter, useSearchParams } from 'next/navigation'
import NewsType from '@/types/NewsType'
import TopicType from '@/types/TopicType'
import SourceType from '@/types/SourceType'
import { createClient } from '@/utils/supabase/client'
import Empty from '@/components/Empty'
import CardSourceBox from '@/components/CardSourceBox/CardSourceBox'
import NewsSection from '@/components/NewsSection/NewsSection'
import NewsCard from '@/components/NewsCard/NewsCard'
import NewsCardWide from '@/components/NewsCardWide/NewsCardWide'
import { debounce } from 'es-toolkit'

// Cache for search results
const searchCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

// Track the latest request to prevent race conditions
let currentRequestId = 0

async function getNews(
    query: string,
    filter_option: string,
    requestId: number
) {
    console.log('getNews', query, filter_option, 'requestId:', requestId)

    // Create cache key
    const cacheKey = `news-${query}-${filter_option}`

    // Check cache first
    const cached = searchCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        console.log('Using cached news results')
        return { data: cached.data, requestId }
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/match-news?q=${encodeURIComponent(query)}&filter=${filter_option}`
    )

    if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`)
    }
    const data = await res.json()
    if (data) {
        data.forEach((news: any) => {
            news.likeCount = news.likecount
            news.commentCount = news.commentcount
        })
    }

    // Cache the results
    searchCache.set(cacheKey, {
        data: data || [],
        timestamp: Date.now(),
    })

    return { data: data || [], requestId }
}

async function fetchTopicsData(query: string, requestId: number) {
    const supabase = createClient()

    // Create cache key
    const cacheKey = `topics-${query}`

    // Check cache first
    const cached = searchCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        console.log('Using cached topics results')
        return { data: cached.data, requestId }
    }

    const { data, error } = await supabase
        .from('topics')
        .select(`id, name, color, newsCount:news_topics(count)`)
        .textSearch('name', `${query}`)

    if (error) {
        console.error('Error fetching topics:', error)
    }

    // Cache results
    searchCache.set(cacheKey, {
        data: data || [],
        timestamp: Date.now(),
    })

    return { data: data || [], requestId }
}

async function fetchSourcesData(query: string, requestId: number) {
    const supabase = createClient()

    // Create cache key
    const cacheKey = `sources-${query}`

    // Check cache first
    const cached = searchCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        return { data: cached.data, requestId }
    }

    const { data, error } = await supabase
        .from('sources')
        .select(`*`)
        .textSearch('name', `${query}`)

    if (error) {
        console.error('Error fetching sources:', error)
    }

    // Cache results
    searchCache.set(cacheKey, {
        data: data || [],
        timestamp: Date.now(),
    })

    return { data: data || [], requestId }
}

const FILTERS = [
    { name: 'Most Relevant' },
    { name: 'Most Commented' },
    { name: 'Most Recent' },
    { name: 'Most Liked' },
]
const TABS = ['News', 'Topics', 'Sources']

const PageSearch = () => {
    const [news, setNews] = useState<NewsType[]>([])
    const [loading, setLoading] = useState(false)
    const [newsLoaded, setNewsLoaded] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialSearchRef = useRef(true)
    const currentSearchRef = useRef('')

    const initialSearchValue = searchParams.get('q') || ''
    const [searchValue, setSearchValue] = useState(initialSearchValue)
    const [tabActive, setTabActive] = useState<string>(TABS[0])
    const [topics, setTopics] = useState<TopicType[]>([])
    const [topicsLoading, setTopicsLoading] = useState(false)
    const [sources, setSources] = useState<SourceType[]>([])
    const [sourcesLoading, setSourcesLoading] = useState(false)
    const [activeFilter, setActiveFilter] = useState('most_relevant')

    // Fetch initial news data only once when component mounts
    useEffect(() => {
        if (initialSearchValue && initialSearchRef.current) {
            initialSearchRef.current = false
            setLoading(true)
            currentSearchRef.current = initialSearchValue
            const requestId = ++currentRequestId

            getNews(initialSearchValue, 'most_relevant', requestId)
                .then((response) => {
                    // Only update if this is still the latest request
                    if (response.requestId === currentRequestId) {
                        setNews(response.data)
                        setNewsLoaded(true)
                    }
                })
                .catch(console.error)
                .finally(() => {
                    if (requestId === currentRequestId) {
                        setLoading(false)
                    }
                })
        }
    }, [initialSearchValue])

    useEffect(() => {
        const debouncedFetchData = debounce(async () => {
            if (!searchValue) return

            setLoading(true)
            currentSearchRef.current = searchValue
            const requestId = ++currentRequestId

            try {
                const response = await getNews(
                    searchValue,
                    activeFilter,
                    requestId
                )
                // Only update state if this is still the current request
                if (response.requestId === currentRequestId) {
                    setNews(response.data)
                    setNewsLoaded(true)
                    document.title = `Search for "${searchValue}" - Athera`
                }
            } catch (err) {
                console.log(err)
            } finally {
                if (requestId === currentRequestId) {
                    setLoading(false)
                }
            }
        }, 300)

        if (searchValue) {
            debouncedFetchData()
        }

        return () => {
            debouncedFetchData.cancel()
        }
    }, [searchValue, activeFilter])

    const getTopicsData = async () => {
        if (topicsLoading) return
        setTopicsLoading(true)
        const requestId = ++currentRequestId

        try {
            const response = await fetchTopicsData(searchValue, requestId)
            // Only update if this is still the current request
            if (response.requestId === currentRequestId) {
                const topicsData: TopicType[] = response.data.map(
                    (topic: TopicType) => ({
                        ...topic,
                        name: topic.name || '',
                        color: topic.color || '',
                        postCount: topic.newsCount || [],
                    })
                )
                setTopics(topicsData)
            }
        } catch (error) {
            console.error('Failed to fetch topics:', error)
        } finally {
            if (requestId === currentRequestId) {
                setTopicsLoading(false)
            }
        }
    }

    const getSourcesData = async () => {
        if (sourcesLoading) return
        setSourcesLoading(true)
        const requestId = ++currentRequestId

        try {
            const response = await fetchSourcesData(searchValue, requestId)
            // Only update if this is still the current request
            if (response.requestId === currentRequestId) {
                setSources(response.data)
            }
        } catch (error) {
            console.error('Failed to fetch sources:', error)
        } finally {
            if (requestId === currentRequestId) {
                setSourcesLoading(false)
            }
        }
    }

    const handleClickTab = (item: string) => {
        if (item === tabActive) {
            return
        }
        setTabActive(item)

        if (item === 'Topics' && topics.length === 0) {
            getTopicsData()
        } else if (item === 'Sources' && sources.length === 0) {
            getSourcesData()
        }
    }

    const handleFilterClick = async (filterOption: string) => {
        const formattedOption = filterOption.replaceAll(' ', '_').toLowerCase()
        setActiveFilter(formattedOption)

        // If we have cached results, don't show loading state
        const cacheKey = `news-${searchValue}-${formattedOption}`
        const cached = searchCache.get(cacheKey)
        const requestId = ++currentRequestId

        if (!(cached && Date.now() - cached.timestamp < CACHE_EXPIRY)) {
            setLoading(true)
        }

        try {
            const response = await getNews(
                searchValue,
                formattedOption,
                requestId
            )
            // Only update if this is still the current request
            if (response.requestId === currentRequestId) {
                setNews(response.data)
            }
        } catch (err) {
            console.log(err)
        } finally {
            if (requestId === currentRequestId) {
                setLoading(false)
            }
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (searchValue === '') return

        // Clear all previous requests and set current search as the URL search
        currentRequestId = 0

        // Only navigate if we're actually changing the search
        if (searchValue !== currentSearchRef.current) {
            currentSearchRef.current = searchValue
            router.push(`/search?q=${encodeURIComponent(searchValue)}`)
        }
    }

    // Properly implemented functions
    function handleHideNews(newsId: string): void {
        setNews((prevNews) => prevNews.filter((item) => item.id !== newsId))
    }

    const handleRemoveWatchlist = async (newsId: string) => {
        setNews((prev) => prev?.filter((item) => item.id !== newsId))
    }

    return (
        <div>
            <title>Search results for {searchValue}</title>
            <div
                className={`h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-100/50 dark:bg-neutral-900`}
            />
            <div className="container">
                <header className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7">
                    <form
                        className="relative"
                        action=""
                        method="post"
                        onSubmit={handleSubmit}
                    >
                        <label
                            htmlFor="search-input"
                            className="text-neutral-500 dark:text-neutral-300"
                        >
                            <span className="sr-only">Search all icons</span>
                            <Input
                                id="search-input"
                                type="search"
                                placeholder="Type and press enter"
                                className="shadow-lg rounded-xl border-opacity-0"
                                sizeClass="pl-16 py-5 pr-5 md:pl-16"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
                                <svg
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M19.25 19.25L15.5 15.5M4.75 11C4.75 7.54822 7.54822 4.75 11 4.75C14.4518 4.75 17.25 7.54822 17.25 11C17.25 14.4518 14.4518 17.25 11 17.25C7.54822 17.25 4.75 14.4518 4.75 11Z"
                                    ></path>
                                </svg>
                            </span>
                        </label>
                    </form>
                    {searchValue !== '' && (
                        <span className="block text-lg mt-4 text-neutral-500 dark:text-neutral-300">
                            {loading ? (
                                'Searching...'
                            ) : (
                                <>
                                    We found{' '}
                                    <strong className="font-semibold text-neutral-800 dark:text-neutral-100">
                                        {news.length}
                                    </strong>{' '}
                                    results news for{' '}
                                    <strong className="font-semibold text-neutral-800 dark:text-neutral-100">
                                        {`"${searchValue}"`}
                                    </strong>
                                </>
                            )}
                        </span>
                    )}
                </header>
            </div>
            <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
                <main>
                    <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row ">
                        <Nav
                            containerClassName="w-full overflow-x-auto hiddenScrollbar"
                            className=" sm:space-x-2"
                        >
                            {TABS.map((item, index) => (
                                <NavItem
                                    key={index}
                                    isActive={tabActive === item}
                                    onClick={() => handleClickTab(item)}
                                >
                                    {item}
                                </NavItem>
                            ))}
                        </Nav>
                        <div className="block my-4 border-b w-full border-neutral-300 dark:border-neutral-500 sm:hidden"></div>
                        <div className="flex justify-end">
                            <TopicFilterListBox
                                lists={FILTERS}
                                onFilterClick={handleFilterClick}
                            />
                        </div>
                    </div>

                    {loading && tabActive === 'News' && (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <div className="animate-pulse text-lg">
                                Loading news...
                            </div>
                        </div>
                    )}

                    {tabActive === 'News' &&
                        news.length > 0 &&
                        searchValue !== '' &&
                        !loading && (
                            <div
                                className={`gap-6 md:gap-8 mt-8 lg:mt-10 ${(news ? news.length : 0) < 4 ? 'flex justify-center flex-wrap' : `grid lg:grid-cols-3 xl:grid-cols-${4}`}`}
                            >
                                {news &&
                                    news.map((item, key) => (
                                        <div
                                            key={key}
                                            className={`${(news ? news.length : 0) < 4 ? `w-full sm:w-1/2 lg:w-1/3 xl:w-1/${4}` : ''}`}
                                            // Assign the ref to the div if the news is the third last one
                                        >
                                            <div className="hidden sm:block">
                                                <NewsCard
                                                    onHideNews={handleHideNews}
                                                    news={item}
                                                    onRemoveWatchlist={
                                                        handleRemoveWatchlist
                                                    }
                                                />
                                            </div>

                                            <div className="sm:hidden grid grid-cols-1 gap-6">
                                                <NewsCardWide
                                                    onHideNews={handleHideNews}
                                                    news={item}
                                                    onRemoveWatchlist={
                                                        handleRemoveWatchlist
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}

                    {tabActive === 'Topics' && topicsLoading && (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <div className="animate-pulse text-lg">
                                Loading topics...
                            </div>
                        </div>
                    )}

                    {tabActive === 'Topics' &&
                        topics.length > 0 &&
                        !topicsLoading && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-8 mt-8 lg:mt-10">
                                {topics.map((cat, id) => (
                                    <CardTopic2 key={id} topic={cat} />
                                ))}
                            </div>
                        )}

                    {tabActive === 'Sources' && sourcesLoading && (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <div className="animate-pulse text-lg">
                                Loading sources...
                            </div>
                        </div>
                    )}

                    {tabActive === 'Sources' &&
                        sources.length > 0 &&
                        !sourcesLoading && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-8 mt-8 lg:mt-10">
                                {sources.map((source, key) => (
                                    <CardSourceBox key={key} source={source} />
                                ))}
                            </div>
                        )}

                    {tabActive === 'News' &&
                        news.length === 0 &&
                        searchValue !== '' &&
                        !loading &&
                        newsLoaded && (
                            <Empty
                                mainText="No News Found"
                                subText="We couldn't find any results. Try for something else."
                            />
                        )}

                    {tabActive === 'Topics' &&
                        topics.length === 0 &&
                        !topicsLoading && (
                            <Empty
                                mainText="No Topics Found"
                                subText="We couldn't find any results. Try for something else."
                            />
                        )}

                    {tabActive === 'Sources' &&
                        sources.length === 0 &&
                        !sourcesLoading && (
                            <Empty
                                mainText="No Sources Found"
                                subText="We couldn't find any results. Try for something else."
                            />
                        )}
                </main>
            </div>
        </div>
    )
}

export default PageSearch
