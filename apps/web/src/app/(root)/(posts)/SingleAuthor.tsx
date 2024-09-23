import { Avatar } from 'ui'
import AuthorType from '@/types/AuthorType'
import Link from 'next/link'
import React, { FC } from 'react'
import { UrlObject } from 'url'

export interface SingleAuthorProps {
    author: AuthorType
}

const SingleAuthor: FC<SingleAuthorProps> = ({ author }) => {
    return (
        <div className="SingleAuthor flex">
            <Link
                href={`/author/${author.username}`}
                as={('/author/' + author.username) as unknown as UrlObject}
            >
                <Avatar
                    imgUrl={author.avatar}
                    userName={author.name}
                    sizeClass="h-12 w-12 text-lg sm:text-xl sm:h-24 sm:w-24"
                />
            </Link>
            <div className="flex flex-col ml-3 max-w-lg sm:ml-5">
                <span className="text-xs text-neutral-400 uppercase tracking-wider">
                    WRITTEN BY
                </span>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                    <Link href={`/author/${author.username}`}>
                        {author.name}
                    </Link>
                </h2>
                <span className="block mt-1 text-sm text-neutral-500 sm:text-base dark:text-neutral-300">
                    {author.bio}
                    <Link
                        className="text-primary-6000 font-medium ml-1"
                        href={`/author/${author.username}`}
                    >
                        Read more
                    </Link>
                </span>
            </div>
        </div>
    )
}

export default SingleAuthor
