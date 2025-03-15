import React, { FC, useState } from 'react'
import NewsType from '@/types/NewsType'
import NewsCardLikeAndComment from '@/components/NewsCardLikeAndComment/NewsCardLikeAndComment'
import TopicBadgeList from '@/components/TopicBadgeList/TopicBadgeList'
import Link from 'next/link'
import Image from 'next/image'
import NewsCardMeta from '../NewsCardMeta/NewsCardMeta'
import PostBookmark from '../PostBookmark/PostBookmark'
import NewsDetailModal from '../NewsDetailModal/NewsDetailModal'

export interface Card2Props {
    className?: string
    news: NewsType
    size?: 'normal' | 'large'
}

const Card2: FC<Card2Props> = ({
    className = 'h-full',
    size = 'normal',
    news,
}) => {
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
        <div className={`nc-Card2 group relative flex flex-col ${className}`}>
            <div className="block flex-shrink-0 flex-grow relative w-full h-0 pt-[75%] sm:pt-[55%] z-0">
                <Image
                    fill
                    sizes="(max-width: 600px) 480px, 800px"
                    className="object-cover rounded-3xl"
                    src={news.image}
                    alt={news.title}
                />
                <TopicBadgeList
                    className="flex flex-wrap space-x-2 absolute top-3 left-3"
                    itemClass="relative"
                    topics={news.news_topics}
                />
            </div>

            <Link href={news.link} className="absolute inset-0" />

            <div className="mt-5 px-4 flex flex-col">
                <div className="space-y-3">
                    <NewsCardMeta
                        className="relative text-sm"
                        avatarSize="h-8 w-8 text-sm"
                        meta={news}
                    />

                    <h2
                        className={`nc-card-news.title block font-semibold text-neutral-900 dark:text-neutral-100 ${
                            size === 'large'
                                ? 'text-base sm:text-lg md:text-xl'
                                : 'text-base'
                        }`}
                    >
                        <span
                            onClick={openDetailModal}
                            className="line-clamp-2 cursor-pointer"
                            title={news.title}
                        >
                            {news.title}
                        </span>
                    </h2>
                    <span className="block line-clamp-2 text-neutral-500 dark:text-neutral-400 text-[15px] leading-6 ">
                        {news.summary}
                    </span>
                </div>
                <div className="my-5 border-t border-neutral-200 dark:border-neutral-700"></div>
                <div className="flex items-center justify-between">
                    <NewsCardLikeAndComment
                        id={news.id}
                        likes={news.likeCount[0].count}
                        className="relative"
                    />
                    <PostBookmark className="relative" postId={news.id} />
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

export default Card2
