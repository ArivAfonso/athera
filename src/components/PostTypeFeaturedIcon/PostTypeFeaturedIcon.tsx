import { PostDataType } from '@/data/types'
import React, { FC } from 'react'

export interface PostTypeFeaturedIconProps {
    className?: string
    postType?: PostDataType['postType']
    onClick?: () => void
    wrapSize?: string
    iconSize?: string
}

const PostTypeFeaturedIcon: FC<PostTypeFeaturedIconProps> = ({
    className = '',
    postType = 'standard',
    onClick,
    wrapSize = 'w-11 h-11',
    iconSize = 'w-6 h-6',
}) => {
    const renderMediaIcon = () => {
        if (postType === 'gallery') {
            return (
                <svg
                    className={iconSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2 12.99V15C2 20 4 22 9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M11 8C11 9.1 10.1 10 9 10C7.9 10 7 9.1 7 8C7 6.9 7.9 6 9 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M2.66992 18.9501L7.59992 15.6401C8.38992 15.1101 9.52992 15.1701 10.2399 15.7801L10.5699 16.0701C11.3499 16.7401 12.6099 16.7401 13.3899 16.0701L17.5499 12.5001C18.3299 11.8301 19.5899 11.8301 20.3699 12.5001L21.9999 13.9001"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )
        }
        return null
    }

    return (
        <div
            className={`nc-PostTypeFeaturedIcon ${className}`}
            data-nc-id="PostTypeFeaturedIcon"
            onClick={onClick}
        >
            {!!postType && postType !== 'standard' && (
                <span
                    className={`bg-neutral-900 bg-opacity-60 rounded-full flex  items-center justify-center text-xl text-white border border-white ${wrapSize}`}
                >
                    {renderMediaIcon()}
                </span>
            )}
        </div>
    )
}

export default PostTypeFeaturedIcon
