'use client'

import React, { FC, useState } from 'react'
import HeaderFilter from './HeaderFilter'
import NewsType from '@/types/NewsType'
import NewsCardWide from '../NewsCardWide/NewsCardWide'
import NewsCardBig from '../NewsCardBig/NewsCardBig'
// import NewsCardBig from '../NewsCardBig/NewsCardBig'

export interface SectionMagazine1Props {
    news: NewsType[]
    heading?: string
    className?: string
}

const SectionMagazine1: FC<SectionMagazine1Props> = ({
    news,
    heading = 'Latest Articles 🎈 ',
    className = '',
}) => {
    const [myNews, setNews] = useState<NewsType[]>(news)

    const handleHideNews = (id: string) => {
        //Filter out the news with the id
        const filteredNews = myNews.filter((news) => news.id !== id)
        //Set the new news
        setNews(filteredNews)
    }

    // Render a row with only wide cards
    const renderWideRow = (startIndex: number, count: number) => {
        if (startIndex >= myNews.length) return null

        return (
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10">
                {myNews
                    .slice(startIndex, startIndex + count)
                    .map((item, index) => (
                        <NewsCardWide
                            onHideNews={handleHideNews}
                            key={`${startIndex}-${index}`}
                            news={item}
                        />
                    ))}
            </div>
        )
    }

    // Render a row with big card on the left and three wide cards on the right
    const renderBigLeftRow = (startIndex: number) => {
        if (startIndex >= myNews.length) return null

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10">
                {myNews[startIndex] && (
                    <NewsCardBig size="large" news={myNews[startIndex]} />
                )}
                <div className="grid gap-6 md:gap-8">
                    {myNews
                        .slice(startIndex + 1, startIndex + 4)
                        .map((item, index) => (
                            <NewsCardWide
                                onHideNews={handleHideNews}
                                key={`${startIndex}-${index}`}
                                news={item}
                            />
                        ))}
                </div>
            </div>
        )
    }

    // Render a row with three wide cards on the left and big card on the right
    const renderWideLeftRow = (startIndex: number) => {
        if (startIndex >= myNews.length) return null

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10">
                <div className="grid gap-6 md:gap-8">
                    {myNews
                        .slice(startIndex, startIndex + 3)
                        .map((item, index) => (
                            <NewsCardWide
                                onHideNews={handleHideNews}
                                key={`${startIndex}-${index}`}
                                news={item}
                            />
                        ))}
                </div>
                {myNews[startIndex + 3] && (
                    <NewsCardBig size="large" news={myNews[startIndex + 3]} />
                )}
            </div>
        )
    }

    return (
        <div className={`SectionMagazine1 ${className}`}>
            <HeaderFilter heading={heading} />
            {!myNews.length && <span>Nothing we found!</span>}

            {/* Render all news as wide cards in groups of 4 */}
            {renderWideRow(0, 4)}

            {/* Render a big card on the left and three wide cards on the right */}
            {renderBigLeftRow(4)}

            {/* Render a big card on the right and three wide cards on the left */}
            {renderWideLeftRow(7)}
        </div>
    )
}

export default SectionMagazine1
