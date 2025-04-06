import React, { FC } from 'react'
import { Avatar } from 'ui'
import Link from 'next/link'
import SourceType from '@/types/SourceType'

export interface SourceSectionProps extends SourceType {
    className?: string
    source: SourceType
    readingTime?: number
    hoverReadingTime?: boolean
    date: string
}

const SourceSection: FC<SourceSectionProps> = ({ className = '', source }) => {
    const avatar = source.image || ''
    return (
        <Link
            href={`/source/${source.id}`}
            className={`SourceSection relative inline-flex items-center ${className}`}
        >
            <Avatar
                sizeClass="h-10 w-10 text-base"
                containerClassName="flex-shrink-0 mr-3"
                radius="rounded-full"
                imgUrl={avatar}
                userName={source.name}
            />
            <div>
                <h2
                    className={`text-sm text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium`}
                >
                    {source.name}
                </h2>
            </div>
        </Link>
    )
}

export default SourceSection
