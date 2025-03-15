import React, { useState } from 'react'
import NewsFeaturedMedia from '@/components/PostFeaturedMedia/NewsFeaturedMedia'
import TopicBadgeList from '@/components/TopicBadgeList/TopicBadgeList'
import SingleTitle from '@/app/(root)/(posts)/SingleTitle'
import { Avatar } from 'ui'
import NewsCardLikeAndComment from '../NewsCardLikeAndComment/NewsCardLikeAndComment'
import PostBookmark from '../PostBookmark/PostBookmark'
import NewsType from '@/types/NewsType'
import { SquareArrowOutUpRightIcon, XIcon } from 'lucide-react'
import WidgetSocialsFollow from '../WidgetSocialsFollow/WidgetSocialsFollow'
import NewsCommentSection from '@/components/NewsCommentSection/NewsCommentSection'

interface NewsDetailModalProps {
    show: boolean
    news: NewsType
    onClose: () => void
}

const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
    show,
    news,
    onClose,
}) => {
    if (!show) return null

    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto hiddenScrollbar"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="flex min-h-screen items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="fixed inset-0 bg-black bg-opacity-75"
                    onClick={(e) => e.stopPropagation()}
                />

                <div
                    className="relative z-10 w-full max-w-6xl bg-white dark:bg-neutral-900 rounded-3xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with close and read article buttons */}
                    <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
                        <a
                            href={news.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white/80 dark:bg-neutral-800/80 rounded-full text-xs font-medium hover:bg-white dark:hover:bg-neutral-800 transition-colors flex items-center space-x-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span>Read article</span>
                            <SquareArrowOutUpRightIcon className="w-3 h-3" />
                        </a>
                        <button
                            className="p-2 bg-white/80 dark:bg-neutral-800/80 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 transition-colors focus:outline-none"
                            onClick={onClose}
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Featured image */}
                    <div className="relative w-full h-80 view-transition">
                        <NewsFeaturedMedia news={news} isHover={false} />
                    </div>

                    {/* Content area */}
                    <div className="flex flex-col md:flex-row">
                        <div className="p-6 md:p-8 pt-6 flex-1">
                            {/* Topics */}
                            <div className="mb-4">
                                <TopicBadgeList
                                    topics={news.news_topics || []}
                                    className="flex flex-wrap gap-2"
                                    itemClass="text-sm"
                                />
                            </div>

                            <SingleTitle title={news.title} font="classic" />

                            {/* Mobile source info */}
                            <div className="flex items-center space-x-3 mt-6 mb-4 md:hidden">
                                <Avatar
                                    radius="rounded-full"
                                    sizeClass="h-10 w-10"
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
                                    <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                                        {news.source
                                            ? news.source.name
                                            : 'Unknown Source'}
                                    </span>
                                    <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                                        <span>{news.created_at}</span>
                                        {news.author && (
                                            <>
                                                <span className="mx-2">•</span>
                                                <span className="font-medium text-neutral-700 dark:text-neutral-300">
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

                            <div className="mt-6">
                                <p
                                    className={`text-base text-neutral-700 dark:text-neutral-300 leading-relaxed ${!isExpanded ? 'line-clamp-4 md:line-clamp-none' : ''}`}
                                >
                                    {news.summary}
                                </p>

                                {/* Only show read more/less button on mobile if summary is long enough */}
                                {news.summary && news.summary.length > 240 && (
                                    <button
                                        onClick={() =>
                                            setIsExpanded(!isExpanded)
                                        }
                                        className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 md:hidden"
                                    >
                                        {isExpanded ? 'Read less' : 'Read more'}
                                    </button>
                                )}
                            </div>

                            {/* Action bar */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                                <NewsCardLikeAndComment
                                    likes={news.likeCount?.[0]?.count || 0}
                                    comments={
                                        news.commentCount?.[0]?.count || 0
                                    }
                                    id={news.id}
                                    className="text-sm"
                                />
                                <PostBookmark postId={news.id} />
                            </div>

                            {/* News Comment Section */}
                            <div className="mt-8">
                                <NewsCommentSection
                                    newsId={news.id}
                                    currentUserID={
                                        '' /* pass current user id if available */
                                    }
                                />
                            </div>
                        </div>

                        <div className="md:flex flex-col gap-y-4 hidden m-6">
                            {/* Desktop source info */}
                            <div className="hidden md:block w-72 p-4 rounded-3xl border border-neutral-100 dark:border-neutral-700">
                                <div className="flex items-center w-full">
                                    <Avatar
                                        imgUrl={
                                            news.source
                                                ? news.source.image
                                                : undefined
                                        }
                                        userName={
                                            news.source
                                                ? news.source.name
                                                : 'Unknown Source'
                                        }
                                        sizeClass="h-12 w-12 text-lg"
                                        radius="rounded-full"
                                    />
                                    <div className="ml-4 text-left">
                                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                                            {news.source
                                                ? news.source.name
                                                : 'Unknown Source'}
                                        </h2>
                                        <span className="text-sm text-neutral-500 dark:text-neutral-300">
                                            Published on {news.created_at}
                                        </span>
                                    </div>
                                </div>

                                {news.author && (
                                    <div className="mt-4 text-left w-full">
                                        <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Author
                                        </span>
                                        <span className="block text-base text-neutral-900 dark:text-neutral-100">
                                            {news.author}
                                        </span>
                                    </div>
                                )}

                                {news.source && news.source.description && (
                                    <div className="mt-4 text-left w-full">
                                        <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            About the source
                                        </span>
                                        <span className="block text-sm text-neutral-500 dark:text-neutral-400 line-clamp-4">
                                            {news.source.description}
                                        </span>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <a
                                        href={news.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-2 px-4 text-sm text-center bg-primary-6000 hover:bg-primary-700 text-neutral-50 rounded-full font-medium transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Visit original article
                                    </a>
                                </div>
                            </div>
                            <div className="w-72">
                                <WidgetSocialsFollow news={news} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewsDetailModal
