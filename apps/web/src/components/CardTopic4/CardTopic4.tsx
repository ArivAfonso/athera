import React, { FC } from 'react'
import { BadgeColor } from '@/types/BadgeColorType'
import Link from 'next/link'
import TopicType from '@/types/TopicType'
import Image from 'next/image'
import Badge from '../Badge/Badge'
import { Img } from 'ui'

export interface CardTopic4Props {
    className?: string
    topic: TopicType
    index?: string
}

const CardTopic4: FC<CardTopic4Props> = ({ className = '', topic, index }) => {
    const getColorClass = () => {
        switch (topic.color.toLowerCase()) {
            case 'pink':
                return 'bg-pink-500'
            case 'red':
                return 'bg-red-500'
            case 'gray':
                return 'bg-gray-500'
            case 'green':
                return 'bg-green-500'
            case 'purple':
                return 'bg-purple-500'
            case 'indigo':
                return 'bg-indigo-500'
            case 'yellow':
                return 'bg-yellow-500'
            case 'blue':
                return 'bg-blue-500'
            default:
                return 'bg-pink-500'
        }
    }
    return (
        <Link
            href={`/topic/${topic.name}/${topic.id}`}
            className={`CardTopic4 flex flex-col ${className}`}
        >
            <div className="flex-shrink-0 relative w-full aspect-w-7 aspect-h-5 h-0 rounded-3xl overflow-hidden group">
                <Img
                    alt="taxonomies"
                    fill
                    src={topic.image ? topic.image : ''}
                    className="object-cover w-full h-full rounded-2xl"
                    sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
                />
                <div>
                    {index && (
                        <Badge
                            color={topic.color.toLowerCase() as BadgeColor}
                            name={index}
                            href={`/topic/${topic.name}/${topic.id}`}
                            className="absolute top-3 left-3"
                        />
                    )}
                </div>
                <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
            </div>

            <div className="flex items-center mt-5">
                <div
                    className={`w-9 h-9 ${getColorClass()} rounded-full`}
                ></div>
                <div className="ml-4">
                    <h2 className="text-base text-neutral-900 dark:text-neutral-100 font-medium">
                        {topic.name}
                    </h2>
                    {topic.newsCount && (
                        <span className="block text-sm text-neutral-500 dark:text-neutral-400">
                            {topic.newsCount[0].count} Articles
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default CardTopic4
