'use client'

import React, { FC, useState } from 'react'
import TopicBadgeList from '@/components/TopicBadgeList/TopicBadgeList'
import PostCardMeta from '@/components/PostCardMeta/PostCardMeta'
import PostFeaturedMedia from '@/components/PostFeaturedMedia/PostFeaturedMedia'
import Link from 'next/link'
import PostType from '@/types/PostType'
import PostCardLikeAndComment from '../PostCardLikeAndComment/PostCardLikeAndComment'
import PostBookmark from '../PostBookmark/PostBookmark'
import stringToSlug from '@/utils/stringToSlug'
import Tilt from 'react-parallax-tilt'
import { getCookie } from 'cookies-next'
import { DropDown, DropDownItem } from 'ui'
import ModalReportItem from '../ModalReportItem/ModalReportItem'
import ModalHidePost from '../PostActionDropdown/ModalHidePost'

export interface Card11Props {
    className?: string
    post: PostType
    ratio?: string
    hiddenAuthor?: boolean
    onHidePost: (postId: string) => void
    watchOption?: boolean
    onRemoveWatchlist?: (postId: string) => void
    innerRef?: any
}

const Card11: FC<Card11Props> = ({
    className = 'h-full',
    post,
    hiddenAuthor = false,
    watchOption = false,
    ratio = 'aspect-w-4 aspect-h-3',
    onHidePost,
    onRemoveWatchlist,
    innerRef,
}) => {
    const [isHover, setIsHover] = useState(false)
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isReporting, setIsReporting] = useState(false)
    const [showModalHidePost, setShowModalHidePost] = useState(false)

    const openModalReportPost = () => setIsReporting(true)
    const closeModalReportPost = () => setIsReporting(false)

    const openModalHidePost = () => setShowModalHidePost(true)
    const onCloseModalHidePost = () => setShowModalHidePost(false)

    post.created_at = new Date(
        post.created_at ? post.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const tilt = getCookie('parallaxTiltEnabled')

    const handleClickDropDown = async (item: any) => {
        if (item.id === 'copylink') {
            navigator.clipboard.writeText(
                `${window.location.origin}/post/${stringToSlug(post.title)}/${post.id}`
            )
            setIsCopied(true)
            setTimeout(() => {
                setIsCopied(false)
            }, 1000)
            return
        }
        if (item.id === 'reportThisArticle') {
            return openModalReportPost()
        }
        if (item.id === 'hideThisAuthor') {
            return openModalHidePost()
        }
        if (item.id === 'removefromWatchlist' && onRemoveWatchlist) {
            onRemoveWatchlist(post.id)
        }
    }

    const handleHidePost = (postId: string) => {
        onHidePost(postId)
        setShowModalHidePost(false)
    }

    let actions: any[] = [
        {
            id: 'copylink',
            name: 'Copy link',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
        </svg>`,
        },
        {
            id: 'hideThisAuthor',
            name: 'Hide this post',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>`,
        },
        {
            id: 'reportThisArticle',
            name: 'Report this post',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
          </svg>
          `,
        },
    ]

    if (watchOption) {
        actions.splice(1, 0, {
            id: 'removefromWatchlist',
            name: 'Remove from History',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          `,
        })
    }

    const renderMenu = () => {
        if (isCopied) {
            actions = actions.map((item) => {
                if (item.id !== 'copylink') return item
                return {
                    ...item,
                    name: 'Link Copied',
                }
            })
        }
        return (
            <button
                className="absolute top-0 right-0 m-2 z-50"
                onMouseEnter={() => setDropdownVisible(true)}
                onMouseLeave={() => setDropdownVisible(false)}
            >
                {isHover && (
                    <div className="absolute -right-1 -top-1">
                        <DropDown
                            className={`p-2 text-white flex items-center justify-center rounded-lg hover:text-neutral-200`}
                            data={actions}
                            panelMenusClass="origin-right -right-1"
                            onClick={handleClickDropDown}
                        />
                    </div>
                )}
            </button>
        )
    }

    return (
        <Tilt tiltEnable={tilt === 'true'}>
            <div
                className={`Card11 relative flex flex-col group rounded-3xl overflow-hidden border dark:border-transparent border-neutral-100 dark:bg-neutral-900 ${className}`}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                ref={innerRef}
            >
                <div
                    className={`block flex-shrink-0 relative w-full rounded-t-3xl overflow-hidden z-10 ${ratio}`}
                >
                    <div>
                        <PostFeaturedMedia post={post} isHover={isHover} />
                    </div>
                </div>
                <Link
                    href={`/post/${stringToSlug(post.title)}/${post.id}`}
                    className="absolute inset-0"
                ></Link>
                <span className="absolute top-3 inset-x-3 z-10">
                    <TopicBadgeList chars={26} topics={post.post_topics} />
                </span>

                {renderMenu()}

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
                    <div className="flex items-end justify-between mt-auto m-">
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
            <ModalReportItem
                show={isReporting}
                onCloseModalReportItem={closeModalReportPost}
                id={post.id}
            />
            <ModalHidePost
                show={showModalHidePost}
                id={post.id}
                title={post.title}
                onCloseModalHidePost={onCloseModalHidePost}
                onHidePost={handleHidePost}
            />
        </Tilt>
    )
}

export default Card11
