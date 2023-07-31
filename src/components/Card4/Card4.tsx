import React, { FC } from 'react'
import PostCardSaveAction from '@/components/PostCardSaveAction/PostCardSaveAction'
import CardAuthor2 from '@/components/CardAuthor2/CardAuthor2'
import CategoryBadgeList from '@/components/CategoryBadgeList/CategoryBadgeList'
import Image from 'next/image'
import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '@/lib/sanityClient'
import PostType from '@/types/PostType'

function urlFor(source: any) {
    return imageUrlBuilder(sanityClient).image(source)
}

export interface Card4Props {
    className?: string
    post: PostType
}

const Card4: FC<Card4Props> = ({ className = 'h-full', post }) => {
    post.publishedAt = new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    const imageUrl = urlFor(post.mainImage.asset._ref).url()
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
                href={`/single/${encodeURIComponent(post.slug.current)}`}
                className="absolute inset-0"
            ></Link>

            <div className="p-4 flex flex-col flex-grow">
                <div className="space-y-2.5 mb-4">
                    <CategoryBadgeList categories={post.categories} />
                    <h2 className="nc-card-title block text-base font-semibold text-neutral-900 dark:text-neutral-100 ">
                        <Link
                            href={`/single/${encodeURIComponent(
                                post.slug.current
                            )}`}
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
                        date={post.publishedAt}
                        author={post.author}
                    />
                    <PostCardSaveAction hidenReadingTime />
                </div>
            </div>
        </div>
    )
}

export default Card4
