import React, { FC } from 'react'
import rightImg from '@/images/SVG-subcribe2.png'
import { Input, ButtonCircle } from 'ui'
import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/24/solid'

export interface NewsletterProps {
    className?: string
}

const Newsletter: FC<NewsletterProps> = ({ className = '' }) => {
    return (
        <div
            className={`Newsletter relative flex flex-col lg:flex-row items-center ${className}`}
        >
            <div className="flex-shrink-0 mb-14 lg:mb-0 lg:mr-10 lg:w-2/5">
                <h2 className="font-semibold text-4xl">
                    Join our newsletter 🎉
                </h2>
                <span className="block mt-6 text-neutral-500 dark:text-neutral-400">
                    Read and share new perspectives on just about any topic.
                    Everyone’s welcome.
                </span>
                <form className="mt-10 relative max-w-sm">
                    <Input
                        required
                        aria-required
                        placeholder="Enter your email"
                        type="email"
                    />
                    <ButtonCircle
                        type="submit"
                        className="absolute transform top-1/2 -translate-y-1/2 right-1 dark:bg-neutral-300 dark:text-black"
                    >
                        <ArrowRightIcon className="w-5 h-5" />
                    </ButtonCircle>
                </form>
            </div>
            <div className="flex-grow">
                <Image
                    alt="subsc"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={rightImg}
                />
            </div>
        </div>
    )
}

export default Newsletter
