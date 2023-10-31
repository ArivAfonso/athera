import React, { FC } from 'react'
import PostBookmark from '@/components/PostBookmark/PostBookmark'
import PostCardLikeAndComment from '@/components/PostCardLikeAndComment/PostCardLikeAndComment'
import CategoryBadgeList from '@/components/CategoryBadgeList/CategoryBadgeList'
import PostFeaturedMedia from '../PostFeaturedMedia/PostFeaturedMedia'
import PostTypeFeaturedIcon from '../PostTypeFeaturedIcon/PostTypeFeaturedIcon'
import Link from 'next/link'
import Image from 'next/image'
import PostType from '@/types/PostType'
import stringToSlug from '@/utils/stringToSlug'

export interface Card9Props {
    className?: string
    ratio?: string
    post: PostType
    hoverClass?: string
}

const Card9: FC<Card9Props> = ({
    className = 'h-full',
    ratio = 'aspect-w-3 aspect-h-3 sm:aspect-h-4',
    post,
    hoverClass = '',
}) => {
    post.created_at = new Date(
        post.created_at ? post.created_at : ''
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    const imageUrl = post.image
    const renderMeta = () => {
        return (
            <div className="inline-flex items-center text-xs text-neutral-300">
                <div className="block ">
                    <h2 className="block text-base sm:text-lg font-semibold text-white ">
                        <span className="line-clamp-2" title={post.title}>
                            {post.title}
                        </span>
                    </h2>
                    <Link
                        href={`/author/${post.author.username}`}
                        className="flex mt-2.5 relative"
                    >
                        <span className="block text-neutral-200 hover:text-white font-medium truncate">
                            {post.author.name}
                        </span>
                        <span className="mx-[6px] font-medium">·</span>
                        <span className="font-normal truncate">
                            {post.created_at}
                        </span>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div
            className={`nc-Card9 relative flex flex-col group rounded-3xl overflow-hidden z-0 ${hoverClass} ${className}`}
        >
            <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-between transition-all opacity-0 z-[-1] group-hover:opacity-100 group-hover:z-10 duration-300">
                <PostCardLikeAndComment
                    likes={post.likeCount[0].count}
                    liked={post.isLiked}
                    comments={post.commentCount[0].count}
                    id={post.id}
                    className="relative"
                />
                <PostBookmark
                    isBookmarked={post.isBookmarked}
                    className="relative"
                    postId={post.id}
                />
            </div>
            <div className={`flex items-start relative w-full ${ratio}`}></div>
            <Link href={`/post/${stringToSlug(post.title)}/${post.id}`}>
                <Image
                    fill
                    alt=""
                    className="object-cover w-full h-full rounded-3xl"
                    src={imageUrl}
                    sizes="(max-width: 600px) 480px, 500px"
                />
                <PostTypeFeaturedIcon
                    className="absolute top-3 left-3 group-hover:hidden"
                    wrapSize="w-7 h-7"
                    iconSize="w-4 h-4"
                />
                <span className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            <Link
                href={`/post/${stringToSlug(post.title)}/${post.id}`}
                className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black opacity-50"
            ></Link>
            <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col flex-grow items-start">
                <Link
                    href={`/post/${stringToSlug(post.title)}/${post.id}`}
                    className="absolute inset-0"
                ></Link>
                <div className="mb-3 left-3">
                    <CategoryBadgeList
                        chars={29}
                        categories={post.post_categories}
                    />
                </div>
                {renderMeta()}
            </div>
        </div>
    )
}

export default Card9
