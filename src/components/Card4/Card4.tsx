import React, { FC } from 'react'
import PostCardSaveAction from '@/components/PostCardSaveAction/PostCardSaveAction'
import CardAuthor2 from '@/components/CardAuthor2/CardAuthor2'
import CategoryBadgeList from '@/components/CategoryBadgeList/CategoryBadgeList'
import Image from 'next/image'
import Link from 'next/link'
import PostType from '@/types/PostType'

export interface Card4Props {
    className?: string
    post: PostType
}

const Card4: FC<Card4Props> = ({ className = 'h-full', post }) => {
    post.created_at = new Date(
        post.created_at ? post.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    const imageUrl = post.image
    return (
        <div
            className={`nc-Card4 relative flex flex-col group bg-white dark:bg-neutral-900 rounded-3xl ${className}`}
        >
            <span className="block flex-shrink-0 relative w-full aspect-w-16 aspect-h-9 rounded-t-xl overflow-hidden">
                <Image
                    fill
                    className="object-cover"
                    alt=""
                    sizes="(max-width: 600px) 480px, 800px"
                    src={imageUrl}
                />
            </span>

            <Link
                href={`/post/${post.title}/${post.id}`}
                className="absolute inset-0"
            ></Link>

            <div className="p-4 flex flex-col flex-grow">
                <div className="space-y-2.5 mb-4">
                    <CategoryBadgeList categories={post.categories} />
                    <h2 className="nc-card-title block text-base font-semibold text-neutral-900 dark:text-neutral-100 ">
                        <Link
                            href={`/post/${post.title}/${post.id}`}
                            className="line-clamp-2"
                            title={post.title}
                        >
                            {post.title}
                        </Link>
                    </h2>
                </div>
                <div className="flex items-end justify-between mt-auto">
                    <CardAuthor2
                        readingTime={post.estimatedReadingTime}
                        date={post.created_at}
                        author={post.author}
                    />
                    <PostCardSaveAction hidenReadingTime />
                </div>
            </div>
        </div>
    )
}

export default Card4
