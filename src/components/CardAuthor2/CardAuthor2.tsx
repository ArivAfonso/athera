import React, { FC } from 'react'
import { PostDataType } from '@/data/types'
import Avatar from '@/components/Avatar/Avatar'
import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '@/lib/sanityClient'

function urlFor(source: any) {
    return imageUrlBuilder(sanityClient).image(source)
}

interface AuthorType {
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
    date: string
}

export interface CardAuthor2Props extends AuthorType {
    className?: string
    readingTime?: PostDataType['readingTime']
    hoverReadingTime?: boolean
}

const CardAuthor2: FC<CardAuthor2Props> = ({
    className = '',
    author,
    readingTime,
    date,
    hoverReadingTime = true,
}) => {
    const avatar = urlFor(author.image).url() || ''
    return (
        // <Link
        //   href={`/author/${author.slug}`}
        //   className={`nc-CardAuthor2 relative inline-flex items-center ${className}`}
        // >
        <>
            <Avatar
                sizeClass="h-10 w-10 text-base"
                containerClassName="flex-shrink-0 mr-3"
                radius="rounded-full"
                imgUrl={avatar}
                userName={author.name}
            />
            <div>
                <h2
                    className={`text-sm text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium`}
                >
                    {author.name}
                </h2>
            </div>
        </>
    )
}

export default CardAuthor2
