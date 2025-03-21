'use client'

import React, { FC, useEffect, useState } from 'react'
import Image, { ImageProps } from 'next/image'

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

    useEffect(() => {
        set_imgSrc(src)
    }, [src])
    return (
        <div className={containerClassName}>
            <Image
                onLoadingComplete={(result) => {
                    if (result.naturalWidth === 0) {
                        // Broken image
                        set_imgSrc(
                            fallbackSrc ? fallbackSrc : './placeholder.svg'
                        )
                    }
                }}
                onError={() => {
                    set_imgSrc(fallbackSrc ? fallbackSrc : './placeholder.svg')
                }}
                src={imgSrc}
                className={className}
                alt={alt}
                sizes={sizes}
                {...args}
            />
        </div>
    )
}

export default Img
