'use client'

import React, { FC, useEffect, useRef } from 'react'
import NcModal from '@/components/NcModal/NcModal'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import ButtonThird from '../Button/ButtonThird'
import PostType from '@/types/PostType'
import { createClient } from '@/utils/supabase/client'

export interface ModalHidePostProps {
    post: PostType
    show: boolean
    onCloseModalHidePost: () => void
}

const ModalHidePost: FC<ModalHidePostProps> = ({
    post,
    show,
    onCloseModalHidePost,
}) => {
    const textareaRef = useRef(null)

    const handleClickSubmitForm = async () => {
        const supabase = createClient()

        const { data: session } = await supabase.auth.getSession()
        if (!session.session) return

        const { data, error } = await supabase.from('hidden_posts').insert({
            user_id: session.session.user.id,
            post_id: post.id,
        })

        if (error) {
            console.error(error)
            return
        }

        //Update localStorage
        const hiddenPostsItem = localStorage.getItem('hiddenPosts')
        const hiddenPosts = hiddenPostsItem ? JSON.parse(hiddenPostsItem) : []

        localStorage.setItem(
            'hiddenPosts',
            JSON.stringify([...hiddenPosts, post.id])
        )
    }

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                const element: HTMLTextAreaElement | null = textareaRef.current
                if (element) {
                    ;(element as HTMLTextAreaElement).focus()
                }
            }, 400)
        }
    }, [show])

    const renderContent = () => {
        return (
            <form action="#">
                <h3 className="text-lg font-semibold line-clamp-1">
                    Hide {post.title}
                </h3>
                <span className="text-sm">
                    We will no longer see this post in your feed and search (you
                    can only see this post in the author&apos;s page)
                </span>
                <div className="mt-4 space-x-3">
                    <ButtonPrimary
                        className="!bg-red-500"
                        onClick={handleClickSubmitForm}
                        type="submit"
                    >
                        Hide this post
                    </ButtonPrimary>
                    <ButtonThird type="button" onClick={onCloseModalHidePost}>
                        Cancel
                    </ButtonThird>
                </div>
            </form>
        )
    }

    const renderTrigger = () => {
        return null
    }

    return (
        <NcModal
            isOpenProp={show}
            onCloseModal={onCloseModalHidePost}
            contentExtraClass="max-w-screen-sm"
            renderContent={renderContent}
            renderTrigger={renderTrigger}
            modalTitle=""
        />
    )
}

export default ModalHidePost
