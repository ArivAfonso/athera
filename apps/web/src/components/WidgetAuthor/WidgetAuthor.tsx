'use client'

import { Avatar } from 'ui'
import AuthorType from '@/types/AuthorType'
import Link from 'next/link'
import React, { FC } from 'react'
import { UrlObject } from 'url'
import FollowButton from '../FollowButton'

export interface AuthorWidgetProps {
    author: AuthorType
}

const AuthorWidget: FC<AuthorWidgetProps> = ({ author }) => {
    return (
        <div className="AuthorWidget p-4 rounded-3xl border border-neutral-100 dark:border-neutral-700 flex flex-col items-center text-center">
            <div className="flex items-center w-full">
                <Link
                    href={`/author/${author.username}`}
                    as={('/author/' + author.username) as unknown as UrlObject}
                >
                    <Avatar
                        imgUrl={author.avatar}
                        userName={author.name}
                        sizeClass="h-12 w-12 text-lg sm:text-xl sm:h-12 sm:w-12"
                    />
                </Link>
                <div className="ml-4 text-left">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                        <Link href={`/author/${author.username}`}>
                            {author.name}
                        </Link>
                    </h2>
                    <span className="text-sm text-neutral-500 dark:text-neutral-300">
                        Joined on{' '}
                        {author.created_at
                            ? new Date(author.created_at).toLocaleDateString()
                            : 'N/A'}
                    </span>
                </div>
            </div>
            <div className="mt-4 flex justify-between w-full">
                <div className="text-center">
                    <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                        {author.followerCount}
                    </span>
                    <span className="block text-sm text-neutral-500 dark:text-neutral-300">
                        Followers
                    </span>
                </div>
                <div className="text-center">
                    <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                        {author.followingCount}
                    </span>
                    <span className="block text-sm text-neutral-500 dark:text-neutral-300">
                        Following
                    </span>
                </div>
                <div className="text-center">
                    <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                        {author.postCount ? author.postCount[0].count : '0'}
                    </span>
                    <span className="block text-sm text-neutral-500 dark:text-neutral-300">
                        Posts
                    </span>
                </div>
            </div>
            <div className="mt-4 w-[50%] mx-auto">
                <FollowButton
                    authorId={author.id}
                    className="w-full"
                    sizeClass="py-2 px-4 text-sm"
                />
            </div>
            <div className="mt-4 text-left w-full">
                <span className="block text-sm text-neutral-500 dark:text-neutral-300">
                    {author.bio}
                    {author.bio && (
                        <Link
                            className="text-primary-6000 font-medium ml-1"
                            href={`/author/${author.username}`}
                        >
                            Read more
                        </Link>
                    )}
                </span>
            </div>
        </div>
    )
}

export default AuthorWidget
