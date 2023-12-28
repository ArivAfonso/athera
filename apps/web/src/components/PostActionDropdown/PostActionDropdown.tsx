'use client'

import React, { FC, useState } from 'react'
import twFocusClass from '@/utils/twFocusClass'
import NcDropDown from '@/components/NcDropDown/NcDropDown'
import ModalReportItem from '@/components/ModalReportItem/ModalReportItem'
import ModalHideAuthor from './ModalHideAuthor'
import { useRouter } from 'next/navigation'

export interface PostActionDropdownProps {
    containerClassName?: string
    iconClass?: string
    dropdownPositon?: 'up' | 'down'
    title: string
    id: string
}

const PostActionDropdown: FC<PostActionDropdownProps> = ({
    containerClassName = 'h-8 w-8 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700',
    iconClass = 'h-[18px] w-[18px]',
    dropdownPositon = 'down',
    title,
    id,
}) => {
    let actions = [
        {
            id: 'reportThisArticle',
            name: 'Report this article',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
    </svg>
    `,
        },
    ]

    //
    const router = useRouter()
    //
    const [isReporting, setIsReporting] = useState(false)
    const [showModalHideAuthor, setShowModalHideAuthor] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    const openModalReportPost = () => setIsReporting(true)
    const closeModalReportPost = () => setIsReporting(false)

    const openModalHideAuthor = () => setShowModalHideAuthor(true)
    const onCloseModalHideAuthor = () => setShowModalHideAuthor(false)

    const hanldeClickDropDown = (item: (typeof actions)[number]) => {
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
        if (item.id === 'hideThisAuthor') {
            return openModalHideAuthor()
        }
        if (item.id === 'commentThisArticle') {
            return
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
            <NcDropDown
                className={`text-neutral-500 dark:text-neutral-400 flex items-center justify-center rounded-full  ${containerClassName} ${twFocusClass()}`}
                triggerIconClass={iconClass}
                data={actions}
                panelMenusClass={
                    dropdownPositon === 'up'
                        ? 'origin-bottom-right bottom-0'
                        : undefined
                }
                onClick={hanldeClickDropDown}
            />
        )
    }

    return (
        <div>
            {renderMenu()}

            <ModalReportItem
                show={isReporting}
                onCloseModalReportItem={closeModalReportPost}
            />
            <ModalHideAuthor
                show={showModalHideAuthor}
                onCloseModalHideAuthor={onCloseModalHideAuthor}
            />
        </div>
    )
}

export default PostActionDropdown
