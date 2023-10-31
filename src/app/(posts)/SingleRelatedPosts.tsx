'use client'

import React, { FC, useEffect, useState } from 'react'
import Heading from '@/components/Heading/Heading'
import Card11 from '@/components/Card11/Card11'
import PostType from '@/types/PostType'
import Card9 from '@/components/Card9/Card9'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface RelatedPostsType {
    latestPostsInCategory: PostType[]
}

async function getAuthorPosts(id: string) {
    const supabase = createClientComponentClient()
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
        post_categories(category:categories(id,name,color)),
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
        .limit(4)

    return data
}

async function getRelatedPosts(id: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase.rpc('related_posts', {
        post_id: id,
        match_threshold: 0.00001,
        match_count: 10,
    })

    data.map((post: any) => {
        post.likeCount = post.likecount
        post.commentCount = post.commentcount
    })
    console.log(data)
    return data
}

export interface SingleRelatedPostsProps {
    id: string
    authorId: string
}

const SingleRelatedPosts: FC<SingleRelatedPostsProps> = ({ id, authorId }) => {
    const [authorPosts, setAuthorPosts] = useState<PostType[]>([])
    const [relatedPosts, setRelatedPosts] = useState<PostType[]>([])

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
                {relatedPosts.length >= 1 && (
                    <div>
                        <Heading
                            className="mb-10 text-neutral-900 dark:text-neutral-50"
                            desc=""
                        >
                            Related posts
                        </Heading>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {relatedPosts.map((post, key) => (
                                <Card11 key={key} post={post} />
                            ))}
                        </div>
                    </div>
                )}

                {/* MORE FROM AUTHOR */}
                {authorPosts.length >= 1 && (
                    <div className="mt-20">
                        <Heading
                            className="mb-10 text-neutral-900 dark:text-neutral-50"
                            desc=""
                        >
                            More from author
                        </Heading>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {authorPosts.map((post, key) => (
                                <Card9 key={key} post={post} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SingleRelatedPosts
