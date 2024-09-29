'use client'

import React, { FC, useEffect, useState } from 'react'
import { Heading } from 'ui'
import Card11 from '@/components/Card11/Card11'
import PostType from '@/types/PostType'
import Card9 from '@/components/Card9/Card9'
import { createClient } from '@/utils/supabase/client'
import MySlider from '@/components/MySlider'

export interface RelatedPostsType {
    latestPostsInTopic: PostType[]
}

async function getAuthorPosts(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('posts')
        .select(
            `id,
        title,
        created_at,
        description,
        image,
        likeCount:likes(count),
        commentCount:comments(count),
        post_topics(topic:topics(id,name,color)),
        bookmarks(user(id)),
        likes(
            liker(
                id
            )
        ),
        author(
            name,
            username,
            avatar
        )`
        )
        .eq('author', id)
        .limit(20)

    return data
}

async function getRelatedPosts(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase.rpc('related_posts', {
        post_id: id,
        match_threshold: 0.8,
        match_count: 10,
    })

    data?.map((post: any) => {
        post.likeCount = post.likecount
        post.commentCount = post.commentcount
    })
    return data
}

export interface SingleRelatedPostsProps {
    id: string
    authorId: string
}

const SingleRelatedPosts: FC<SingleRelatedPostsProps> = ({ id, authorId }) => {
    const [authorPosts, setAuthorPosts] = useState<PostType[]>([])
    const [relatedPosts, setRelatedPosts] = useState<PostType[]>([])

    const handleHideRelatedPost = async (postId: string) => {
        //Update localStorage
        const hiddenPostsItem = localStorage.getItem('hiddenPosts')
        const hiddenPosts = hiddenPostsItem ? JSON.parse(hiddenPostsItem) : []

        localStorage.setItem(
            'hiddenPosts',
            JSON.stringify([...hiddenPosts, postId])
        )

        //Remove the post from the UI
        setRelatedPosts(relatedPosts?.filter((post) => post.id !== postId))
    }

    const handleHideAuthorPost = async (postId: string) => {
        //Update localStorage
        const hiddenPostsItem = localStorage.getItem('hiddenPosts')
        const hiddenPosts = hiddenPostsItem ? JSON.parse(hiddenPostsItem) : []

        localStorage.setItem(
            'hiddenPosts',
            JSON.stringify([...hiddenPosts, postId])
        )

        //Remove the post from the UI
        setAuthorPosts(authorPosts?.filter((post) => post.id !== postId))
    }

    useEffect(() => {
        const getData = async () => {
            const data = await getAuthorPosts(authorId)
            //@ts-ignore
            setAuthorPosts(data)
        }

        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const getData = async () => {
            const data = await getRelatedPosts(id)
            //@ts-ignore
            setRelatedPosts(data)
        }

        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="relative bg-neutral-100 dark:bg-neutral-800 pb-16 pt-4 mt-16 lg:mt-28">
            {/* RELATED  */}
            <div className="container">
                {relatedPosts.length >= 3 && (
                    <div>
                        <Heading
                            className="mb-10 text-neutral-900 dark:text-neutral-50"
                            desc=""
                        >
                            Related posts
                        </Heading>
                        <MySlider
                            data={authorPosts}
                            renderItem={(item, indx) => (
                                <Card9
                                    key={indx}
                                    post={item}
                                    onHidePost={handleHideRelatedPost}
                                />
                            )}
                            itemPerRow={4}
                        />
                    </div>
                )}

                {/* MORE FROM AUTHOR */}
                {authorPosts.length >= 3 && (
                    <div className="mt-20 px-3">
                        <Heading
                            className="mb-10 text-neutral-900 dark:text-neutral-50"
                            desc=""
                        >
                            More from author
                        </Heading>
                        <MySlider
                            data={authorPosts}
                            renderItem={(item, indx) => (
                                <Card9
                                    key={indx}
                                    post={item}
                                    onHidePost={handleHideAuthorPost}
                                />
                            )}
                            itemPerRow={4}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default SingleRelatedPosts
