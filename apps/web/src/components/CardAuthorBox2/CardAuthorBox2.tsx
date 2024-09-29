import React, { FC } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Avatar, Img } from 'ui'
import Link from 'next/link'
import AuthorType from '@/types/AuthorType'

export interface CardAuthorBox2Props {
    className?: string
    author: AuthorType
}

const CardAuthorBox2: FC<CardAuthorBox2Props> = ({
    className = '',
    author,
}) => {
    return (
        <Link
            href={`/author/${author.username}`}
            className={`CardAuthorBox2 flex flex-col overflow-hidden bg-white dark:bg-neutral-800 rounded-3xl ${className}`}
        >
            <div className="relative">
                <div>
                    <Img
                        alt="author"
                        containerClassName="flex aspect-w-7 aspect-h-5 w-full h-0"
                        src={author.avatar || ''}
                        fill
                        sizes="(max-width: 600px) 480px, (max-width: 1024px) 768px, 1000px"
                    />
                </div>
                <div className="absolute top-3 inset-x-3 flex">
                    <div className=" py-1 px-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center leading-none text-xs font-medium">
                        {author.postCount ? author.postCount[0].count : 0}{' '}
                        <ArrowRightIcon className="w-5 h-5 text-yellow-600 ml-3" />
                    </div>
                </div>
            </div>

            <div className="-mt-8 m-8 text-center">
                <Avatar
                    containerClassName="ring-2 ring-white"
                    sizeClass="w-16 h-16 text-2xl"
                    radius="rounded-full"
                    imgUrl={author.avatar}
                    userName={author.name}
                />
                <div className="mt-3">
                    <h2 className={`text-base font-medium`}>
                        <span className="line-clamp-1">{author.name}</span>
                    </h2>
                    <span
                        className={`block mt-1 text-sm text-neutral-500 dark:text-neutral-400`}
                    >
                        @{author.username}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default CardAuthorBox2
