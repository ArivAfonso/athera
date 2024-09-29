'use client'

import React, { FC, useEffect, useState } from 'react'
import twFocusClass from '@/utils/twFocusClass'
import { DropDownItem } from 'ui'
import ModalReportItem from '@/components/ModalReportItem/ModalReportItem'
import { useRouter } from 'next/navigation'
import ModalHidePost from './ModalHidePost'
import toast from 'react-hot-toast'
import { Input, Alert, DropDown } from 'ui'
import AuthorType from '@/types/AuthorType'
import { createClient } from '@/utils/supabase/client'

export interface PostActionDropdownProps {
    containerClassName?: string
    iconClass?: string
    dropdownPositon?: 'up' | 'down'
    title: string
    id: string
    author: AuthorType
}

const PostActionDropdown: FC<PostActionDropdownProps> = ({
    containerClassName = 'h-8 w-8 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700',
    iconClass = 'h-[18px] w-[18px]',
    dropdownPositon = 'down',
    title,
    author,
    id,
}) => {
    let [actions, setActions] = useState<DropDownItem[]>([])

    useEffect(() => {
        async function setOptions() {
            setActions([
                {
                    id: 'reportThisArticle',
                    name: 'Report this article',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
            `,
                },
            ])

            const supabase = createClient()
            const { data: session } = await supabase.auth.getUser()

            if (!session.user) {
                return
            }

            if (author.id === session.user.id) {
                setActions((prevActions) => {
                    // Check if the action is already present
                    const exists = prevActions.find(
                        (action) => action.id === 'edit'
                    )

                    // If the action is not present, add it
                    if (!exists) {
                        return [
                            ...prevActions,
                            {
                                id: 'edit',
                                name: 'Edit This Post',
                                icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>                              
                              `,
                            },
                        ]
                    }

                    // If the action is already present, return the previous actions without modification
                    return prevActions
                })
            }
        }

        setOptions()
    }, [])

    //
    const router = useRouter()
    //
    const [isReporting, setIsReporting] = useState(false)
    const [showModalHidePost, setShowModalHidePost] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    const openModalReportPost = () => setIsReporting(true)
    const closeModalReportPost = () => setIsReporting(false)

    const openModalHidePost = () => setShowModalHidePost(true)
    const onCloseModalHidePost = () => setShowModalHidePost(false)

    const handleClickDropDown = (item: (typeof actions)[number]) => {
        if (item.id === 'copylink') {
            navigator.clipboard.writeText(
                window.location.origin + `/post/${title}/${id}`
            )
            setIsCopied(true)
            setTimeout(() => {
                setIsCopied(false)
            }, 1000)
            return
        }
        if (item.id === 'reportThisArticle') {
            return openModalReportPost()
        }
        if (item.id === 'edit') {
            router.push(`/dashboard/edit-post/${id}`)
        }

        return
    }

    const renderMenu = () => {
        if (isCopied) {
            actions = actions.map((item) => {
                if (item.id !== 'copylink') return item
                return {
                    ...item,
                    name: 'Link Copied',
                }
            })
        }
        return (
            <DropDown
                className={`text-neutral-500 dark:text-neutral-400 flex items-center justify-center rounded-full  ${containerClassName} ${twFocusClass()}`}
                triggerIconClass={iconClass}
                data={actions}
                panelMenusClass={
                    dropdownPositon === 'up'
                        ? 'origin-bottom-right bottom-0'
                        : undefined
                }
                onClick={handleClickDropDown}
            />
        )
    }

    return (
        <div>
            {renderMenu()}

            <ModalReportItem
                id={id}
                show={isReporting}
                onCloseModalReportItem={closeModalReportPost}
            />
            <ModalHidePost
                show={showModalHidePost}
                onCloseModalHidePost={onCloseModalHidePost}
                title={title}
                id={id}
                onHidePost={() => {
                    toast.custom((t) => (
                        <Alert
                            message="You will no longer see this post"
                            type="success"
                        />
                    ))
                }}
            />
        </div>
    )
}

export default PostActionDropdown
