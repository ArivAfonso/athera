import React, { FC, useState } from 'react'
import PostBookmark from '@/components/PostBookmark/PostBookmark'
import PostCardLikeAndComment from '@/components/PostCardLikeAndComment/PostCardLikeAndComment'
import TopicBadgeList from '@/components/TopicBadgeList/TopicBadgeList'
import Link from 'next/link'
import Image from 'next/image'
import NewsType from '@/types/NewsType'
import stringToSlug from '@/utils/stringToSlug'
import { DropDown } from 'ui'
import ModalReportItem from '../ModalReportItem/ModalReportItem'
import ModalHidePost from '../PostActionDropdown/ModalHidePost'

export interface NewsCardLongProps {
    className?: string
    ratio?: string
    news: NewsType
    hoverClass?: string
    hiddenSource?: boolean
    onHideNews: (newsId: string) => void
    watchOption?: boolean
    onRemoveWatchlist?: (newsId: string) => void
    hover?: boolean
}

const NewsCardLong: FC<NewsCardLongProps> = ({
    className = 'h-full',
    ratio = 'aspect-w-3 aspect-h-3 sm:aspect-h-4',
    news,
    hoverClass = '',
    hover = false,
    onHideNews,
    onRemoveWatchlist,
    hiddenSource = false,
}) => {
    news.created_at = new Date(
        news.created_at ? news.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    const imageUrl = news.image

    const [isCopied, setIsCopied] = useState(false)
    const [isReporting, setIsReporting] = useState(false)
    const [showModalHideNews, setShowModalHideNews] = useState(false)

    const openModalReportNews = () => setIsReporting(true)
    const closeModalReportNews = () => setIsReporting(false)

    const openModalHideNews = () => setShowModalHideNews(true)
    const onCloseModalHideNews = () => setShowModalHideNews(false)

    const handleClickDropDown = async (item: any) => {
        if (item.id === 'copylink') {
            // Use the actual news link instead of internal route
            navigator.clipboard.writeText(news.link || window.location.href)
            setIsCopied(true)
            setTimeout(() => {
                setIsCopied(false)
            }, 1000)
            return
        }
        if (item.id === 'reportThisArticle') {
            return openModalReportNews()
        }
        if (item.id === 'hideThisSource') {
            return openModalHideNews()
        }
        if (item.id === 'removefromWatchlist' && onRemoveWatchlist) {
            onRemoveWatchlist(news.id)
        }
    }

    const handleHideNews = (newsId: string) => {
        onHideNews(newsId)
        setShowModalHideNews(false)
    }

    let actions: any[] = [
        {
            id: 'copylink',
            name: 'Copy link',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
        </svg>`,
        },
        {
            id: 'hideThisSource',
            name: 'Hide this news',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>`,
        },
        {
            id: 'reportThisArticle',
            name: 'Report this news',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
          </svg>
          `,
        },
    ]

    const renderMeta = () => {
        return (
            <div className="inline-flex items-center text-xs text-neutral-300">
                <div className="block ">
                    <h2 className="block text-base sm:text-lg font-semibold text-white ">
                        <span className="line-clamp-2" title={news.title}>
                            {news.title}
                        </span>
                    </h2>
                    <Link
                        href={`/source/${news.source?.id || ''}`}
                        className="flex mt-2.5 relative"
                    >
                        <span className="block text-neutral-200 hover:text-white font-medium truncate">
                            {news.source?.name || 'Unknown Source'}
                        </span>
                        <span className="mx-[6px] font-medium">·</span>
                        <span className="font-normal truncate">
                            {news.created_at}
                        </span>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div
            className={`NewsCardLong relative flex flex-col group rounded-3xl overflow-hidden z-0 ${hoverClass} ${className}`}
        >
            <div
                className={`absolute inset-x-0 top-0 p-3 flex items-center justify-start transition-all opacity-0 z-[-1] group-hover:opacity-100 group-hover:z-10 duration-300 ${hover ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''}`}
            >
                <PostCardLikeAndComment
                    likes={news.likeCount[0]?.count || 0}
                    comments={news.commentCount[0]?.count || 0}
                    id={news.id}
                    className="relative"
                />
                <PostBookmark className="relative pl-12" postId={news.id} />
            </div>
            <div className={`flex items-start relative w-full ${ratio}`}></div>
            <a href={news.link} target="_blank" rel="noopener noreferrer">
                <Image
                    fill
                    alt=""
                    className="object-cover w-full h-full rounded-3xl"
                    src={imageUrl}
                    sizes="(max-width: 600px) 480px, 500px"
                />
                <span className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </a>
            <div
                className={`${hover ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''}`}
            >
                <a
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black opacity-50"
                ></a>
                <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col flex-grow items-start">
                    <a
                        href={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0"
                    ></a>
                    <div className="mb-3 left-3">
                        <TopicBadgeList chars={29} topics={news.news_topics} />
                    </div>
                    {renderMeta()}
                </div>
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
    )
}

export default NewsCardLong
