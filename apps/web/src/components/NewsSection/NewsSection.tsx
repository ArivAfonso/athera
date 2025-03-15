'use client'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import NewsCard from '../NewsCard/NewsCard'
import NewsType from '@/types/NewsType'
import NewsCardWide from '../NewsCardWide/NewsCardWide'

interface NewsSectionProps {
    // initial array of news items
    news: NewsType[]
    id: string
    // pagination function to fetch next set of news
    rows?: number
    newsFn: (page: number) => Promise<NewsType[]>
    onHideNews: (newsId: string) => void
    onRemoveWatchlist?: (newsId: string) => void
    watchOption?: boolean
}

function NewsSection({
    news,
    id,
    rows = 4,
    newsFn,
    onHideNews,
    onRemoveWatchlist,
    watchOption = false,
}: NewsSectionProps) {
    const [newsState, setNews] = useState<NewsType[] | undefined>(news)
    const [addNewsFinished, setAddNewsFinished] = useState(news.length < 24)

    const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: [id],
            queryFn: async ({ pageParam = 1 }) => {
                if (addNewsFinished) return []
                const response = await newsFn(pageParam)
                if (response.length === 0 || response.length % 24 !== 0)
                    setAddNewsFinished(true)
                return response
            },
            getNextPageParam: (lastPage, allPages) => allPages.length + 1,
            initialPageParam: 1,
            initialData: {
                pages: [news],
                pageParams: [1],
            },
            // Prevent refetching when window regains focus and keep data fresh for 5 minutes
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
        })

    useEffect(() => {
        if (data) {
            // Merge new pages into one array
            const allNews = data.pages.flat()
            setNews(allNews)
        }
    }, [data])

    const lastNewsRef = useRef(null)
    const entry = useIntersectionObserver(lastNewsRef, {
        root: null,
        rootMargin: '600px',
        threshold: 0.1,
    })

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage) {
            fetchNextPage()
        }
    }, [entry?.isIntersecting, hasNextPage])

    const handleHideNews = (newsId: string) => {
        onHideNews(newsId)
        setNews((prev) => prev?.filter((item) => item.id !== newsId))
    }

    const handleRemoveWatchlist = async (newsId: string) => {
        if (onRemoveWatchlist) {
            onRemoveWatchlist(newsId)
            setNews((prev) => prev?.filter((item) => item.id !== newsId))
        }
    }

    return (
        <div
            className={`gap-6 md:gap-8 mt-8 lg:mt-10 ${(news ? news.length : 0) < rows ? 'flex justify-center flex-wrap' : `grid lg:grid-cols-3 xl:grid-cols-${rows}`}`}
        >
            {newsState &&
                newsState.map((item, key) => (
                    <div
                        key={key}
                        className={`${(news ? news.length : 0) < rows ? `w-full sm:w-1/2 lg:w-1/3 xl:w-1/${rows}` : ''}`}
                        // Assign the ref to the div if the news is the third last one
                    >
                        <div className="hidden sm:block">
                            <NewsCard
                                onHideNews={handleHideNews}
                                news={item}
                                onRemoveWatchlist={handleRemoveWatchlist}
                                watchOption={watchOption}
                            />
                        </div>

                        <div className="sm:hidden grid grid-cols-1 gap-6">
                            <NewsCardWide
                                onHideNews={handleHideNews}
                                news={item}
                                onRemoveWatchlist={handleRemoveWatchlist}
                                watchOption={watchOption}
                            />
                        </div>
                    </div>
                ))}
            <div ref={lastNewsRef}>
                {/* Sentinel element for infinite scroll */}
                {isFetchingNextPage && <p>Loading more news...</p>}
            </div>
        </div>
    )
}

export default NewsSection
