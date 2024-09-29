'use client'

import React, { FC, useEffect, useState } from 'react'
import convertNumbThousand from '@/utils/convertNumbThousand'
import twFocusClass from '@/utils/twFocusClass'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'
import { Input, Alert } from 'ui'

export interface CommentCardLikeReplyProps {
    className?: string
    onClickReply: () => void
    id: string
}

const CommentCardLikeReply: FC<CommentCardLikeReplyProps> = ({
    className = '',
    id,
    onClickReply = () => {},
}) => {
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)

    const supabase = createClient()

    useEffect(() => {
        checkLikedStatus()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
        setLikeCount(likeCount)
    }, [likeCount])

    async function checkLikedStatus() {
        try {
            const { data: session } = await supabase.auth.getUser()
            const userId = session.user?.id
            const localLikes = JSON.parse(
                localStorage.getItem('comment_likes') || '[]'
            )
            // Check if the post is liked by the user
            if (userId) {
                if (localLikes) {
                    setIsLiked(localLikes.includes(id))
                } else {
                    const { data: likes, error } = await supabase
                        .from('comment_likes')
                        .select('id')
                        .eq('comment', id)
                        .eq('liker', userId)
                    if (!error) {
                        setIsLiked(likes.length > 0)
                    }
                }
            }
        } catch (error) {
            console.error('Error checking liked status:', error)
        }
    }

    async function toggleLike() {
        console.log('toggleLike')
        try {
            const { data: session } = await supabase.auth.getUser()

            if (!session.user) {
                toast.custom(
                    (t) => (
                        <Alert type="danger" message="You must be logged in" />
                    ),
                    {
                        duration: 3000,
                    }
                )
            }

            const userId = session.user?.id

            if (isLiked) {
                setLikeCount((prevLikeCount) =>
                    prevLikeCount > 0 ? prevLikeCount - 1 : 0
                )
                setIsLiked(false)
                // Delete the like from the database
                const { data, error } = await supabase
                    .from('comment_likes')
                    .delete()
                    .eq('comment', id)
                    .eq('liker', userId)

                if (error) {
                    console.error('Error deleting like:', error)
                    return
                }
                setIsLiked(false)

                // Update the local like array
                const localLikes = JSON.parse(
                    localStorage.getItem('comment_likes') || '[]'
                )
                const updatedLocalLikes = localLikes.filter(
                    (like: string) => like !== id
                )
                localStorage.setItem(
                    'comment_likes',
                    JSON.stringify(updatedLocalLikes)
                )
            } else {
                setIsLiked(true)
                setLikeCount((prevLikeCount) => prevLikeCount + 1)

                // Insert a new like into the database
                const { error } = await supabase
                    .from('comment_likes')
                    .insert([{ post: id, liker: userId }])
                    .select()

                if (error) {
                    console.log('Error inserting like:', error)
                    return
                }

                // Update the local like array
                const localLikes = JSON.parse(
                    localStorage.getItem('comment_likes') || '[]'
                )
                localLikes.push(id)
                localStorage.setItem(
                    'comment_likes',
                    JSON.stringify(localLikes)
                )
            }
        } catch (error) {
            console.error('Error toggling like:', error)
        }
    }

    const renderActionBtns = () => {
        return (
            <>
                <button
                    className={`min-w-[68px] flex items-center rounded-full leading-none px-3 h-8 text-xs ${twFocusClass()} ${
                        isLiked
                            ? 'text-rose-600 bg-rose-50'
                            : 'text-neutral-700 bg-neutral-100 dark:text-neutral-200 dark:bg-neutral-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:text-rose-500'
                    }`}
                    onClick={toggleLike}
                    title="Liked"
                >
                    <svg
                        className="h-5 w-5 mr-1"
                        fill={isLiked ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                    >
                        <path
                            fillRule="evenodd"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M11.995 7.23319C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972C4.49599 8.14609 4.2403 10.6312 5.66654 12.3892L11.995 18.25L18.3235 12.3892C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972C15.8305 5.18899 13.4446 5.60999 11.995 7.23319Z"
                            clipRule="evenodd"
                        ></path>
                    </svg>

                    <span
                        className={`${
                            isLiked
                                ? 'text-rose-600'
                                : 'text-neutral-900 dark:text-neutral-200'
                        }`}
                    >
                        {convertNumbThousand(likeCount)}
                    </span>
                </button>
                <button
                    className={`flex items-center min-w-[68px] rounded-full text-neutral-6000 bg-neutral-100 dark:text-neutral-200 dark:bg-neutral-800 px-3 h-8 hover:bg-teal-50 hover:text-teal-600 dark:hover:text-teal-500 ${twFocusClass()} `}
                    title="Reply"
                    onClick={onClickReply}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-[18px] w-[18px] mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                    </svg>
                    <span className="text-xs leading-none text-neutral-900 dark:text-neutral-200">
                        Reply
                    </span>
                </button>
            </>
        )
    }

    return (
        <div
            className={`CommentCardLikeReply flex items-center space-x-2 ${className}`}
            data-nc-id="CommentCardLikeReply"
        >
            {renderActionBtns()}
        </div>
    )
}

export default CommentCardLikeReply
