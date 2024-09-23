import React, { FC } from 'react'
import { Heading } from 'ui'
import Card5 from '@/components/Card5/Card5'
import PostType from '@/types/PostType'

export interface SectionTrendingProps {
    posts: { posts: PostType }[]
    heading?: string
    className?: string
}

const SectionTrending: FC<SectionTrendingProps> = ({
    posts,
    heading = 'Trending on Athera',
    className = '',
}) => {
    return (
        <div className={`SectionTrending relative ${className}`}>
            {!!heading && <Heading>{heading}</Heading>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {posts.map((post, key) => {
                    return <Card5 key={key} post={post.posts} />
                })}
            </div>
        </div>
    )
}

export default SectionTrending
