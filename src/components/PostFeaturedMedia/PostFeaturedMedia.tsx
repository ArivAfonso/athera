'use client'

import React, { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Route } from '@/routers/types'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '@/lib/sanityClient'

function urlFor(source: any) {
    return imageUrlBuilder(sanityClient).image(source)
}

interface PostDataType {
    title: string
    author: {
        name: string
        image: {
            asset: {
                _ref: string
                _type: string
            }
            _type: string
        }
        slug: {
            _type: string
            current: string
        }
    }
    publishedAt: string
    slug: {
            _type: string
            current: string
        }
    mainImage: {
        asset: {
            _ref: string
            _type: string
        }
        _type: string
    }
}

export interface PostFeaturedMediaProps {
    className?: string
    post: PostDataType
    isHover?: boolean
}

const PostFeaturedMedia: FC<PostFeaturedMediaProps> = ({
    className = 'w-full h-full',
    post,
    isHover = false,
}) => {
    if (post.mainImage === undefined) {
        console.log(post)
        return <h1>No Post today</h1>
    }

    const imageUrl = urlFor(post.mainImage.asset._ref).url()
    return (
        <div className={`nc-PostFeaturedMedia relative ${className}`}>
            <Image
                alt="featured"
                fill
                className="object-cover"
                src={imageUrl}
                sizes="(max-width: 600px) 480px, 800px"
            />
            <Link
                href={`/single/${encodeURIComponent(post.slug.current)}`}
                className={`block absolute inset-0 bg-black/20 transition-opacity opacity-0 group-hover:opacity-100`}
            />
        </div>
    )
}

export default PostFeaturedMedia
