'use client'

import React, { FC, useEffect, useRef } from 'react'
import AuthorType from '@/types/AuthorType'
import { useForm } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'
import { Input, Alert, Label, Modal, ButtonPrimary, ButtonThird } from 'ui'
import toast from 'react-hot-toast'

export interface ModalHideAuthorProps {
    author: AuthorType
    show: boolean
    onCloseModalHideAuthor: () => void
}

const ModalHideAuthor: FC<ModalHideAuthorProps> = ({
    author,
    show,
    onCloseModalHideAuthor,
}) => {
    const { handleSubmit } = useForm()
    const textareaRef = useRef(null)

    const handleClickSubmitForm = () => {
        console.log({ author: author.id })
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

    async function hideAuthor(authorId: string) {
        const supabase = createClient()

        const { data: session } = await supabase.auth.getUser()
        if (!session.user) {
            toast.custom((t) => (
                <Alert
                    message="You need to login to hide this author"
                    type="danger"
                />
            ))
            return
        }

        const { data, error } = await supabase.from('hidden_authors').insert({
            user_id: session.user.id,
            author: author.id,
        })

        if (error) {
            console.error(error)
            return
        }

        //Update localStorage
        const hiddenAuthorsItem = localStorage.getItem('hiddenAuthors')
        const hiddenAuthors = hiddenAuthorsItem
            ? JSON.parse(hiddenAuthorsItem)
            : []

        localStorage.setItem(
            'hiddenAuthors',
            JSON.stringify([...hiddenAuthors, author.id])
        )
    }

    const onSubmit = async () => {
        await hideAuthor(author.id)
    }

    const renderContent = () => {
        return (
            <form onSubmit={handleSubmit(async (data) => await onSubmit())}>
                <h3 className="text-lg font-semibold">
                    Hide stories from {author.name}
                </h3>
                <span className="text-sm">
                    We will hide all articles from{' '}
                    <strong>{author.name}</strong>. You will no longer see their
                    articles?
                </span>
                <div className="mt-4 space-x-3">
                    <ButtonPrimary
                        className="!bg-red-500"
                        onClick={handleClickSubmitForm}
                        type="submit"
                    >
                        Hide this author
                    </ButtonPrimary>
                    <ButtonThird type="button" onClick={onCloseModalHideAuthor}>
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
            onCloseModal={onCloseModalHideAuthor}
            contentExtraClass="max-w-screen-sm"
            renderContent={renderContent}
            renderTrigger={renderTrigger}
            modalTitle=""
        />
    )
}

export default ModalHideAuthor
