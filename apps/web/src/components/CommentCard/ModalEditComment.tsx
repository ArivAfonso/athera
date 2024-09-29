'use client'

import React, { FC, useEffect, useRef } from 'react'
import { Modal } from 'ui'
import EditCommentForm from './EditCommentForm'

export interface ModalEditCommentProps {
    show: boolean
    onCloseModalEditComment: () => void
    comment: string
    onEditComment: (comment: string) => void
    id: string
}

const ModalEditComment: FC<ModalEditCommentProps> = ({
    show,
    onCloseModalEditComment,
    comment,
    onEditComment, // Add this prop
    id,
}) => {
    const textareaRef = useRef(null)

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                const element: HTMLTextAreaElement | null = textareaRef.current
                if (element) {
                    ;(element as HTMLTextAreaElement).focus()
                    ;(element as HTMLTextAreaElement).setSelectionRange(
                        (element as HTMLTextAreaElement).value.length,
                        (element as HTMLTextAreaElement).value.length
                    )
                }
            }, 400)
        }
    }, [show])

    const renderContent = () => {
        return (
            <EditCommentForm
                className="mt-0"
                onClickCancel={onCloseModalEditComment}
                onClickSubmit={onCloseModalEditComment}
                onEditComment={onEditComment}
                defaultValue={comment}
                id={id}
                textareaRef={textareaRef}
                rows={8}
            />
        )
    }

    const renderTrigger = () => {
        return null
    }

    return (
        <Modal
            isOpenProp={show}
            onCloseModal={onCloseModalEditComment}
            contentExtraClass="max-w-screen-md"
            renderContent={renderContent}
            renderTrigger={renderTrigger}
            modalTitle="Editing comment"
        />
    )
}

export default ModalEditComment
