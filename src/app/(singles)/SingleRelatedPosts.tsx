import React, { FC } from 'react'
import Heading from '@/components/Heading/Heading'
import Card11 from '@/components/Card11/Card11'
import Card9 from '@/components/Card9/Card9'
import { DEMO_POSTS } from '@/data/posts'
import { Route } from '@/routers/types'

export interface RelatedPostsType {
    latestPostsInCategory: {
        title: string
        slug: {
            _type: string
            current: string
        }
        publishedAt: string
        mainImage: {
            asset: {
                _ref: string
                _type: string
            }
            _type: string
        }
        categories: {
            title: string
            slug: {
            _type: string
            current: string
        }
            color: string
        }[]
        author: {
            name: string
            slug: {
            _type: string
            current: string
        }
            image: {
                asset: {
                    _ref: string
                    _type: string
                }
                _type: string
            }
        }
    }[]
}

export interface SingleRelatedPostsProps {
    posts: RelatedPostsType
}

const SingleRelatedPosts: FC<SingleRelatedPostsProps> = ({ posts }) => {
    return (
        <div className="relative bg-neutral-100 dark:bg-neutral-800 py-16 lg:py-28 mt-16 lg:mt-28">
            {/* RELATED  */}
            <div className="container">
                <div>
                    <Heading
                        className="mb-10 text-neutral-900 dark:text-neutral-50"
                        desc=""
                    >
                        Related posts
                    </Heading>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {posts.latestPostsInCategory.map((post, key) => (
                            <Card11 key={key} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleRelatedPosts
