'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso'
import NewsCard from '../NewsCard/NewsCard'
import NewsCardWide from '../NewsCardWide/NewsCardWide'
import NewsType from '@/types/NewsType'
import NewsCardSkeleton from '../NewsCard/NewsCardSkeleton'

interface NewsSectionProps {
    news: NewsType[]
    id: string
    type?: string
    rows?: number
    newsFn: (page: number) => Promise<any>
    onHideNews: (newsId: string) => void
    onRemoveWatchlist?: (newsId: string) => void
    watchOption?: boolean
}

function NewsSection({
    news,
    id,
    type = '',
    rows = 4,
    newsFn,
    onHideNews,
    onRemoveWatchlist,
    watchOption = false,
}: NewsSectionProps) {
    const [newsState, setNewsState] = useState<NewsType[]>(news)
    const [page, setPage] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [hasMore, setHasMore] = useState<boolean>(
        news.length % 48 === 0 && news.length > 0
    )
    const [error, setError] = useState<string | null>(null)

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)

        try {
            const response = await newsFn(page)
            let newItems: NewsType[] = []

            if (type === 'topics' && response && (response as any).news) {
                newItems = (response as any).news
            } else if (Array.isArray(response)) {
                newItems = response
            }

            if (newItems.length === 0 || newItems.length % 48 !== 0) {
                setHasMore(false)
            }

            setNewsState((prev) => [...prev, ...newItems])
            setPage((prev) => prev + 1)
        } catch (err) {
            console.error('Error loading more news:', err)
            setError('Failed to load more news')
            setHasMore(false)
        } finally {
            setIsLoading(false)
        }
    }, [isLoading, hasMore, page, newsFn, type])

    const handleEndReached = useCallback(() => {
        console.log('End reached, hasMore:', hasMore)
        if (hasMore) loadMore()
    }, [hasMore, loadMore])

    // Render card based on screen size
    const renderNewsItem = useCallback(
        (item: NewsType) => (
            <>
                <div className="hidden sm:block">
                    <NewsCard
                        onHideNews={onHideNews}
                        news={item}
                        onRemoveWatchlist={onRemoveWatchlist}
                        watchOption={watchOption}
                    />
                </div>
                <div className="sm:hidden">
                    <NewsCardWide
                        onHideNews={onHideNews}
                        news={item}
                        onRemoveWatchlist={onRemoveWatchlist}
                        watchOption={watchOption}
                    />
                </div>
            </>
        ),
        [onHideNews, onRemoveWatchlist, watchOption]
    )

    const columns = rows
    const groupedNews: NewsType[][] = []
    for (let i = 0; i < newsState.length; i += columns) {
        groupedNews.push(newsState.slice(i, i + columns))
    }

    // Fallback for empty news state remains unchanged
    if (newsState.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <p className="text-gray-500">No news available</p>
            </div>
        )
    }

    return (
        <div id={`news-section-${id}`} className="news-container relative">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <Virtuoso
                useWindowScroll
                style={{ width: '100%' }}
                totalCount={groupedNews.length}
                atBottomThreshold={600}
                itemContent={(rowIndex) => {
                    const rowItems = groupedNews[rowIndex]
                    return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 md:p-4">
                            {rowItems.map((item, itemIndex) => (
                                <div
                                    key={item.id || itemIndex}
                                    className="h-full"
                                >
                                    {renderNewsItem(item)}
                                </div>
                            ))}
                        </div>
                    )
                }}
                endReached={handleEndReached}
                overscan={3000}
            />

            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 md:p-4">
                    {Array.from({ length: rows }).map((_, index) => (
                        <NewsCardSkeleton key={`skeleton-${index}`} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default NewsSection
