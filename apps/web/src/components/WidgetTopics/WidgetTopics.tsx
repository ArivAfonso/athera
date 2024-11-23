import Heading2 from '../Heading2/Heading2'
import { FC } from 'react'
import CardTopic6 from '../CardTopic6/CardTopic6'
import TopicType from '@/types/TopicType'
import CardTopic6Skeleton from '../CardTopic6/CardTopic6Skeleton'

export interface WidgetTopicsProps {
    className?: string
    topics?: TopicType[] | null
    isLoading?: boolean
}

const WidgetTopics: FC<WidgetTopicsProps> = ({
    className = 'rounded-3xl border border-neutral-100 dark:border-neutral-700',
    topics,
    isLoading,
}) => {
    return (
        <div className={`WidgetTopics overflow-hidden ${className}`}>
            <Heading2 title="My Topics" />
            <div className="flow-root">
                <div className="flex flex-col">
                    {isLoading ? (
                        <>
                            <CardTopic6Skeleton className="p-4 xl:p-5" />
                            <CardTopic6Skeleton className="p-4 xl:p-5" />
                            <CardTopic6Skeleton className="p-4 xl:p-5" />
                            <CardTopic6Skeleton className="p-4 xl:p-5" />
                            <CardTopic6Skeleton className="p-4 xl:p-5" />
                        </>
                    ) : (
                        topics?.map((topic) => (
                            <CardTopic6
                                className="px-4 py-3 transition-colors"
                                key={topic.id}
                                topic={topic}
                                size="normal"
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default WidgetTopics
