import React, { FC } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Avatar } from 'ui'
import Link from 'next/link'
import AuthorType from '@/types/AuthorType'

export interface CardAuthorBoxProps {
    className?: string
    author: AuthorType
}

const CardAuthorBox: FC<CardAuthorBoxProps> = ({ className = '', author }) => {
    return (
        <Link
            href={`/author/${author.username}`}
            className={`CardAuthorBox2 flex flex-col items-center overflow-hidden bg-white dark:bg-neutral-800 rounded-3xl ${className}`}
        >
            <div className="mt-6">
                <Avatar
                    sizeClass="w-20 h-20 text-2xl"
                    radius="rounded-full"
                    imgUrl={author.avatar}
                    userName={author.name}
                />
            </div>
            <div className="mt-3 text-center">
                <h2 className={`text-base font-medium`}>
                    <span className="line-clamp-1">{author.name}</span>
                </h2>
                <span
                    className={`block mt-1 text-sm text-neutral-500 dark:text-neutral-400`}
                >
                    @{author.username}
                </span>
            </div>
            <div className="py-2 px-4 mb-2 mt-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center leading-none text-xs font-medium">
                {author.postCount ? author.postCount[0].count : 0}{' '}
                <ArrowRightIcon className="w-5 h-5 text-yellow-600 ml-3" />
            </div>
        </Link>
    )
}

export default CardAuthorBox
