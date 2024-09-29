import PostBookmark from '@/components/PostBookmark/PostBookmark'
import { Img } from 'ui'
import NextPrev from '@/components/NextPrev/NextPrev'
import PostCardLikeAndComment from '@/components/PostCardLikeAndComment/PostCardLikeAndComment'
import React, { FC } from 'react'
import CardAuthor2 from '@/components/CardAuthor2/CardAuthor2'
import TopicBadgeList from '@/components/TopicBadgeList/TopicBadgeList'
import Link from 'next/link'
import PostType from '@/types/PostType'

export interface CardLarge1Props {
    className?: string
    post: PostType
    onClickNext?: () => void
    onClickPrev?: () => void
}

const CardLarge1: FC<CardLarge1Props> = ({
    className = '',
    post,
    onClickNext = () => {},
    onClickPrev = () => {},
}) => {
    const imageUrl = post.image
    post.created_at = new Date(
        post.created_at ? post.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    return (
        <div
            className={`CardLarge1 nc-CardLarge1--hasAnimation relative flex flex-col-reverse md:flex-row justify-end ${className}`}
        >
            <div className="md:absolute z-10 md:left-0 md:top-1/2 md:-translate-y-1/2 w-full -mt-8 md:mt-0 px-3 sm:px-6 md:px-0 md:w-3/5 lg:w-1/2 xl:w-2/5">
                <div className="CardLarge1__left p-4 sm:p-8 xl:py-14 md:px-10 bg-white/40 dark:bg-neutral-900/40 backdrop-filter backdrop-blur-lg shadow-lg dark:shadow-2xl rounded-3xl space-y-3 sm:space-y-5 ">
                    <TopicBadgeList topics={post.post_topics} />

                    <h2 className="card-title text-base sm:text-xl lg:text-2xl font-semibold ">
                        <Link
                            href={`/post/${post.title}/${post.id}`}
                            className="line-clamp-2"
                            title={post.title}
                        >
                            {post.title}
                        </Link>
                    </h2>

                    <CardAuthor2
                        className="relative"
                        author={post.author}
                        readingTime={post.estimatedReadingTime}
                        date={post.created_at}
                        id={post.author.id}
                        name={post.author.name}
                        username={post.author.username}
                        avatar={post.author.avatar}
                    />

                    <div className="flex items-center justify-between mt-auto">
                        <PostCardLikeAndComment
                            likes={post.likeCount[0].count}
                            comments={post.commentCount[0].count}
                            id={post.id}
                            className="relative"
                        />
                        <PostBookmark
                            bookmarkClass="h-8 w-8 bg-neutral-50/30 hover:bg-neutral-50/50 dark:bg-neutral-800/30 dark:hover:bg-neutral-800/50"
                            className="relative"
                            postId={post.id}
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
                <Link
                    href={`/post/${post.title}/${post.id}`}
                    className="CardLarge1__right block relative"
                >
                    <Img
                        containerClassName="aspect-w-16 aspect-h-12 sm:aspect-h-9 md:aspect-h-14 lg:aspect-h-10 2xl:aspect-h-9 relative"
                        className="absolute inset-0 object-cover rounded-3xl"
                        src={imageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </Link>
            </div>
        </div>
    )
}

export default CardLarge1
