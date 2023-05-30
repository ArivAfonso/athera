import React, { FC } from 'react'
import Avatar from '@/components/Avatar/Avatar'
import Link from 'next/link'
import { Route } from '@/routers/types'
import { sanityClient } from '@/lib/sanityClient'
import imageUrlBuilder from '@sanity/image-url'

function urlFor(source: any) {
    return imageUrlBuilder(sanityClient).image(source)
}

interface PostDataType {
    title: string
    author: {
        name: string
        image: {
            asset: {
                _ref: string
                _type: string
            }
            _type: string
        }
        slug: {
            _type: string
            current: string
        }
    }
    publishedAt: string
    slug: {
            _type: string
            current: string
        }
    mainImage: {
        asset: {
            _ref: string
            _type: string
        }
        _type: string
    }
    categories: {
        title: string
        slug: {
            _type: string
            current: string
        }
        color: string
    }[]
}

export interface PostCardMetaProps {
    className?: string
    meta: Pick<PostDataType, 'publishedAt' | 'author'>
    hiddenAvatar?: boolean
    avatarSize?: string
}

const PostCardMeta: FC<PostCardMetaProps> = ({
    className = 'leading-none text-xs',
    meta,
    hiddenAvatar = false,
    avatarSize = 'h-7 w-7 text-sm',
}) => {
    const { publishedAt, author } = meta
    if (author.image === undefined) {
        return <h1>undefined</h1>
    } else {
        const imageUrl = urlFor(author.image.asset._ref).url()
        return (
            <div
                className={`nc-PostCardMeta inline-flex items-center flex-wrap text-neutral-800 dark:text-neutral-200 ${className}`}
            >
                <Link
                    href={`/author/${encodeURIComponent(author.slug.current)}`}
                    className="relative flex items-center space-x-2"
                >
                    {!hiddenAvatar && (
                        <Avatar
                            radius="rounded-full"
                            sizeClass={avatarSize}
                            imgUrl={imageUrl}
                            userName={author.name}
                        />
                    )}
                    <span className="block text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium">
                        {author.name}
                    </span>
                </Link>
                <>
                    <span className="text-neutral-500 dark:text-neutral-400 mx-[6px] font-medium">
                        ·
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                        {publishedAt}
                    </span>
                </>
            </div>
        )
    }
}

export default PostCardMeta
