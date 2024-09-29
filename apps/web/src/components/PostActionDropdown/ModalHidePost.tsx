'use client'

import React, { FC, useEffect, useRef } from 'react'
import PostType from '@/types/PostType'
import { createClient } from '@/utils/supabase/client'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Alert, ButtonPrimary, ButtonThird, Modal } from 'ui'

export interface ModalHidePostProps {
    id: string
    show: boolean
    title: string
    onCloseModalHidePost: () => void
    onHidePost: (postId: string) => void
}

const ModalHidePost: FC<ModalHidePostProps> = ({
    id,
    title,
    show,
    onCloseModalHidePost,
    onHidePost,
}) => {
    const hidePost = async (id: string) => {
        const supabase = createClient()

        const { data: session } = await supabase.auth.getUser()
        if (!session.user) {
            toast.custom((t) => (
                <Alert
                    message="You need to login to hide a post"
                    type="danger"
                />
            ))
            return
        }

        const { data, error } = await supabase.from('hidden_posts').insert({
            user_id: session.user.id,
            post: id,
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
            JSON.stringify([...hiddenPosts, id])
        )
    }

    const { handleSubmit } = useForm()
    const textareaRef = useRef(null)

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

    const onSubmit = async () => {
        await hidePost(id)
        onHidePost(id)
        onCloseModalHidePost()
    }

    const renderContent = () => {
        return (
            <form onSubmit={handleSubmit(async (data) => await onSubmit())}>
                <h3 className="text-lg font-semibold line-clamp-1">
                    Hide {title}
                </h3>
                <span className="text-sm">
                    We will no longer see this post in your feed and search (you
                    can only see this post in the author&apos;s page)
                </span>
                <div className="mt-4 space-x-3">
                    <ButtonPrimary className="!bg-red-500" type="submit">
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
        <Modal
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
