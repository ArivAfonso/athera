import React, { FC } from 'react'
import { BadgeColor } from '@/types/BadgeColorType'
import Badge from '../Badge/Badge'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import TopicType from '@/types/TopicType'

export interface CardTopic5Props {
    className?: string
    topic: TopicType
}

const CardTopic5: FC<CardTopic5Props> = ({ className = '', topic }) => {
    return (
        <Link
            href={`/topic/${encodeURIComponent(topic.name)}`}
            className={`CardTopic5 relative block group ${className}`}
        >
            <div
                className={`flex-shrink-0 relative w-full aspect-w-8 aspect-h-5 h-0 rounded-3xl overflow-hidden z-0 group`}
            >
                <span className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-colors"></span>
            </div>
            <Badge
                className="absolute top-3 right-3"
                color={topic.color.toLowerCase() as BadgeColor}
                href={`/topic/${topic.name}`}
                name={
                    <div className="flex items-center">
                        {topic.newsCount[0].count}
                        <ArrowRightIcon className="ml-1.5 w-3.5 h-3.5" />
                    </div>
                }
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <h2
                    className={`text-base font-medium px-4 py-2 sm:px-6 sm:py-3 bg-white text-neutral-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-full border-2 border-white border-opacity-60`}
                >
                    {topic.name}
                </h2>
            </div>
        </Link>
    )
}

export default CardTopic5
