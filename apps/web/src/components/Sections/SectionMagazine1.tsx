'use client'

import React, { FC, useState } from 'react'
import Card2 from '@/components/Card2/Card2'
import Card6 from '@/components/Card6/Card6'
import HeaderFilter from './HeaderFilter'
import NewsType from '@/types/NewsType'
import NewsCardWide from '../NewsCardWide/NewsCardWide'
import NewsCardBig from '../NewsCardBig/NewsCardBig'

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
        const filteredNews = news.filter((news) => news.id !== id)
        //Set the new news
        setNews(filteredNews)
    }

    return (
        <div className={`SectionMagazine1 ${className}`}>
            <HeaderFilter heading={heading} />
            {!news.length && <span>Nothing we found!</span>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {news[0] && <NewsCardBig size="large" news={news[0]} />}
                <div className="grid gap-6 md:gap-8">
                    {myNews
                        .filter((_, i) => i < 4 && i > 0)
                        .map((item, index) => (
                            <NewsCardWide
                                onHideNews={handleHideNews}
                                key={index}
                                news={item}
                            />
                        ))}
                </div>
            </div>
        </div>
    )
}

export default SectionMagazine1
