'use client'

import React, { FC, useState } from 'react'
import Card2 from '@/components/Card2/Card2'
import Card6 from '@/components/Card6/Card6'
import HeaderFilter from './HeaderFilter'
import PostType from '@/types/PostType'

export interface SectionMagazine1Props {
    posts: PostType[]
    heading?: string
    className?: string
}

const SectionMagazine1: FC<SectionMagazine1Props> = ({
    posts,
    heading = 'Latest Articles 🎈 ',
    className = '',
}) => {
    const [myPosts, setPosts] = useState<PostType[]>(posts)

    const handleHidePost = (id: string) => {
        //Filter out the post with the id
        const filteredPosts = posts.filter((post) => post.id !== id)
        //Set the new posts
        setPosts(filteredPosts)
    }

    return (
        <div className={`SectionMagazine1 ${className}`}>
            <HeaderFilter heading={heading} />
            {!posts.length && <span>Nothing we found!</span>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {posts[0] && <Card2 size="large" post={posts[0]} />}
                <div className="grid gap-6 md:gap-8">
                    {myPosts
                        .filter((_, i) => i < 4 && i > 0)
                        .map((item, index) => (
                            <Card6
                                onHidePost={handleHidePost}
                                key={index}
                                post={item}
                            />
                        ))}
                </div>
            </div>
        </div>
    )
}

export default SectionMagazine1
