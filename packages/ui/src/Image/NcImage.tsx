import React, { FC } from 'react'
import Image, { ImageProps } from 'next/image'

export interface ImgProps extends ImageProps {
    containerClassName?: string
}

const Img: FC<ImgProps> = ({
    containerClassName = '',
    alt = 'nc-imgs',
    className = 'object-cover w-full h-full',
    sizes = '(max-width: 600px) 480px, 800px',
    ...args
}) => {
    return (
        <div className={containerClassName}>
            <Image className={className} alt={alt} sizes={sizes} {...args} />
        </div>
    )
}

export default Img
