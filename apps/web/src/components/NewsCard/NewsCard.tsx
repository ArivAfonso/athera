'use client'

import React, { FC, Fragment, useState } from 'react'
import TopicBadgeList from '@/components/TopicBadgeList/TopicBadgeList'
import NewsFeaturedMedia from '@/components/PostFeaturedMedia/NewsFeaturedMedia'
import NewsType from '@/types/NewsType'
import PostBookmark from '../PostBookmark/PostBookmark'
import stringToSlug from '@/utils/stringToSlug'
import Tilt from 'react-parallax-tilt'
import { getCookie } from 'cookies-next'
import { Avatar, DropDown } from 'ui'
import NewsCardLikeAndComment from '../NewsCardLikeAndComment/NewsCardLikeAndComment'
import NewsDetailModal from '../NewsDetailModal/NewsDetailModal'
import Link from 'next/link'

export interface NewsCardProps {
    className?: string
    news: NewsType
    ratio?: string
    hiddenAuthor?: boolean
    onHideNews: (newsId: string) => void
    watchOption?: boolean
    onRemoveWatchlist?: (newsId: string) => void
    innerRef?: any
}

const NewsCard: FC<NewsCardProps> = ({
    className = 'h-full',
    news,
    hiddenAuthor = false,
    watchOption = false,
    ratio = 'aspect-w-4 aspect-h-3',
    onHideNews,
    onRemoveWatchlist,
    innerRef,
}) => {
    const [isHover, setIsHover] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)

    const openDetailModal = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent any default link behavior

        setShowDetailModal(true)
    }
    const closeDetailModal = () => setShowDetailModal(false)

    if (!news) return null

    news.created_at = new Date(
        news.created_at ? news.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const tilt = getCookie('parallaxTiltEnabled')

    return (
        <>
            <Tilt tiltEnable={tilt === 'true'}>
                <div
                    className={`NewsCard relative flex flex-col group rounded-3xl overflow-hidden border dark:border-transparent border-neutral-100 dark:bg-neutral-900 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:translate-y-[-4px] ${className}`}
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    ref={innerRef}
                >
                    <div
                        className={`block flex-shrink-0 relative w-full rounded-t-3xl overflow-hidden z-10 ${ratio}`}
                    >
                        <div className="view-transition">
                            <NewsFeaturedMedia news={news} isHover={isHover} />
                        </div>
                    </div>

                    <span className="absolute top-3 inset-x-3 z-10">
                        <TopicBadgeList
                            chars={26}
                            topics={news.news_topics || []}
                        />
                    </span>

                    <div className="p-4 flex flex-col space-y-3">
                        {!hiddenAuthor ? (
                            <div className="flex items-center space-x-2">
                                <Avatar
                                    radius="rounded-full"
                                    sizeClass="h-8 w-8 text-sm"
                                    imgUrl={
                                        news.source
                                            ? news.source.image
                                            : undefined
                                    }
                                    userName={
                                        news.source ? news.source.name : ''
                                    }
                                />
                                <div className="flex flex-col">
                                    <Link href={`/source/${news.source?.id}`}>
                                        <span className="text-neutral-900 dark:text-neutral-100 font-medium text-sm">
                                            {news.source
                                                ? news.source.name
                                                : 'Unknown Source'}
                                        </span>
                                    </Link>
                                    <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                                        <span>{news.created_at}</span>
                                        {news.author && (
                                            <>
                                                <span className="mx-2">•</span>
                                                <span className="font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[120px]">
                                                    {news.author.split(' ')
                                                        .length > 1
                                                        ? `${news.author.split(' ')[0]} ${news.author.split(' ').slice(-1)}`
                                                        : news.author}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <span className="mt-2 text-xs text-neutral-500">
                                {news.created_at}
                            </span>
                        )}
                        <h3 className="card-title block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                            <span
                                className="line-clamp-2 hover:cursor-pointer"
                                title={news.title}
                                onClick={openDetailModal}
                            >
                                {news.title}
                            </span>
                        </h3>
                        <div className="flex items-end justify-between mt-auto">
                            <NewsCardLikeAndComment
                                likes={news.likeCount?.[0]?.count || 0}
                                comments={news.commentCount?.[0]?.count || 0}
                                id={news.id}
                                className="relative"
                            />
                            <PostBookmark
                                className="relative"
                                postId={news.id}
                            />
                        </div>
                    </div>
                </div>
            </Tilt>

            <NewsDetailModal
                show={showDetailModal}
                news={news}
                onClose={closeDetailModal}
            />
        </>
    )
}

export default NewsCard
