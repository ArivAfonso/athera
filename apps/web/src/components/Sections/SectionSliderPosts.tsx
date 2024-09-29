'use client'

import React, { FC, useState } from 'react'
import { Heading } from 'ui'
import Card9 from '@/components/Card9/Card9'
// import Card10 from "@/components/Card10/Card10";
// import Card11 from "@/components/Card11/Card11";
// import Card10V2 from "@/components/Card10/Card10V2";
import MySlider from '@/components/MySlider'
import PostType from '@/types/PostType'
import Card11 from '../Card11/Card11'

export interface SectionSliderPostsProps {
    className?: string
    heading: string
    subHeading?: string
    posts: PostType[]
    postCardName?: 'card4' | 'card7' | 'card9' | 'card10' | 'card11'
    perView?: 2 | 3 | 4
}

const SectionSliderPosts: FC<SectionSliderPostsProps> = ({
    heading,
    subHeading,
    className = '',
    posts,
    postCardName = 'card4',
    perView = 4,
}) => {
    let CardComponent = Card9

    const [myPosts, setPosts] = useState<PostType[]>(posts)

    switch (postCardName) {
        case 'card9':
            CardComponent = Card9
            break
        default:
            break
    }

    const handleHidePost = (id: string) => {
        //Filter out the post with the id
        const filteredPosts = posts.filter((post) => post.id !== id)
        //Set the new posts
        setPosts(filteredPosts)
    }

    return (
        <div className={`SectionSliderPosts ${className}`}>
            <Heading desc={subHeading} isCenter>
                {heading}
            </Heading>

            <MySlider
                data={myPosts}
                renderItem={(item, indx) => (
                    <Card9 key={indx} post={item} onHidePost={handleHidePost} />
                )}
                itemPerRow={perView}
            />
        </div>
    )
}

export default SectionSliderPosts
