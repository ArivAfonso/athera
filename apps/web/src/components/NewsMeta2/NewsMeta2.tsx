import React, { FC } from 'react'
import { Avatar } from 'ui'
import Link from 'next/link'
import AuthorType from '@/types/AuthorType'

export interface NewsMeta2Props {
    className?: string
    reporter: AuthorType
    publishedAt: string
    estimatedReadingTime: number
    hiddenTopics?: boolean
    size?: 'large' | 'normal'
    avatarRounded?: string
}

const NewsMeta2: FC<NewsMeta2Props> = ({
    className = 'leading-none',
    reporter,
    publishedAt,
    estimatedReadingTime,
    size = 'normal',
    avatarRounded,
}) => {
    return (
        <div
            className={`NewsMeta2 flex items-center flex-wrap text-neutral-700 text-left dark:text-neutral-200 ${
                size === 'normal' ? 'text-xs' : 'text-sm'
            } ${className}`}
        >
            <Link
                href={`/reporter/${reporter.username}`}
                className="flex items-center space-x-2"
            >
                <Avatar
                    radius={avatarRounded}
                    sizeClass={
                        size === 'normal'
                            ? 'h-6 w-6 text-sm'
                            : 'h-10 w-10 sm:h-11 sm:w-11 text-xl'
                    }
                    imgUrl={reporter.avatar}
                    userName={reporter.name}
                />
            </Link>
            <div className="ml-3">
                <div className="flex items-center">
                    <Link
                        href={`/reporter/${reporter.username}`}
                        className="block font-semibold"
                    >
                        {reporter.name}
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

export default NewsMeta2
