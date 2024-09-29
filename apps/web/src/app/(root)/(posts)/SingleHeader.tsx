'use client'

import React, { FC, useEffect, useRef } from 'react'
import TopicBadgeList from '@/components/TopicBadgeList/TopicBadgeList'
import SingleTitle from './SingleTitle'
import PostMeta2 from '@/components/PostMeta2/PostMeta2'
import SingleMetaAction2 from './SingleMetaAction2'
import AuthorType from '@/types/AuthorType'
import PostTopicType from '@/types/PostTopicType'
import { createClient } from '@/utils/supabase/client'

export interface SingleHeaderProps {
    hiddenDesc?: boolean
    titleMainClass?: string
    className?: string
    description: string
    topic: PostTopicType[]
    estimatedReadingTime: number
    title: string
    author: AuthorType
    created_at: string
    likes: number
    comments: number
    id: string
}

const SingleHeader: FC<SingleHeaderProps> = ({
    titleMainClass,
    hiddenDesc = false,
    className = '',
    description = '',
    topic,
    title = '',
    created_at,
    comments,
    likes,
    estimatedReadingTime,
    id,
    author,
}) => {
    const ref = useRef(null)

    const onVisible = async () => {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getUser()

        if (!session.user) {
            return
        }
        await supabase
            .from('watch_history')
            .upsert(
                [
                    {
                        post: id,
                        user_id: session.user.id,
                        created_at: new Date().toISOString(),
                    },
                ],
                { onConflict: 'post, user_id' }
            )
            .select('*')
    }

    useEffect(() => {
        const observer = new IntersectionObserver(async ([entry]) => {
            if (entry.isIntersecting) {
                await onVisible()
            }
        })

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [])

    return (
        <>
            <div ref={ref} className={`SingleHeader ${className}`}>
                <div className="space-y-5">
                    <TopicBadgeList
                        itemClass="!px-3"
                        topics={topic}
                        shorten={false}
                    />
                    <SingleTitle mainClass={titleMainClass} title={title} />
                    {!hiddenDesc && (
                        <span className="block text-base text-neutral-500 md:text-lg dark:text-neutral-400 pb-1">
                            {description}
                        </span>
                    )}
                    <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end space-y-5 sm:space-y-0 sm:space-x-5">
                        <PostMeta2
                            size="large"
                            className="leading-none flex-shrink-0"
                            hiddenTopics
                            avatarRounded="rounded-full shadow-inner"
                            estimatedReadingTime={estimatedReadingTime}
                            author={author}
                            publishedAt={new Date(
                                created_at
                            ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        />
                        <SingleMetaAction2
                            likes={likes}
                            title={title}
                            id={id}
                            author={author}
                            comments={comments}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SingleHeader
