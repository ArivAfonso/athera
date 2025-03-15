// import WidgetAddSubscriberForm from '@/components/WidgetAddSubscriberForm/WidgetAddSubscriberForm'
import WidgetAuthor from '@/components/WidgetAuthor/WidgetAuthor'
import WidgetSocialsFollow from '@/components/WidgetSocialsFollow/WidgetSocialsFollow'
import WidgetTopics from '@/components/WidgetTopics/WidgetTopics'
import AuthorType from '@/types/AuthorType'
import TopicType from '@/types/TopicType'
import React, { FC } from 'react'

export interface SidebarProps {
    className?: string
    topics: TopicType[]
    author: AuthorType
    showSidebar: boolean
}

export const Sidebar: FC<SidebarProps> = ({
    className = 'space-y-6 ',
    topics,
    author,
    showSidebar,
}) => {
    if (!showSidebar) return null

    return (
        <div className={`SingleSidebar ${className}`}>
            {/* <WidgetAddSubscriberForm /> */}

            <WidgetAuthor author={author} />

            <WidgetTopics topics={topics || []} />
        </div>
    )
}
