'use client'

import React, { FC, useState } from 'react'
import CategoryBadgeList from '@/components/CategoryBadgeList/CategoryBadgeList'
import PostCardMeta from '@/components/PostCardMeta/PostCardMeta'
import PostFeaturedMedia from '@/components/PostFeaturedMedia/PostFeaturedMedia'
import Link from 'next/link'
import PostType from '@/types/PostType'
import PostCardLikeAndComment from '../PostCardLikeAndComment/PostCardLikeAndComment'
import PostBookmark from '../PostBookmark/PostBookmark'
import stringToSlug from '@/utils/stringToSlug'
import Tilt from 'react-parallax-tilt'
import { getCookie } from 'cookies-next'
import NcDropDown, { NcDropDownItem } from '@/components/NcDropDown/NcDropDown'

export interface Card11Props {
    className?: string
    post: PostType
    ratio?: string
    hiddenAuthor?: boolean
}

const Card11: FC<Card11Props> = ({
    className = 'h-full',
    post,
    hiddenAuthor = false,
    ratio = 'aspect-w-4 aspect-h-3',
}) => {
    const [isHover, setIsHover] = useState(false)
    const [dropdownVisible, setDropdownVisible] = useState(false)

    post.created_at = new Date(
        post.created_at ? post.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const tilt = getCookie('parallaxTiltEnabled')

    const hanldeClickDropDown = async (item: any) => {
        // if (item.id === 'reply') {
        //     return openReplyForm()
        // }
        // if (item.id === 'edit') {
        //     // Check if the commenter's ID matches the current user's ID before allowing edit
        //     if (commenter.id === currentUserID) {
        //         return openModalEditComment()
        //     }
        // }
        // if (item.id === 'report') {
        //     return openModalReportComment()
        // }
        // if (item.id === 'delete') {
        //     // Check if the commenter's ID matches the current user's ID before allowing delete
        //     if (commenter.id === currentUserID) {
        //         return openModalDeleteComment()
        //     }
        // }
    }

    const actions: any[] = [
        {
            id: 'reply',
            name: 'Reply',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>`,
        },
    ]

    return (
        <Tilt tiltEnable={tilt === 'true'}>
            <div
                className={`nc-Card11 relative flex flex-col group rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 ${className}`}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                //
            >
                <div
                    className={`block flex-shrink-0 relative w-full rounded-t-3xl overflow-hidden z-10 ${ratio}`}
                >
                    <div>
                        <PostFeaturedMedia post={post} isHover={isHover} />
                    </div>
                </div>
                <button
                    className="absolute top-0 right-0 m-2 z-50"
                    onMouseEnter={() => setDropdownVisible(true)}
                    onMouseLeave={() => setDropdownVisible(false)}
                >
                    {isHover && (
                        <div className="absolute -right-1 -top-1">
                            <NcDropDown
                                className={`p-2 text-white flex items-center justify-center rounded-lg hover:text-neutral-200`}
                                data={actions}
                                panelMenusClass="origin-right -right-1"
                                onClick={hanldeClickDropDown}
                            />
                        </div>
                    )}
                </button>
                <Link
                    href={`/post/${stringToSlug(post.title)}/${post.id}`}
                    className="absolute inset-0"
                ></Link>
                <span className="absolute top-3 inset-x-3 z-10">
                    <CategoryBadgeList
                        chars={26}
                        categories={post.post_categories}
                    />
                </span>

                <div className="p-4 flex flex-col space-y-3">
                    {!hiddenAuthor ? (
                        <PostCardMeta meta={post} />
                    ) : (
                        <span className="text-xs text-neutral-500">
                            {post.created_at}
                        </span>
                    )}
                    <h3 className="card-title block text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        <span className="line-clamp-2" title={post.title}>
                            {post.title}
                        </span>
                    </h3>
                    <div className="flex items-end justify-between mt-auto">
                        <PostCardLikeAndComment
                            likes={post.likeCount[0].count}
                            comments={post.commentCount[0].count}
                            id={post.id}
                            className="relative"
                        />
                        <PostBookmark className="relative" postId={post.id} />
                    </div>
                </div>
            </div>
        </Tilt>
    )
}

export default Card11
