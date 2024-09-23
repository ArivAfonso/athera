import React, { FC } from 'react'
import { Avatar } from 'ui'
import Link from 'next/link'
import AuthorType from '@/types/AuthorType'

export interface CardAuthor2Props extends AuthorType {
    className?: string
    author: AuthorType
    readingTime?: number
    hoverReadingTime?: boolean
    date: string
}

const CardAuthor2: FC<CardAuthor2Props> = ({ className = '', author }) => {
    const avatar = author.avatar || ''
    return (
        <Link
            href={`/author/${author.username}`}
            className={`CardAuthor2 relative inline-flex items-center ${className}`}
        >
            <Avatar
                sizeClass="h-10 w-10 text-base"
                containerClassName="flex-shrink-0 mr-3"
                radius="rounded-full"
                imgUrl={avatar}
                userName={author.name}
            />
            <div>
                <h2
                    className={`text-sm text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium`}
                >
                    {author.name}
                </h2>
            </div>
        </Link>
    )
}

export default CardAuthor2
