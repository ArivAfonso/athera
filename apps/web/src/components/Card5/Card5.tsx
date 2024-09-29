import React, { FC } from 'react'
import CardAuthor2 from '@/components/CardAuthor2/CardAuthor2'
import TopicBadgeList from '@/components/TopicBadgeList/TopicBadgeList'
import Link from 'next/link'
import PostType from '@/types/PostType'

export interface Card5Props {
    className?: string
    post: PostType
}

const Card5: FC<Card5Props> = ({ className = '', post }) => {
    post.created_at = new Date(
        post.created_at ? post.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div
            className={`Card5 relative p-5 group border border-neutral-200 hover:shadow-lg transition-shadow dark:border-neutral-700 rounded-3xl bg-white dark:bg-neutral-900 ${className}`}
        >
            <Link
                href={`/post/${post.title}/${post.id}`}
                className="absolute inset-0 rounded-lg"
            ></Link>

            <div className="flex flex-col">
                <TopicBadgeList topics={post.post_topics} />
                <h2
                    className="block text-base font-semibold text-neutral-800 dark:text-neutral-300 my-4"
                    title={post.title}
                >
                    <Link
                        href={`/post/${post.title}/${post.id}`}
                        className="line-clamp-2"
                        title={post.title}
                    >
                        {post.title}
                    </Link>
                </h2>
                <CardAuthor2
                    className="relative mt-auto"
                    readingTime={post.estimatedReadingTime}
                    author={post.author}
                    date={post.created_at}
                    id={post.id}
                    name={post.author.name}
                    username={post.author.username}
                    avatar={post.author.avatar}
                />
            </div>
        </div>
    )
}

export default Card5
