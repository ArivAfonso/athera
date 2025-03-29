import React, { useEffect, useState } from 'react'
import NewsFeaturedMedia from '@/components/PostFeaturedMedia/NewsFeaturedMedia'
import TopicBadgeList from '@/components/TopicBadgeList/TopicBadgeList'
import { Avatar, Img } from 'ui'
import NewsCardLikeAndComment from '../NewsCardLikeAndComment/NewsCardLikeAndComment'
import PostBookmark from '../PostBookmark/PostBookmark'
import NewsType from '@/types/NewsType'
import { SquareArrowOutUpRightIcon, XIcon } from 'lucide-react'
import WidgetSocialsFollow from '../WidgetSocialsFollow/WidgetSocialsFollow'
import { createClient } from '@/utils/supabase/client'
import CardTopic1 from '../CardTopic1/CardTopic1'
import Heading2 from '../Heading2/Heading2'
import NewsCardMeta from '../NewsCardMeta/NewsCardMeta'
import Link from 'next/link'
import Image from 'next/image'

const LazyNewsCommentSection = React.lazy(
    () =>
        // ...existing dynamic import handling...
        import('@/components/NewsCommentSection/NewsCommentSection')
)
const LazyRelatedNews = React.lazy(() => import('./RelatedNews'))

const NewsCommentSectionSkeleton = () => (
    <div className="animate-pulse">
        {/* Comment form skeleton */}
        <div className="flex items-start space-x-4 mb-8">
            <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="flex-1">
                <div className="h-24 rounded-xl bg-neutral-200 dark:bg-neutral-700"></div>
                <div className="mt-2 flex justify-end">
                    <div className="h-9 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                </div>
            </div>
        </div>

        {/* Comments list skeleton */}
        {[...Array(3)].map((_, index) => (
            <div
                key={index}
                className="flex items-start space-x-4 mb-5 pb-5 border-b border-neutral-200 dark:border-neutral-700"
            >
                <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                <div className="flex-1">
                    <div className="h-4 w-32 mb-2 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                    <div className="h-3 w-24 mb-3 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                    <div className="space-y-2">
                        <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                        <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-700 w-5/6"></div>
                    </div>
                    <div className="flex space-x-3 mt-3">
                        <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                        <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
)

const RelatedNewsSkeleton = () => (
    <div className="animate-pulse container pb-10">
        <div className="px-3">
            <div className="h-8 w-40 rounded bg-neutral-200 dark:bg-neutral-700 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="rounded-3xl overflow-hidden">
                        <div className="aspect-w-3 aspect-h-3 bg-neutral-200 dark:bg-neutral-700"></div>
                        <div className="p-4">
                            <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700 mb-3"></div>
                            <div className="h-5 rounded bg-neutral-200 dark:bg-neutral-700 mb-2"></div>
                            <div className="h-5 rounded bg-neutral-200 dark:bg-neutral-700 w-3/4 mb-3"></div>
                            <div className="flex items-center space-x-2">
                                <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                                <div className="h-3 w-3 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                                <div className="h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

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
    const [id, setId] = useState('')
    const [relatedNews, setRelatedNews] = useState<NewsType[]>([])
    const [authorNews, setAuthorNews] = useState<NewsType[]>([])

    news.created_at = new Date(
        news.created_at ? news.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    useEffect(() => {
        const supabase = createClient()
        const fetchUserData = async () => {
            const session = await supabase.auth.getUser()
            setId(session.data.user ? session.data.user.id : '')
        }
        const fetchRelatedNews = async () => {
            const { data, error } = await supabase.rpc('related_news', {
                news_id: news.id,
                match_threshold: 0.1,
                match_count: 5,
            })

            if (error) {
                console.error('Error fetching news:', error)
                return []
            }

            setRelatedNews(data as unknown as NewsType[])
        }
        const fetchAuthorNews = async () => {
            const { data, error } = await supabase
                .from('news')
                .select(
                    `
                    id,
                    title,
                    created_at,
                    description,
                    link,
                    summary,
                    author,
                    image,
                    source(
                        id,
                        name,
                        url,
                        image
                    ),
                    likeCount:likes(count),
                    commentCount:comments(count),
                    news_topics(topic:topics(id,name,color))
                    `
                )
                .eq('author', news.author)
                .neq('id', news.id)
                .eq('source', news.source.id)
                .order('created_at', { ascending: false })
                .range(0, 4)

            if (error) {
                console.error('Error fetching news:', error)
                return []
            }

            setAuthorNews(data as unknown as NewsType[])
        }
        if (news.commentCount[0].count > 8) fetchRelatedNews()
        else if (news.commentCount[0].count > 16) fetchAuthorNews()

        fetchUserData()
    }, [])

    // useEffect(() => {
    //     if (show && localStorage.getItem('watch_history') != 'false' && id) {
    //         const supabase = createClient()
    //         const upsertWatchHistory = async () => {
    //             const { error } = await supabase.from('watch_history').upsert(
    //                 {
    //                     user_id: id,
    //                     news: news.id,
    //                     watched_at: new Date().toISOString(),
    //                 },
    //                 { onConflict: 'user_id, news' }
    //             )
    //             if (error) {
    //                 console.error('Error updating watch history:', error)
    //             }
    //         }
    //         upsertWatchHistory()
    //     }
    // }, [show, id])

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

                            <h1
                                className={`text-neutral-900 font-semibold text-3xl md:text-4xl md:!leading-[120%] lg:text-5xl dark:text-neutral-100 max-w-4xl`}
                                title={news.title}
                            >
                                {news.title}
                            </h1>

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

                            {/* News Comment Section Lazy Load */}
                            <div className="mt-8">
                                <React.Suspense
                                    fallback={<NewsCommentSectionSkeleton />}
                                >
                                    <LazyNewsCommentSection
                                        newsId={news.id}
                                        currentUserID={id}
                                    />
                                </React.Suspense>
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
                                        <span className="block text-sm text-neutral-900 dark:text-neutral-100">
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
                            {news.commentCount[0].count > 4 && (
                                <div
                                    className={`nc-WidgetCategories rounded-3xl overflow-hidden border border-neutral-100 dark:border-neutral-700`}
                                >
                                    <Heading2 title="🧬 News Topics" />

                                    <div className="flow-root">
                                        <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
                                            {news.news_topics.map(
                                                (category) => (
                                                    <CardTopic1
                                                        className="p-4 xl:p-5 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                                        key={category.topic.id}
                                                        //@ts-ignore
                                                        topic={category.topic}
                                                        size="normal"
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {news.commentCount[0].count > 8 && (
                                <div
                                    className={`nc-WidgetPosts rounded-3xl overflow-hidden max-w-72 border border-neutral-100 dark:border-neutral-700`}
                                >
                                    <Heading2 title="🧬 Related News" />
                                    <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
                                        {relatedNews.map((item) => (
                                            <div
                                                className={`relative p-3 flex flex-row justify-between items-center`}
                                                key={item.id}
                                            >
                                                <Link
                                                    href={item.link}
                                                    className="absolute inset-0"
                                                    title={item.title}
                                                ></Link>
                                                <div className="relative space-y-2">
                                                    <NewsCardMeta
                                                        meta={{
                                                            ...item,
                                                            author: '',
                                                        }}
                                                    />
                                                    <h2 className="nc-card-title block text-sm sm:text-base font-medium sm:font-semibold text-neutral-900 dark:text-neutral-100">
                                                        <Link
                                                            href={item.link}
                                                            className="line-clamp-2"
                                                            title={item.title}
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    </h2>
                                                </div>

                                                <Link
                                                    href={item.link}
                                                    title={item.title}
                                                    className={`block w-20 flex-shrink-0 relative rounded-lg overflow-hidden z-0 ms-4 group`}
                                                >
                                                    <div
                                                        className={`w-full h-0 aspect-w-1 aspect-h-1`}
                                                    >
                                                        <Img
                                                            alt="featured"
                                                            sizes="100px"
                                                            className="object-cover w-full h-full group-hover:scale-110 transform transition-transform duration-300"
                                                            src={item.image}
                                                            fill
                                                            title={item.title}
                                                        />
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {news.commentCount[0].count > 16 && (
                                <div
                                    className={`nc-WidgetPosts rounded-3xl overflow-hidden max-w-72 border border-neutral-100 dark:border-neutral-700`}
                                >
                                    <Heading2 title="🧬 More News from this Author" />
                                    <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
                                        {authorNews.map((item) => (
                                            <div
                                                className={`relative p-3 flex flex-row justify-between items-center`}
                                                key={item.id}
                                            >
                                                <Link
                                                    href={item.link}
                                                    className="absolute inset-0"
                                                    title={item.title}
                                                ></Link>
                                                <div className="relative space-y-2">
                                                    <NewsCardMeta
                                                        meta={{
                                                            ...item,
                                                            author: '',
                                                        }}
                                                    />
                                                    <h2 className="nc-card-title block text-sm sm:text-base font-medium sm:font-semibold text-neutral-900 dark:text-neutral-100">
                                                        <Link
                                                            href={item.link}
                                                            className="line-clamp-2"
                                                            title={item.title}
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    </h2>
                                                </div>

                                                <Link
                                                    href={item.link}
                                                    title={item.title}
                                                    className={`block w-20 flex-shrink-0 relative rounded-lg overflow-hidden z-0 ms-4 group`}
                                                >
                                                    <div
                                                        className={`w-full h-0 aspect-w-1 aspect-h-1`}
                                                    >
                                                        <Img
                                                            alt="featured"
                                                            sizes="100px"
                                                            className="object-cover w-full h-full group-hover:scale-110 transform transition-transform duration-300"
                                                            src={item.image}
                                                            fill
                                                            title={item.title}
                                                        />
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Added related posts slider */}
                    <React.Suspense fallback={<RelatedNewsSkeleton />}>
                        <LazyRelatedNews id={news.id} authorId={news.author} />
                    </React.Suspense>
                </div>
            </div>
        </div>
    )
}

export default NewsDetailModal
