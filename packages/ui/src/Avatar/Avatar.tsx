'use client'

import Image, { StaticImageData } from 'next/image'
import React, { FC, useEffect, useState } from 'react'
import Img from '../Image/Image'

export interface AvatarProps {
    containerClassName?: string
    sizeClass?: string
    radius?: string
    imgUrl?: string | StaticImageData
    userName?: string
}

const Avatar: FC<AvatarProps> = ({
    containerClassName = '',
    sizeClass = 'h-6 w-6 text-sm',
    radius = 'rounded-full',
    imgUrl,
    userName,
}) => {
    const name = userName || 'Thomas Vaz'

    const [url, setUrl] = useState(imgUrl)

    return (
        <div
            className={`wil-avatar relative flex-shrink-0 inline-flex items-center justify-center overflow-hidden text-neutral-100 uppercase font-semibold shadow-inner ${radius} ${sizeClass} ${containerClassName}`}
            style={{ backgroundColor: url ? undefined : '' }}
        >
            {url && (
                <Img
                    fill
                    sizes="100px"
                    className="absolute inset-0 w-full h-full object-cover"
                    src={url}
                    alt={name}
                />
            )}
            <span className="wil-avatar__name">{name[0]}</span>
        </div>
    )
}

export default Avatar
