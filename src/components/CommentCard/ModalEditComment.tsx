'use client'

import React, { FC, useEffect, useRef } from 'react'
import NcModal from '@/components/NcModal/NcModal'
import SingleCommentForm from '@/app/(posts)/PostCommentForm'

export interface ModalEditCommentProps {
    show: boolean
    onCloseModalEditComment: () => void
    comment: string
    id: string
}

const ModalEditComment: FC<ModalEditCommentProps> = ({
    show,
    onCloseModalEditComment,
    comment,
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
            <SingleCommentForm
                className="mt-0"
                onClickCancel={onCloseModalEditComment}
                onClickSubmit={onCloseModalEditComment}
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
        <NcModal
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
