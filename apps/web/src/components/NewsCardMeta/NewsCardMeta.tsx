import React, { FC } from 'react'
import { Avatar } from 'ui'
import SourceType from '@/types/SourceType'
import VerifyIcon from '../VerifyIcon'
import Link from 'next/link'

export interface NewsCardMetaProps {
    className?: string
    meta: {
        created_at: string
        source: SourceType
        author?: string // Simple author string with no link
    }
    hiddenAvatar?: boolean
    avatarSize?: string
}

const NewsCardMeta: FC<NewsCardMetaProps> = ({
    className = 'leading-none text-xs',
    meta,
    hiddenAvatar = false,
    avatarSize = 'h-8 w-8 text-sm',
}) => {
    const { created_at, source, author } = meta

    const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    if (!source) {
        return <div>No source information</div>
    } else {
        return (
            <div
                className={`NewsCardMeta inline-flex items-center flex-wrap text-neutral-800 dark:text-neutral-200 ${className}`}
            >
                {!hiddenAvatar && (
                    <div className="flex items-center">
                        <Avatar
                            radius="rounded-full"
                            sizeClass={avatarSize}
                            imgUrl={source.image}
                            userName={source.name}
                        />
                    </div>
                )}
                <div className="pl-2 flex flex-col justify-center">
                    <div className="flex items-center space-x-2 line-clamp-1">
                        {source.id ? (
                            <Link
                                href={`/source/${source.id}`}
                                title={`View ${source.name} source profile`}
                            >
                                <span className="block text-neutral-700 dark:text-neutral-300 font-medium hover:underline">
                                    {source.name || 'Unknown Source'}
                                </span>
                            </Link>
                        ) : (
                            <span className="block text-neutral-700 dark:text-neutral-300 font-medium">
                                {source.name || 'Unknown Source'}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center text-neutral-500 dark:text-neutral-400 font-normal">
                        <span>{formattedDate}</span>
                        {author && (
                            <>
                                <span className="mx-1">•</span>
                                <span>{author}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default NewsCardMeta
