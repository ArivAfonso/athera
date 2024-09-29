import React, { FC } from 'react'
import PostBookmark from '@/components/PostBookmark/PostBookmark'
import SocialsShare from '@/components/SocialsShare/SocialsShare'
import PostCardLikeAndComment from '@/components/PostCardLikeAndComment/PostCardLikeAndComment'
import TopicBadgeList from '@/components/TopicBadgeList/TopicBadgeList'
import Link from 'next/link'
import Image from 'next/image'
import PostCardMeta from '../PostCardMeta/PostCardMeta'
import PostType from '@/types/PostType'

export interface Card2Props {
    className?: string
    post: PostType
    size?: 'normal' | 'large'
}

const Card2: FC<Card2Props> = ({
    className = 'h-full',
    size = 'normal',
    post,
}) => {
    post.created_at = new Date(
        post.created_at ? post.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className={`Card2 group relative flex flex-col ${className}`}>
            <div className="block flex-shrink-0 flex-grow relative w-full h-0 pt-[75%] sm:pt-[55%] z-0">
                <Image
                    fill
                    sizes="(max-width: 600px) 480px, 800px"
                    className="object-cover rounded-3xl"
                    src={post.image}
                    alt={post.title}
                />
                <TopicBadgeList
                    className="flex flex-wrap space-x-2 absolute top-3 left-3"
                    itemClass="relative"
                    topics={post.post_topics}
                />
            </div>

            {/* <SocialsShare className="absolute hidden md:grid gap-[5px] right-4 top-4 opacity-0 z-[-1] group-hover:z-10 group-hover:opacity-100 transition-opacity duration-300" /> */}
            <Link href={`/post/${post.title}/${post.id}`} />

            <div className="mt-5 px-4 flex flex-col">
                <div className="space-y-3">
                    <PostCardMeta
                        className="relative text-sm"
                        avatarSize="h-8 w-8 text-sm"
                        meta={post}
                    />

                    <h2
                        className={`card-title block font-semibold text-neutral-900 dark:text-neutral-100 ${
                            size === 'large'
                                ? 'text-base sm:text-lg md:text-xl'
                                : 'text-base'
                        }`}
                    >
                        <Link
                            href={`/post/${post.title}/${post.id}`}
                            className="line-clamp-2"
                            title={post.title}
                        >
                            {post.title}
                        </Link>
                    </h2>
                </div>
                <div className="my-5 border-t border-neutral-200 dark:border-neutral-700"></div>
            </div>
        </div>
    )
}

export default Card2
