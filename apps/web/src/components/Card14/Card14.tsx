import React, { FC } from 'react'
import { Avatar, Img } from 'ui'
import Link from 'next/link'
import PostType from '@/types/PostType'
import stringToSlug from '@/utils/stringToSlug'
import TopicBadgeList from '../TopicBadgeList/TopicBadgeList'

export interface Card14Props {
    className?: string
    post: PostType
    hoverClass?: string
    ratio?: string
}

const Card14: FC<Card14Props> = ({
    className = 'h-full',
    ratio = 'aspect-w-5 aspect-h-5',
    post,
    hoverClass = '',
}) => {
    post.created_at = new Date(
        post.created_at ? post.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div
            className={`Card14 relative flex flex-col group rounded-3xl overflow-hidden ${hoverClass} ${className}`}
        >
            <Link
                href={`/post/${stringToSlug(post.title)}/${post.id}`}
                className={`flex items-start relative w-full ${ratio}`}
            >
                <Img
                    alt="post"
                    containerClassName="absolute inset-0 overflow-hidden"
                    fill
                    className="object-cover w-full h-full rounded-3xl"
                    src={post.image}
                />
            </Link>

            <div className="absolute top-4 inset-x-4 sm:top-5 sm:inset-x-5">
                <TopicBadgeList
                    itemClass="px-3 py-[6px]"
                    topics={post.post_topics}
                    chars={23}
                />
            </div>

            <div className="dark absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 flex flex-col flex-grow">
                <h2 className="block text-base font-semibold text-white">
                    <Link
                        href={`/post/${stringToSlug(post.title)}/${post.id}`}
                        className="line-clamp-2"
                        title={post.title}
                    >
                        {post.title}
                    </Link>
                </h2>

                <div className="p-2 sm:p-2.5 mt-4 sm:mt-5 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-full flex items-center text-neutral-50 text-xs sm:text-sm font-medium">
                    <Link
                        href={`/author/${post.author.username}`}
                        className="relative flex items-center space-x-2"
                    >
                        <Avatar
                            radius="rounded-full"
                            containerClassName="ring-2 ring-white"
                            sizeClass="h-7 w-7 text-sm"
                            imgUrl={post.author.avatar}
                            userName={post.author.name}
                        />
                        <span className="block text-white truncate">
                            {post.author.name}
                        </span>
                    </Link>
                    <>
                        <span className=" mx-[6px]">·</span>
                        <span className=" font-normal truncate">
                            {post.created_at}
                        </span>
                    </>
                </div>
            </div>
        </div>
    )
}

export default Card14
