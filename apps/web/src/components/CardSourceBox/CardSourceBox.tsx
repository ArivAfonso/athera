import React, { FC } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Avatar, Img } from 'ui'
import Link from 'next/link'
import SourceType from '@/types/SourceType'

export interface CardSourceBoxProps {
    className?: string
    source: SourceType
}

const CardSourceBox: FC<CardSourceBoxProps> = ({ className = '', source }) => {
    return (
        <Link
            href={`/source/${source.id}`}
            className={`CardSourceBox flex flex-col overflow-hidden bg-white dark:bg-neutral-800 rounded-3xl ${className}`}
        >
            <div className="relative">
                <div className="flex aspect-w-7 aspect-h-5 w-full h-0">
                    <Img
                        alt="source image"
                        containerClassName="flex aspect-w-7 aspect-h-5 w-full h-0"
                        src={source.background || ''}
                        fill
                        sizes="(max-width: 600px) 480px, (max-width: 1024px) 768px, 1000px"
                    />
                </div>
                <div className="absolute top-3 inset-x-3 flex">
                    <div className="py-1 px-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center leading-none text-xs font-medium">
                        {source.newsCount[0].count}{' '}
                        <ArrowRightIcon className="w-5 h-5 text-yellow-600 ml-3" />
                    </div>
                </div>
            </div>
            <div className="-mt-8 m-8 text-center">
                <Avatar
                    containerClassName="ring-2 ring-white"
                    sizeClass="w-16 h-16 text-2xl"
                    radius="rounded-full"
                    imgUrl={source.image}
                    userName={source.name}
                />
                <div className="mt-3">
                    <h2 className="text-base font-medium">
                        <span className="line-clamp-1">{source.name}</span>
                    </h2>
                    <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate">
                        {source.url}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default CardSourceBox
