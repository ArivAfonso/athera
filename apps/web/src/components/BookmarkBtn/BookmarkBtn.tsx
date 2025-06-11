import React, { FC, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'
import { Input, Alert } from 'ui'

export interface BookmarkBtnProps {
    containerClassName?: string
    postId: string
}

const BookmarkBtn: FC<BookmarkBtnProps> = ({
    containerClassName = 'h-8 w-8 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700',
    postId = '',
}) => {
    const [isBookmarked, setIsBookmarked] = useState(false)

    useEffect(() => {
        async function fetchAndStoreBookmarks() {
            const supabase = createClient()
            const { data: session } = await supabase.auth.getSession()
            const userId = session.session?.user?.id
            const localBookmarks = JSON.parse(
                localStorage.getItem('bookmarks') || '[]'
            )
            if (userId) {
                if (localBookmarks) {
                    // Check if the post is bookmarked
                    setIsBookmarked(localBookmarks.includes(postId))
                } else {
                    const { data: bookmarks, error } = await supabase
                        .from('bookmarks')
                        .select('post')
                        .eq('user', userId)

                    if (bookmarks) {
                        // Map the bookmarks to get an array of post ids
                        const bookmarkedPostIds = bookmarks.map(
                            (bookmark) => bookmark.post
                        )
                        // Check if the post is bookmarked
                        setIsBookmarked(bookmarkedPostIds.includes(postId))
                        // Update the bookmarks in localStorage
                        localStorage.setItem(
                            'bookmarks',
                            JSON.stringify(bookmarkedPostIds)
                        )
                    }
                }
            }
        }

        fetchAndStoreBookmarks()
    }, [postId])

    async function toggleBookmark() {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getSession()

        if (!session.session?.user) {
            toast.custom((t) => (
                <Alert
                    message="You need to login to bookmark this post"
                    type="danger"
                />
            ))
            return
        }

        const userId = session.session?.user?.id

        try {
            if (isBookmarked) {
                setIsBookmarked(false) // Set isBookmarked to false
                // If already bookmarked, delete the bookmark from the database
                const { data, error } = await supabase
                    .from('bookmarks')
                    .delete()
                    .eq('user', userId)
                    .eq('post', postId)
                if (!error) {
                    // Remove the post from the bookmarks in localStorage
                    const bookmarks = JSON.parse(
                        localStorage.getItem('bookmarks') || '[]'
                    )
                    const updatedBookmarks = bookmarks.filter(
                        (bookmark: string) => bookmark !== postId
                    )
                    localStorage.setItem(
                        'bookmarks',
                        JSON.stringify(updatedBookmarks)
                    )
                }
            } else {
                setIsBookmarked(true) // Set isBookmarked to true
                // If not bookmarked, insert a new bookmark into the database
                const { data, error } = await supabase
                    .from('bookmarks')
                    .insert([{ user: userId, post: postId }])
                if (!error) {
                    // Add the post to the bookmarks in localStorage
                    const bookmarks = JSON.parse(
                        localStorage.getItem('bookmarks') || '[]'
                    )
                    bookmarks.push(postId)
                    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
                }
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error)
        }
    }

    return (
        <button
            className={`BookmarkBtn relative rounded-full flex items-center justify-center ${containerClassName}`}
            title="Save to reading list"
            onClick={toggleBookmark}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                fill={isBookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                className="w-[18px] h-[18px]"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
            </svg>
        </button>
    )
}

export default BookmarkBtn
