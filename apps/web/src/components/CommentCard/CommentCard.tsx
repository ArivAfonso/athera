import React, { FC, useRef, useState } from 'react'
import { Avatar, DropDown, DropDownItem } from 'ui'
import twFocusClass from '@/utils/twFocusClass'
import ModalEditComment from './ModalEditComment'
import ModalDeleteComment from './ModalDeleteComment'
import Link from 'next/link'
import CommentCardLikeReply from './CommentCardLikeReply'
import CommentType from '@/types/CommentType'
import ModalReportComment from './ModalReportComment'
import CommentForm from './CommentForm'

export interface CommentCardProps {
    className?: string
    commentObj: CommentType
    size?: 'large' | 'normal'
    currentUserID: string // Pass the ID of the currently logged-in user
    onDeleteComment: (commentId: string) => void // Callback function to delete a comment
    onEditComment: (commentId: string, newComment: string) => void // Callback function to edit a comment
}

const CommentCard: FC<CommentCardProps> = ({
    className = '',
    commentObj,
    size = 'large',
    currentUserID,
    onDeleteComment,
    onEditComment,
}) => {
    const {
        id,
        created_at,
        commenter,
        comment,
        likes,
        is_liked_by_current_user,
    } = commentObj

    const isCommenterCurrentUser = commenter.id === currentUserID

    console.log('isCommenterCurrentUser', isCommenterCurrentUser)
    console.log('comment', comment)

    const actions: DropDownItem[] = [
        {
            id: 'reply',
            name: 'Reply',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>`,
        },
    ]

    // Include the "Report" item only when the commenter and current user are not the same
    if (!isCommenterCurrentUser) {
        actions.push({
            id: 'report',
            name: 'Report abuse',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
          </svg>`,
        })
    }

    if (isCommenterCurrentUser) {
        // If the commenter and current user are the same, add the "Delete" button
        actions.push(
            {
                id: 'delete',
                name: 'Delete',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>`,
            },
            {
                id: 'edit',
                name: 'Edit',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>`,
            }
        )
    }

    const textareaRef = useRef(null)
    const [isReplying, setIsReplying] = useState(false)
    const [isEditting, setIsEditting] = useState(false)
    const [isReporting, setIsReporting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const openReplyForm = () => {
        setIsReplying(true)
        setTimeout(() => {
            textareaRef.current && (textareaRef.current as any).focus()
        }, 100)
    }
    const closeReplyForm = () => {
        setIsReplying(false)
    }

    const openModalEditComment = () => setIsEditting(true)
    const closeModalEditComment = () => setIsEditting(false)

    const openModalReportComment = () => setIsReporting(true)
    const closeModalReportComment = () => setIsReporting(false)

    const openModalDeleteComment = () => setIsDeleting(true)
    const closeModalDeleteComment = () => setIsDeleting(false)

    const handleEditCommentSubmit = (newComment: string) => {
        onEditComment(id, newComment) // Call the edit callback function
        closeModalEditComment()
    }

    const handleDeleteCommentSubmit = () => {
        onDeleteComment(commentObj.id)
        closeModalDeleteComment()
    }

    const hanldeClickDropDown = async (item: DropDownItem) => {
        if (item.id === 'reply') {
            return openReplyForm()
        }
        if (item.id === 'edit') {
            // Check if the commenter's ID matches the current user's ID before allowing edit
            if (commenter.id === currentUserID) {
                return openModalEditComment()
            }
        }
        if (item.id === 'report') {
            return openModalReportComment()
        }
        if (item.id === 'delete') {
            // Check if the commenter's ID matches the current user's ID before allowing delete
            if (commenter.id === currentUserID) {
                return openModalDeleteComment()
            }
        }
    }

    const renderCommentForm = () => {
        return (
            <CommentForm
                textareaRef={textareaRef}
                id={id}
                onClickSubmit={closeReplyForm}
                onClickCancel={closeReplyForm}
                className="flex-grow"
            />
        )
    }

    return (
        <>
            <div className={`CommentCard flex ${className}`}>
                <Avatar
                    sizeClass={`h-6 w-6 text-base ${
                        size === 'large' ? 'sm:text-lg sm:h-8 sm:w-8' : ''
                    }`}
                    radius="rounded-full"
                    imgUrl={commenter.avatar}
                    containerClassName="mt-4"
                />
                <div className="flex-grow flex flex-col p-4 ml-2 text-sm border border-neutral-200 rounded-xl sm:ml-3 sm:text-base dark:border-neutral-700">
                    {/* AUTHOR INFOR */}
                    <div className="relative flex items-center pr-6">
                        <div className="absolute -right-3 -top-3">
                            <DropDown
                                className={`p-2 text-neutral-500 flex items-center justify-center rounded-lg hover:text-neutral-800 dark:hover:text-neutral-200 sm:hover:bg-neutral-100 dark:hover:bg-neutral-800 ${twFocusClass()}`}
                                data={actions}
                                onClick={hanldeClickDropDown}
                            />
                        </div>
                        <Link
                            className="flex-shrink-0 font-semibold text-neutral-800 dark:text-neutral-100"
                            href={`/author/${commenter.username}`}
                        >
                            {commenter.name}
                        </Link>
                        <span className="mx-2">·</span>
                        <span className="text-neutral-500 dark:text-neutral-400 text-xs line-clamp-1 sm:text-sm">
                            {new Date(created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </div>

                    {/* CONTENT */}
                    <span className="block text-neutral-700 mt-2 mb-3 sm:mt-3 sm:mb-4 dark:text-neutral-300">
                        {comment}
                    </span>

                    {/* ACTION LIKE REPLY */}
                    {isReplying ? (
                        renderCommentForm()
                    ) : (
                        <CommentCardLikeReply
                            className={className}
                            id={id}
                            onClickReply={() => setIsReplying(true)}
                        />
                    )}
                </div>
            </div>

            <ModalEditComment
                show={isEditting}
                onCloseModalEditComment={closeModalEditComment}
                id={id}
                comment={comment}
                onEditComment={handleEditCommentSubmit}
            />
            <ModalReportComment
                show={isReporting}
                onCloseModalReportItem={closeModalReportComment}
                id={id}
            />
            <ModalDeleteComment
                show={isDeleting}
                onCloseModalDeleteComment={closeModalDeleteComment}
                id={id}
                onDeleteComment={handleDeleteCommentSubmit}
            />
        </>
    )
}

export default CommentCard
