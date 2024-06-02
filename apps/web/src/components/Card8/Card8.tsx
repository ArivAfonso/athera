import React, { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PostType from '@/types/PostType'
import TopicBadgeList from '../TopicBadgeList/TopicBadgeList'
import stringToSlug from '@/utils/stringToSlug'

export interface Card8Props {
    className?: string
    post: PostType
}

const Card8: FC<Card8Props> = ({ className = 'h-full', post }) => {
    const { title, id, image, description, post_topics } = post

    return (
        <div
            className={`Card8 group relative rounded-3xl overflow-hidden z-0 ${className}`}
        >
            <Link
                href={`/post/${stringToSlug(post.title)}/${post.id}`}
                className="block w-full h-0 pt-[100%] sm:pt-[55%] rounded-xl overflow-hidden z-0"
            >
                <Image
                    className="object-cover"
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 600px) 480px, 800px"
                />
            </Link>
            <div className="absolute inset-0 bg-gradient-to-t from-black opacity-0 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                    href={`/post/${stringToSlug(post.title)}/${post.id}`}
                    className="absolute inset-0"
                />
                <TopicBadgeList topics={post_topics} />
                <h2
                    className={`mt-3 relative block font-semibold text-neutral-50 text-lg sm:text-2xl`}
                >
                    <Link
                        href={`/post/${stringToSlug(post.title)}/${post.id}`}
                        className="line-clamp-3"
                        title={title}
                    >
                        {title}
                    </Link>
                </h2>
                <div className="hidden sm:block mt-2">
                    <span className="text-neutral-300 text-sm line-clamp-1">
                        {description}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Card8
