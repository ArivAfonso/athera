'use client'

import React, { FC, useEffect, useRef } from 'react'
import { Modal, ButtonPrimary, ButtonThird } from 'ui'
import { useForm } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'

async function deleteComment(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (error) {
        // Handle the error.
        return
    }
}

export interface ModalDeleteCommentProps {
    show: boolean
    id: string
    onCloseModalDeleteComment: () => void
    onDeleteComment: (commentId: string) => void
}

const ModalDeleteComment: FC<ModalDeleteCommentProps> = ({
    show,
    id,
    onCloseModalDeleteComment,
    onDeleteComment,
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
        await deleteComment(id)
        onDeleteComment(id)
        onCloseModalDeleteComment()
    }

    const renderContent = () => {
        return (
            <form onSubmit={handleSubmit(async (data) => await onSubmit())}>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                    Delete comment
                </h3>
                <span className="text-sm">
                    Are you sure you want to delete this comment? You cannot
                    undo this action.
                </span>
                <div className="mt-4 space-x-3">
                    <ButtonPrimary className="!bg-red-500" type="submit">
                        Delete
                    </ButtonPrimary>
                    <ButtonThird
                        type="button"
                        onClick={onCloseModalDeleteComment}
                    >
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
            onCloseModal={onCloseModalDeleteComment}
            contentExtraClass="max-w-screen-sm"
            renderContent={renderContent}
            renderTrigger={renderTrigger}
            modalTitle=""
        />
    )
}

export default ModalDeleteComment
