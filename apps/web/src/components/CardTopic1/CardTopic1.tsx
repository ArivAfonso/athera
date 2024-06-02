import React, { FC } from 'react'
import Link from 'next/link'
import TopicType from '@/types/TopicType'

export interface CardTopic1Props {
    className?: string
    topic: TopicType
    size?: 'large' | 'normal'
}

const CardTopic1: FC<CardTopic1Props> = ({
    className = '',
    size = 'normal',
    topic,
}) => {
    return (
        <Link
            href={`/topic/${encodeURIComponent(topic.name)}`}
            className={`CardTopic1 flex items-center ${className}`}
        >
            <div>
                <h2
                    className={`${
                        size === 'large' ? 'text-lg' : 'text-base'
                    } nc-card-title text-neutral-900 dark:text-neutral-100 text-sm sm:text-base font-medium sm:font-semibold`}
                >
                    {topic.name}
                </h2>
                <span
                    className={`${
                        size === 'large' ? 'text-sm' : 'text-xs'
                    } block mt-[2px] text-neutral-500 dark:text-neutral-400`}
                >
                    {topic.postCount[0].count} Articles
                </span>
            </div>
        </Link>
    )
}

export default CardTopic1
