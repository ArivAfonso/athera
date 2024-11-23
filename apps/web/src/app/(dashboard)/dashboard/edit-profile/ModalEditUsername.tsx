'use client'

import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'
import { debounce } from 'lodash'
import { Button, Modal } from 'ui'

async function changeUsername(username: string, id: string) {
    const supabase = createClient()
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

const ModalChangeUsername: FC<ModalChangeUsernameProps> = ({
    show,
    id,
    onCloseModal,
}) => {
    const textareaRef = useRef(null)
    const { register, handleSubmit, watch } = useForm()

    const possibleName = watch('username')
    const [isUsernameTaken, setIsUsernameTaken] = useState<boolean>(false)
    const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true)

    const debouncedCheckUsername = useCallback(
        debounce((username) => {
            checkUsername(username)
        }, 300),
        []
    ) // 300ms debounce time

    async function checkUsername(username: string) {
        const supabase = createClient()
        if (!username) {
            setIsUsernameTaken(false)
            return
        }

        // Validate username: no spaces or special characters except $ and #
        const usernamePattern = /^[a-zA-Z0-9$#]+$/
        if (!usernamePattern.test(username)) {
            setIsUsernameValid(false)
            setIsUsernameTaken(false)
            return
        } else {
            setIsUsernameValid(true)
        }

        const { data, error } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)

        if (error) {
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
                    <label htmlFor="username" className="block text-sm pb-1">
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
                        } ${!isUsernameValid ? 'border-red-500' : ''}`}
                        placeholder="Enter your new username"
                        {...register('username')}
                    />
                    {!isUsernameValid && (
                        <div className="mt-2">
                            <span className="text-sm text-red-500">
                                Username can only contain letters, numbers, $
                                and #
                            </span>
                        </div>
                    )}
                    {isUsernameTaken !== null && isUsernameTaken === true && (
                        <div className="mt-2">
                            <span className="text-sm text-red-500">
                                Your Username is Taken
                            </span>
                        </div>
                    )}
                    {isUsernameTaken !== null &&
                        possibleName !== '' &&
                        isUsernameTaken === false && (
                            <div className="mt-2">
                                <span className="text-sm text-green-500">
                                    Your Username is Available
                                </span>
                            </div>
                        )}
                </div>
                <div className="mt-4 space-x-3">
                    <Button
                        pattern="white"
                        type="submit"
                        disabled={!isUsernameValid || isUsernameTaken}
                    >
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
        <Modal
            isOpenProp={show}
            onCloseModal={onCloseModal}
            contentExtraClass="max-w-screen-sm"
            renderContent={renderContent}
            renderTrigger={renderTrigger}
            modalTitle=""
        />
    )
}

export default ModalChangeUsername
