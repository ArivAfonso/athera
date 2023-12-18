'use client'

import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import NcModal from '@/components/NcModal/NcModal'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import ButtonThird from '@/components/Button/ButtonThird'
import { useForm } from 'react-hook-form'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Input from '@/components/Input/Input'
import { debounce } from 'lodash'
import Button from '@/components/Button/Button'

async function changeUsername(username: string, id: string) {
    const supabase = createClientComponentClient()
    const { error } = await supabase
        .from('users')
        .update({ username })
        .eq('id', id)
    if (error) {
        // Handle the error.
        return
    }
}

export interface ModalChangeUsernameProps {
    show: boolean
    id: string
    onCloseModal: () => void
}

const ModalDeletePost: FC<ModalChangeUsernameProps> = ({
    show,
    id,
    onCloseModal, // Add this prop
}) => {
    const textareaRef = useRef(null)
    // Inside your component
    const { register, handleSubmit, watch } = useForm()

    const possibleName = watch('username')

    //@ts-ignore
    const [isUsernameTaken, setIsUsernameTaken] = useState<Boolean>(null)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedCheckUsername = useCallback(
        debounce((username) => {
            checkUsername(username)
        }, 300),
        []
    ) // 300ms debounce time

    async function checkUsername(username: string) {
        const supabase = createClientComponentClient()
        console.log('checking')
        if (!username) {
            setIsUsernameTaken(false)
            return
        }

        const { data, error } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)

        if (error) {
            console.log(error)
            return
        }

        setIsUsernameTaken(data[0] ? true : false)
    }

    useEffect(() => {
        if (possibleName && possibleName.length > 0) {
            debouncedCheckUsername(possibleName)
        }
    }, [possibleName, debouncedCheckUsername])

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

    const onSubmit = async (username: string) => {
        await changeUsername(username, id)
        onCloseModal()
    }

    const renderContent = () => {
        return (
            <form
                onSubmit={handleSubmit(
                    async (data) => await onSubmit(data.username)
                )}
            >
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                    Change Username
                </h3>
                <span className="text-sm">
                    Are you sure you want to change your username? You cannot
                    undo this action.
                </span>
                <div className="mt-4">
                    <label htmlFor="username" className="block text-sm">
                        New Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className={`mt-1 rounded-full block w-full border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200/50 bg-white dark:border-neutral-500 dark:focus:ring-primary-500/30 dark:bg-neutral-900 ${
                            isUsernameTaken !== null
                                ? isUsernameTaken === true
                                    ? 'border-red-500'
                                    : 'border-green-500'
                                : ''
                        }`}
                        placeholder="Enter your new username"
                        {...register('username')}
                    />
                    {isUsernameTaken !== null && isUsernameTaken === true && (
                        <span className="text-red-500">
                            Your Username is Taken
                        </span>
                    )}
                    {isUsernameTaken !== null && isUsernameTaken === false && (
                        <span className="text-green-500">
                            Your Username is Available
                        </span>
                    )}
                </div>
                <div className="mt-4 space-x-3">
                    <Button pattern="white" type="submit">
                        Change Username
                    </Button>
                    <Button
                        pattern="white"
                        type="button"
                        onClick={onCloseModal}
                    >
                        Cancel
                    </Button>
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
            onCloseModal={onCloseModal}
            contentExtraClass="max-w-screen-sm"
            renderContent={renderContent}
            renderTrigger={renderTrigger}
            modalTitle=""
        />
    )
}

export default ModalDeletePost
