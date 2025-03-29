'use client'

import React, { FC, useState } from 'react'
import NewsCardMeta from '@/components/NewsCardMeta/NewsCardMeta'
import NewsCardLikeAndComment from '@/components/NewsCardLikeAndComment/NewsCardLikeAndComment'
import TopicBadgeList from '@/components/TopicBadgeList/TopicBadgeList'
import Link from 'next/link'
import Image from 'next/image'
import NewsType from '@/types/NewsType'
import stringToSlug from '@/utils/stringToSlug'
import { DropDown, Img } from 'ui'
import ModalReportItem from '../ModalReportItem/ModalReportItem'
import ModalHidePost from '../PostActionDropdown/ModalHidePost'
import PostBookmark from '../PostBookmark/PostBookmark'
import NewsDetailModal from '../NewsDetailModal/NewsDetailModal'

export interface NewsCardWideProps {
    className?: string
    news: NewsType
    hiddenAuthor?: boolean
    onHideNews: (newsId: string) => void
    watchOption?: boolean
    onRemoveWatchlist?: (newsId: string) => void
}

const NewsCardWide: FC<NewsCardWideProps> = ({
    className = 'h-full',
    news,
    hiddenAuthor = false,
    watchOption = false,
    onHideNews,
    onRemoveWatchlist,
}) => {
    const [isReporting, setIsReporting] = useState(false)
    const [showModalHideNews, setShowModalHideNews] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)

    const openModalReportNews = () => setIsReporting(true)
    const closeModalReportNews = () => setIsReporting(false)

    const openModalHideNews = () => setShowModalHideNews(true)
    const onCloseModalHideNews = () => setShowModalHideNews(false)

    const openDetailModal = (e: React.MouseEvent) => {
        e.preventDefault()
        setShowDetailModal(true)
    }
    const closeDetailModal = () => setShowDetailModal(false)

    news.created_at = new Date(
        news.created_at ? news.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const handleHideNews = (newsId: string) => {
        onHideNews(newsId)
        setShowModalHideNews(false)
    }

    return (
        <>
            <div
                className={`NewsCardWide relative flex group flex-row items-center sm:p-4 sm:rounded-3xl sm:bg-white sm:dark:bg-neutral-900 sm:border border-neutral-200 dark:border-neutral-700 ${className}`}
            >
                <div className="flex flex-col flex-grow">
                    <div className="space-y-3 mb-4">
                        <TopicBadgeList
                            shorten={true}
                            chars={20}
                            topics={news.news_topics}
                        />

                        <h2
                            className={`block font-semibold text-sm sm:text-base`}
                        >
                            <span
                                onClick={openDetailModal}
                                className="line-clamp-2 cursor-pointer"
                                title={news.title}
                            >
                                {news.title}
                            </span>
                        </h2>
                        <NewsCardMeta
                            className="relative text-xs"
                            avatarSize="h-8 w-8 text-xs"
                            meta={news}
                        />
                    </div>
                    <div className="flex items-center flex-wrap justify-between mt-auto">
                        <NewsCardLikeAndComment
                            likes={news.likeCount[0].count}
                            comments={news.commentCount[0].count}
                            id={news.id}
                            className="relative"
                        />
                        <PostBookmark className="relative" postId={news.id} />
                    </div>
                </div>

                <div
                    className={`block relative flex-shrink-0 w-24 h-24 sm:w-40 sm:h-full ml-3 sm:ml-5 rounded-2xl overflow-hidden z-0`}
                >
                    <Img
                        sizes="(max-width: 600px) 180px, 400px"
                        className="object-cover w-full h-full"
                        fill
                        src={news.image}
                        alt={news.title}
                    />
                </div>
                <ModalReportItem
                    show={isReporting}
                    onCloseModalReportItem={closeModalReportNews}
                    id={news.id}
                />
                <ModalHidePost
                    show={showModalHideNews}
                    id={news.id}
                    title={news.title}
                    onCloseModalHidePost={onCloseModalHideNews}
                    onHidePost={handleHideNews}
                />
            </div>
            <NewsDetailModal
                show={showDetailModal}
                news={news}
                onClose={closeDetailModal}
            />
        </>
    )
}

export default NewsCardWide
