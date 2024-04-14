import React, { FC } from 'react'
import Badge from '@/components/Badge/Badge'
import { TwMainColor } from '@/data/types'
import PostTopicType from '@/types/PostTopicType'

export interface TopicBadgeListProps {
    className?: string
    itemClass?: string
    shorten?: boolean
    chars?: number
    topics: PostTopicType[]
}

const TopicBadgeList: FC<TopicBadgeListProps> = ({
    className = 'flex flex-wrap gap-1.5',
    itemClass,
    shorten = true,
    chars,
    topics,
}) => {
    let renderableTopics = topics

    if (topics.length === 0) return null

    if (shorten) {
        let totalCharCount = 0
        renderableTopics = []

        for (const item of topics) {
            const nameLength = item.topic.name.length
            if (!chars || totalCharCount + nameLength < (chars || Infinity)) {
                renderableTopics.push(item)
                totalCharCount += nameLength
            } else {
                break
            }
        }
    }

    return (
        <div
            className={`nc-TopicBadgeList ${className}`}
            data-nc-id="TopicBadgeList"
        >
            {renderableTopics.map((item, index) => (
                <Badge
                    className={itemClass}
                    key={index}
                    name={item.topic.name}
                    href={`/topic/${encodeURIComponent(
                        item.topic.name.trim()
                    )}/${item.topic.id}`}
                    color={item.topic.color.toLowerCase() as TwMainColor}
                />
            ))}
        </div>
    )
}

export default TopicBadgeList

{
    /* <div
    className={`nc-TopicBadgeList ${className}`}
    data-nc-id="TopicBadgeList"
>
    {loading ? (
        // Render skeleton if loading is true
        Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} width={100} height={30} className={itemClass} />
        ))
    ) : ( */
}
