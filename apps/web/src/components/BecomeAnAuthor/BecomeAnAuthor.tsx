import React, { FC } from 'react'
import rightImgDemo from '@/images/BecomeAnAuthorImg.png'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Image, { StaticImageData } from 'next/image'

export interface BecomeAnAuthorProps {
    className?: string
    rightImg?: string | StaticImageData
}

const BecomeAnAuthor: FC<BecomeAnAuthorProps> = ({
    className = '',
    rightImg = rightImgDemo,
}) => {
    return (
        <div
            className={`nc-BecomeAnAuthor relative flex flex-col lg:flex-row items-center  ${className}`}
        >
            <div className="flex-shrink-0 mb-14 lg:mb-0 lg:mr-10 lg:w-2/5">
                <span className="text-xs uppercase tracking-wider font-medium text-neutral-400">
                    supper change your planning powers
                </span>
                <h2 className="font-semibold text-3xl sm:text-4xl mt-3">
                    Become an author and share your great stories
                </h2>
                <span className="block mt-8 text-neutral-500 dark:text-neutral-400">
                    Become an author you can earn extra income by writing
                    articles. Read and share new perspectives on just about any
                    topic. Everyone’s welcome.
                </span>
                <ButtonPrimary className="mt-8">Become an author</ButtonPrimary>
            </div>
            <div className="flex-grow">
                <Image
                    alt="hero"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={rightImg}
                />
            </div>
        </div>
    )
}

export default BecomeAnAuthor
