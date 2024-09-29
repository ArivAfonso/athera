import React, { FC } from 'react'
import { Avatar } from 'ui'
import Link from 'next/link'
import { Route } from '@/routers/types'
import PostType from '@/types/PostType'
import VerifyIcon from '../VerifyIcon'

export interface PostCardMetaProps {
    className?: string
    meta: Pick<PostType, 'created_at' | 'author'>
    hiddenAvatar?: boolean
    avatarSize?: string
}

const PostCardMeta: FC<PostCardMetaProps> = ({
    className = 'leading-none text-xs',
    meta,
    hiddenAvatar = false,
    avatarSize = 'h-8 w-8 text-sm',
}) => {
    const { created_at, author } = meta
    if (!author) {
        return <h1>undefined</h1>
    } else {
        return (
            <div
                className={`PostCardMeta inline-flex items-center flex-wrap text-neutral-800 dark:text-neutral-200 ${className}`}
            >
                <div className="flex items-center">
                    <Avatar
                        radius="rounded-full"
                        sizeClass={avatarSize}
                        imgUrl={author.avatar}
                        userName={author.name}
                    />
                </div>
                <div className="pl-2 flex flex-col justify-center">
                    <div className="flex items-center space-x-2 line-clamp-1">
                        <Link
                            href={`/author/${author.username}`}
                            className="block text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium"
                        >
                            {author.name}
                        </Link>
                        {author.verified && <VerifyIcon iconClass="w-4 h-4" />}
                        <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                            ·
                        </span>
                        <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                            @{author.username}
                        </span>
                    </div>
                    <div className="text-neutral-500 pt-1 dark:text-neutral-400 font-normal">
                        {created_at}
                    </div>
                </div>
            </div>
        )
    }
}

export default PostCardMeta
