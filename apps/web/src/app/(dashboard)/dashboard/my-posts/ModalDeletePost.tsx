'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import { ButtonPrimary, ButtonThird, Modal } from 'ui'
import { useForm } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'
import DraftType from '@/types/DraftType'

export interface ModalDeletePostProps {
    show: boolean
    id: string
    onCloseModalDeletePost: () => void
    onDeletePost: (postId: string) => void // Add this prop
    type?: 'post' | 'draft'
}

const ModalDeletePost: FC<ModalDeletePostProps> = ({
    show,
    id,
    onCloseModalDeletePost,
    onDeletePost, // Add this prop
    type = 'post',
}) => {
    const { handleSubmit } = useForm()
    const textareaRef = useRef(null)
    const [loading, setLoading] = useState(false)

    async function DeletePost(id: string) {
        setLoading(true)
        const supabase = createClient()
        const { data: session } = await supabase.auth.getUser()

        if (!session.user) {
            return
        }
        if (type === 'post') {
            const { error } = await supabase.from('posts').delete().eq('id', id)

            //Delete from supabase storage

            const { data: list } = await supabase.storage
                .from('images')
                .list(`${session.user.id}/${id}`)

            const filesToRemove = list?.map(
                (x) => `${session.user.id}/${id}/${x.name}`
            )

            if (filesToRemove && filesToRemove.length > 0) {
                await supabase.storage
                    .from('images')
                    .remove(filesToRemove ?? [])

                await supabase.storage
                    .from('posts')
                    .remove([`${session.user.id}/${id}`])
            }
            setLoading(false)
            if (error) {
                // Handle the error.
                setLoading(false)
                return
            }
        } else if (type === 'draft') {
            const { data, error: draftError } = await supabase
                .from('drafts')
                .select(`image`)
                .eq('author', session.user?.id)

            const { error } = await supabase
                .from('drafts')
                .delete()
                .eq('id', id)

            const draftData: DraftType | null = data as unknown as DraftType

            //Delete from supabase storage

            if (draftData.image) {
                const { data: list } = await supabase.storage
                    .from('images')
                    .list(`${session.user.id}/drafts/${id}`)

                const filesToRemove = list?.map(
                    (x) => `${session.user.id}/drafts/${id}/${x.name}`
                )

                if (filesToRemove && filesToRemove.length > 0) {
                    await supabase.storage
                        .from('images')
                        .remove(filesToRemove ?? [])

                    await supabase.storage
                        .from('drafts')
                        .remove([`${session.user.id}/drafts/${id}`])
                }
            }
            setLoading(false)
            if (error) {
                // Handle the error.
                setLoading(false)
                return
            }
        }
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
                    {loading ? (
                        <>
                            <ButtonPrimary className="!bg-red-500" loading>
                                Delete
                            </ButtonPrimary>
                            <ButtonThird
                                disabled
                                onClick={onCloseModalDeletePost}
                            >
                                Cancel
                            </ButtonThird>
                        </>
                    ) : (
                        <>
                            <ButtonPrimary
                                className="!bg-red-500"
                                type="submit"
                            >
                                Delete
                            </ButtonPrimary>
                            <ButtonThird
                                type="button"
                                onClick={onCloseModalDeletePost}
                            >
                                Cancel
                            </ButtonThird>
                        </>
                    )}
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
            onCloseModal={onCloseModalDeletePost}
            contentExtraClass="max-w-screen-sm"
            renderContent={renderContent}
            renderTrigger={renderTrigger}
            modalTitle=""
        />
    )
}

export default ModalDeletePost
