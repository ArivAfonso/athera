import React, { FC, useEffect, useState } from 'react'
import convertNumbThousand from '@/utils/convertNumbThousand'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'
import { Alert } from 'ui'

export interface NewsCardLikeActionProps {
    className?: string
    likeCount?: number
    newsId: string
}

const NewsCardLikeAction: FC<NewsCardLikeActionProps> = ({
    className = 'px-3 h-8 text-xs',
    likeCount = 0,
    newsId = '',
}) => {
    const [isLiked, setIsLiked] = useState(false)
    const [likeCountState, setLikeCount] = useState(likeCount)
    const supabase = createClient()

    useEffect(() => {
        checkLikedStatus()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newsId])

    useEffect(() => {
        setLikeCount(likeCount)
    }, [likeCount])

    async function checkLikedStatus() {
        try {
            const { data: session } = await supabase.auth.getUser()
            const userId = session.user?.id
            const localLikes = JSON.parse(
                localStorage.getItem('newsLikes') || '[]'
            )
            // Check if the news item is liked by the user
            if (userId) {
                if (localLikes) {
                    setIsLiked(localLikes.includes(newsId))
                } else {
                    const { data: likes, error } = await supabase
                        .from('likes')
                        .select('id')
                        .eq('news', newsId)
                        .eq('user_id', userId)
                    if (!error) {
                        setIsLiked(likes.length > 0)
                    }
                }
            }
        } catch (error) {
            console.error('Error checking news liked status:', error)
        }
    }

    async function toggleLike() {
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

            if (!userId) {
                return
            }

            if (isLiked) {
                setLikeCount((prevLikeCount) =>
                    prevLikeCount > 0 ? prevLikeCount - 1 : 0
                )
                setIsLiked(false)
                // Delete the like from the database
                const { data, error } = await supabase
                    .from('likes')
                    .delete()
                    .eq('news', newsId)
                    .eq('user_id', userId)

                if (error) {
                    console.error('Error deleting news like:', error)
                    return
                }
                setIsLiked(false)

                // Update the local like array
                const localLikes = JSON.parse(
                    localStorage.getItem('newsLikes') || '[]'
                )
                const updatedLocalLikes = localLikes.filter(
                    (like: string) => like !== newsId
                )
                localStorage.setItem(
                    'newsLikes',
                    JSON.stringify(updatedLocalLikes)
                )
            } else {
                setIsLiked(true)
                setLikeCount((prevLikeCount) => prevLikeCount + 1)

                // Insert a new like into the database
                const { error } = await supabase
                    .from('news_likes')
                    .insert([{ news_id: newsId, user_id: userId }])
                    .select()

                if (error) {
                    console.log('Error inserting news like:', error)
                    return
                }

                // Update the local like array
                const localLikes = JSON.parse(
                    localStorage.getItem('newsLikes') || '[]'
                )
                localLikes.push(newsId)
                localStorage.setItem('newsLikes', JSON.stringify(localLikes))
            }
        } catch (error) {
            console.error('Error toggling news like:', error)
        }
    }

    return (
        <button
            className={`NewsCardLikeAction relative min-w-[68px] flex items-center rounded-full leading-none group transition-colors ${className} ${
                isLiked
                    ? 'text-rose-600 bg-rose-50 dark:bg-red-950'
                    : 'text-neutral-700 bg-neutral-50 dark:text-neutral-200 dark:bg-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-600 dark:hover:text-rose-500'
            }`}
            onClick={toggleLike}
            title={isLiked ? 'Unlike' : 'Like'}
        >
            <svg
                width="24"
                height="24"
                fill={isLiked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
            >
                <path
                    fillRule="evenodd"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M11.995 7.23319C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972C4.49599 8.14609 4.2403 10.6312 5.66654 12.3892L11.995 18.25L18.3235 12.3892C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972C15.8305 5.18899 13.4446 5.60999 11.995 7.23319Z"
                    clipRule="evenodd"
                ></path>
            </svg>

            {likeCountState !== undefined && (
                <span
                    className={`ml-1 ${
                        isLiked
                            ? 'text-rose-600'
                            : 'text-neutral-900 dark:text-neutral-200'
                    }`}
                >
                    {convertNumbThousand(likeCountState)}
                </span>
            )}
        </button>
    )
}

export default NewsCardLikeAction
