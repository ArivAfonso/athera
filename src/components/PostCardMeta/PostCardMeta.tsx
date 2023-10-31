import React, { FC } from 'react'
import Avatar from '@/components/Avatar/Avatar'
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
    avatarSize = 'h-7 w-7 text-sm',
}) => {
    const { created_at, author } = meta
    if (author.avatar === undefined) {
        return <h1>undefined</h1>
    } else {
        return (
            <div
                className={`nc-PostCardMeta inline-flex items-center flex-wrap text-neutral-800 dark:text-neutral-200 ${className}`}
            >
                <Link
                    href={`/author/${author.username}`}
                    className="relative flex items-center space-x-2"
                >
                    {!hiddenAvatar && (
                        <Avatar
                            radius="rounded-full"
                            sizeClass={avatarSize}
                            imgUrl={author.avatar}
                            userName={author.name}
                        />
                    )}
                    <span className="block text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium">
                        {author.name}
                    </span>
                </Link>
                <>
                    {author.verified ? (
                        <VerifyIcon iconClass="w-4 h-4" />
                    ) : (
                        <> </>
                    )}
                    <span className="text-neutral-500 dark:text-neutral-400 mx-[6px] font-medium">
                        ·
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                        {created_at}
                    </span>
                </>
            </div>
        )
    }
}

export default PostCardMeta
