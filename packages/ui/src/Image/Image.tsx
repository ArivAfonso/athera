'use client'

import React, { FC, useEffect, useState } from 'react'
import Image, { ImageProps } from 'next/image'

const wsevLoader = ({
    src,
    width,
    quality,
}: {
    src: string
    width: number
    quality?: number
}) => {
    return `https://wsrv.nl/?url=${src}&w=${width}`
}

export interface ImgProps extends ImageProps {
    containerClassName?: string
    fallbackSrc?: string
}

const Img: FC<ImgProps> = ({
    containerClassName = '',
    alt = 'nc-imgs',
    className = 'object-cover w-full h-full',
    sizes = '(max-width: 600px) 480px, 800px',
    src,
    fallbackSrc,
    ...args
}) => {
    const [imgSrc, set_imgSrc] = useState(src)
    const [useDefaultLoader, setUseDefaultLoader] = useState(false)

    useEffect(() => {
        set_imgSrc(src)
        setUseDefaultLoader(false)
    }, [src])

    // Use fill mode if neither width nor height are provided in args
    const fillDefault =
        !('width' in args) && !('height' in args) ? { fill: true } : {}

    return (
        // <div className={`w-full h-full relative ${containerClassName}`}>
        <Image
            loader={useDefaultLoader ? undefined : wsevLoader}
            {...fillDefault}
            onLoad={(event) => {
                const img = event.target as HTMLImageElement
                if (img.naturalWidth === 0) {
                    // Broken image
                    set_imgSrc(
                        fallbackSrc
                            ? fallbackSrc
                            : `${window.location.origin}/placeholder.svg`
                    )
                }
            }}
            onError={() => {
                if (!useDefaultLoader) {
                    setUseDefaultLoader(true)
                } else {
                    set_imgSrc(
                        fallbackSrc
                            ? fallbackSrc
                            : `${window.location.origin}/placeholder.svg`
                    )
                }
            }}
            src={imgSrc}
            className={className}
            alt={alt}
            sizes={sizes}
            {...args}
        />
        // </div>
    )
}

export default Img
