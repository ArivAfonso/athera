import { Img } from 'ui'
import NextPrev from '@/components/NextPrev/NextPrev'
import NewsCardLikeAndComment from '@/components/NewsCardLikeAndComment/NewsCardLikeAndComment'
import React, { FC, useState } from 'react'
import CardAuthor2 from '@/components/CardAuthor2/CardAuthor2'
import TopicBadgeList from '@/components/TopicBadgeList/TopicBadgeList'
import Link from 'next/link'
import NewsType from '@/types/NewsType'
import PostBookmark from '../PostBookmark/PostBookmark'
import SourceSection from '../SourceSection/SourceSection'
import NewsDetailModal from '../NewsDetailModal/NewsDetailModal'

export interface CardLarge1Props {
    className?: string
    news: NewsType
    onClickNext?: () => void
    onClickPrev?: () => void
}

const CardLarge1: FC<CardLarge1Props> = ({
    className = '',
    news,
    onClickNext = () => {},
    onClickPrev = () => {},
}) => {
    const imageUrl = news.image
    news.created_at = new Date(
        news.created_at ? news.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    const [showDetailModal, setShowDetailModal] = useState(false)
    const openDetailModal = (e: React.MouseEvent) => {
        e.preventDefault()
        setShowDetailModal(true)
    }
    const closeDetailModal = () => setShowDetailModal(false)
    return (
        <div
            className={`CardLarge1 nc-CardLarge1--hasAnimation relative flex flex-col-reverse md:flex-row justify-end ${className}`}
        >
            <div className="md:absolute z-10 md:left-0 md:top-1/2 md:-translate-y-1/2 w-full -mt-8 md:mt-0 px-3 sm:px-6 md:px-0 md:w-3/5 lg:w-1/2 xl:w-2/5">
                <div className="CardLarge1__left p-4 sm:p-8 xl:py-14 md:px-10 bg-white/40 dark:bg-neutral-900/40 backdrop-filter backdrop-blur-lg shadow-lg dark:shadow-2xl rounded-3xl space-y-3 sm:space-y-5 ">
                    <TopicBadgeList topics={news.news_topics} />

                    <h2 className="card-title text-base sm:text-xl lg:text-2xl font-semibold ">
                        <span
                            onClick={openDetailModal}
                            className="line-clamp-2 cursor-pointer"
                            title={news.title}
                        >
                            {news.title}
                        </span>
                    </h2>

                    {/* <CardAuthor2
                        className="relative"
                        author={news.author}
                        readingTime={news.estimatedReadingTime}
                        date={news.created_at}
                        id={news.author.id}
                        name={news.author.name}
                        username={news.author.username}
                        avatar={news.author.avatar}
                    /> */}

                    {/* @ts-ignore */}
                    <SourceSection
                        className="relative"
                        source={news.source}
                        date={news.created_at}
                        id={news.source.id}
                        name={news.source.name}
                        image={news.source.image}
                    />

                    <div className="flex items-center justify-between mt-auto">
                        <NewsCardLikeAndComment
                            likes={news.likeCount[0].count}
                            comments={news.commentCount[0].count}
                            id={news.id}
                            className="relative"
                        />
                        <PostBookmark
                            bookmarkClass="h-8 w-8 bg-neutral-50/30 hover:bg-neutral-50/50 dark:bg-neutral-800/30 dark:hover:bg-neutral-800/50"
                            className="relative"
                            postId={news.id}
                        />
                    </div>
                </div>
                <div className="p-4 sm:pt-8 sm:px-10">
                    <NextPrev
                        btnClassName="w-11 h-11 text-xl"
                        onClickNext={onClickNext}
                        onClickPrev={onClickPrev}
                    />
                </div>
            </div>
            <div className="w-full md:w-4/5 lg:w-2/3">
                <div className="block aspect-w-16 aspect-h-12 sm:aspect-h-9 md:aspect-h-14 lg:aspect-h-10 2xl:aspect-h-9 relative">
                    <Img
                        className="absolute inset-0 object-cover rounded-3xl"
                        src={imageUrl}
                        alt={news.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </div>
            <NewsDetailModal
                show={showDetailModal}
                news={news}
                onClose={closeDetailModal}
            />
        </div>
    )
}

export default CardLarge1
