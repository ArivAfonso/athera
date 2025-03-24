import React, { FC } from 'react'
import Link from 'next/link'
import TopicType from '@/types/TopicType'

export interface CardTopic2Props {
    className?: string
    topic: TopicType
    index?: string
}

const CardTopic2: FC<CardTopic2Props> = ({ className = '', topic, index }) => {
    return (
        <Link
            href={`/topic/${encodeURIComponent(topic.name)}/${topic.id}`}
            className={`CardTopic2 relative flex flex-col items-center justify-center text-center px-3 py-5 sm:p-6 bg-neutral-100 dark:bg-neutral-900 rounded-3xl transition-colors ${className}`}
        >
            <div className="mt-3">
                <h2 className={`text-base font-semibold`}>{topic.name}</h2>
                <span
                    className={`block mt-1 text-sm text-neutral-500 dark:text-neutral-400`}
                >
                    {topic.newsCount[0].count} Articles
                </span>
            </div>
        </Link>
    )
}

export default CardTopic2
