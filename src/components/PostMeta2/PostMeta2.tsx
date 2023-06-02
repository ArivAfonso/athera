import React, { FC } from 'react'
import Avatar from '@/components/Avatar/Avatar'
import Link from 'next/link'
import AuthorType from '@/types/AuthorType'
import CategoryType from '@/types/CategoryType'
import { sanityClient } from '@/lib/sanityClient'
import imageUrlBuilder from '@sanity/image-url'

function urlFor(source: any) {
    return imageUrlBuilder(sanityClient).image(source)
}

export interface PostMeta2Props {
    className?: string
    author: AuthorType
    publishedAt: string
    estimatedReadingTime: number
    hiddenCategories?: boolean
    size?: 'large' | 'normal'
    avatarRounded?: string
}

const PostMeta2: FC<PostMeta2Props> = ({
    className = 'leading-none',
    author,
    publishedAt,
    estimatedReadingTime,
    size = 'normal',
    avatarRounded,
}) => {
    return (
        <div
            className={`nc-PostMeta2 flex items-center flex-wrap text-neutral-700 text-left dark:text-neutral-200 ${
                size === 'normal' ? 'text-xs' : 'text-sm'
            } ${className}`}
        >
            <Link
                href={`/author/${encodeURIComponent(author.slug.current)}`}
                className="flex items-center space-x-2"
            >
                <Avatar
                    radius={avatarRounded}
                    sizeClass={
                        size === 'normal'
                            ? 'h-6 w-6 text-sm'
                            : 'h-10 w-10 sm:h-11 sm:w-11 text-xl'
                    }
                    imgUrl={urlFor(author.image.asset._ref).url()}
                    userName={author.name}
                />
            </Link>
            <div className="ml-3">
                <div className="flex items-center">
                    <Link
                        href={`/author/${encodeURIComponent(
                            author.slug.current
                        )}`}
                        className="block font-semibold"
                    >
                        {author.name}
                    </Link>
                </div>
                <div className="text-xs mt-[6px]">
                    <span className="text-neutral-700 dark:text-neutral-300">
                        {publishedAt}
                    </span>
                    <span className="mx-2 font-semibold">·</span>
                    <span className="text-neutral-700 dark:text-neutral-300">
                        {estimatedReadingTime} min read
                    </span>
                </div>
            </div>
        </div>
    )
}

export default PostMeta2
