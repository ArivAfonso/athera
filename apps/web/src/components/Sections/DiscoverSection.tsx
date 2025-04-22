// New component for infinite scroll in Discover section
'use client'
import React, { useMemo, useState, useCallback } from 'react'
import { Virtuoso } from 'react-virtuoso'
import NewsCardWide from '../NewsCardWide/NewsCardWide'
import NewsCardBig from '../NewsCardBig/NewsCardBig'
import NewsType from '@/types/NewsType'

interface DiscoverSectionProps {
    news: NewsType[]
    newsFn: (page: number) => Promise<NewsType[]>
    onHideNews: (newsId: string) => void
}

const DiscoverSection = ({
    news,
    newsFn,
    onHideNews,
}: DiscoverSectionProps) => {
    // pagination state
    const [items, setItems] = useState<NewsType[]>(news)
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(news.length > 0)

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return
        setIsLoading(true)
        try {
            const newItems = await newsFn(page + 1)
            if (!newItems.length) setHasMore(false)
            setItems((prev) => [...prev, ...newItems])
            setPage((prev) => prev + 1)
        } catch {
            setHasMore(false)
        } finally {
            setIsLoading(false)
        }
    }, [newsFn, page, isLoading, hasMore])

    const groupedRows = useMemo(() => {
        const rows: NewsType[][] = []
        for (let i = 0; i < items.length; i += 4) {
            rows.push(items.slice(i, i + 4))
        }
        return rows
    }, [news])

    return (
        <Virtuoso
            useWindowScroll
            style={{ width: '100%' }}
            totalCount={groupedRows.length}
            itemContent={(rowIndex) => {
                const items = groupedRows[rowIndex]
                const bigLeft = rowIndex % 2 === 0
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10">
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
                                    {items.slice(1).map((n) => (
                                        <NewsCardWide
                                            key={n.id}
                                            news={n}
                                            onHideNews={onHideNews}
                                            className="h-full"
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="grid gap-6 md:gap-8">
                                    {items.slice(0, 3).map((n) => (
                                        <NewsCardWide
                                            key={n.id}
                                            news={n}
                                            onHideNews={onHideNews}
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
            }}
            endReached={loadMore}
            overscan={3000}
        />
    )
}

export default DiscoverSection
