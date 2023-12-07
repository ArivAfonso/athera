'use client'

import React, { FC, useEffect, useRef } from 'react'
import NcModal from '@/components/NcModal/NcModal'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import ButtonThird from '@/components/Button/ButtonThird'
import { useForm } from 'react-hook-form'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

async function DeletePost(id: string) {
    const supabase = createClientComponentClient()
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) {
        // Handle the error.
        return
    }
}

export interface ModalDeletePostProps {
    show: boolean
    id: string
    onCloseModalDeletePost: () => void
    onDeletePost: (postId: string) => void // Add this prop
}

const ModalDeletePost: FC<ModalDeletePostProps> = ({
    show,
    id,
    onCloseModalDeletePost,
    onDeletePost, // Add this prop
}) => {
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
        await DeletePost(id)
        onDeletePost(id)
        onCloseModalDeletePost()
    }

    const renderContent = () => {
        return (
            <form onSubmit={handleSubmit(async (data) => await onSubmit())}>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                    Delete Post
                </h3>
                <span className="text-sm">
                    Are you sure you want to delete this post? You cannot undo
                    this action.
                </span>
                <div className="mt-4 space-x-3">
                    <ButtonPrimary className="!bg-red-500" type="submit">
                        Delete
                    </ButtonPrimary>
                    <ButtonThird type="button" onClick={onCloseModalDeletePost}>
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
            onCloseModal={onCloseModalDeletePost}
            contentExtraClass="max-w-screen-sm"
            renderContent={renderContent}
            renderTrigger={renderTrigger}
            modalTitle=""
        />
    )
}

export default ModalDeletePost
