import React, { Suspense } from 'react'
import NcImage from '@/components/NcImage/NcImage'
import SingleHeader from '@/app/(posts)/SingleHeader'
import SingleContent from '../../SingleContent'
import SingleRelatedPosts from '../../SingleRelatedPosts'
import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import PostType from '@/types/PostType'
import stringToSlug from '@/utils/stringToSlug'

export const runtime = 'edge'

async function getPostData(context: { params: { slug: any } }) {
    const supabase = createServerComponentClient({ cookies })

    const id = context.params.slug[1]
    const { data, error } = await supabase
        .from('posts')
        .select(
            `
        title,
        id,
        text,
        rawText,
        created_at,
        estimatedReadingTime,
        description,
        image,
        author (
            name,
            id,
            username,
            avatar
        ),
        post_categories(category:categories(id,name,color)),
        likeCount:likes(count),
        commentCount:comments(count),
        likes(
            liker(
                id
            )
        )
        `
        )
        .eq('id', id)
    const postData: PostType | null = data as unknown as PostType
    const { data: session } = await supabase.auth.getSession()
    //@ts-ignore
    postData[0].isLiked = false
    //@ts-ignore
    data[0].likes.forEach((like: any) => {
        if (like.liker.id === session.session?.user.id) {
            //@ts-ignore
            postData[0].isLiked = true
        }
    })
    //@ts-ignore
    return postData[0]
}

export async function generateMetadata(
    props: any,
    searchParams: any
): Promise<Metadata> {
    const data: PostType = await getPostData(props)

    return {
        title: data.title,
        description: data.description,
        authors: [{ name: data.author.name }],
        keywords: data.post_categories.map(
            (category) => category.category.name
        ),
        openGraph: {
            title: data.title,
            description: data.description,
            url: `https://www.example.com/${stringToSlug(data.title)}`,
            publishedTime: data.created_at,
            type: 'article',
            images: [
                {
                    url: data.image,
                    width: 800,
                    height: 480,
                    alt: data.title,
                },
            ],
        },
    }
}

async function getCommentData(context: { params: { slug: any } }) {
    const supabase = createServerComponentClient({ cookies })
    const id = context.params.slug[1]
    const { data, error } = await supabase
        .from('comments')
        .select(
            'id, comment, created_at, commenter(name, username, avatar, id)'
        )
        .eq('post', id)
        .order('created_at', { ascending: true })

    if (error) {
        // Handle the error.
        return
    }

    // Get the current user's ID.
    const { data: session } = await supabase.auth.getSession()

    // Query the comment_likes table to get the number of likes for each comment and whether the current user has liked each comment.
    const { data: commentLikes, error: errorComment } = await supabase
        .from('comment_likes')
        .select('comment, liker')
        .eq('liker', session.session ? session.session.user.id : '')

    // Add the likes and is_liked_by_current_user properties to each comment.
    data.forEach((comment) => {
        //@ts-ignore
        comment.likes = commentLikes?.filter(
            (like) => like.comment === comment.id
        ).length
        //@ts-ignore
        comment.is_liked_by_current_user = commentLikes?.find(
            (like) => like.comment === comment.id
        )
    })
    console.log(data)
    return data
}

const PageSingle = async (context: any) => {
    const supabase = createServerComponentClient({ cookies })
    const postData = await getPostData(context)
    const commentData = await getCommentData(context)
    const { data: session } = await supabase.auth.getSession()
    const currentUserID = session?.session?.user.id

    const data: PostType = postData
    if (!data) {
        // Handle the case where data is undefined
        return <div>Post not found</div>
    }
    return (
        <>
            <div className={`nc-PageSingle pt-8 lg:pt-16`}>
                <Suspense
                    fallback={
                        <div className="animate-pulse max-w-screen-md mx-auto">
                            <div className="bg-gray-300 dark:bg-gray-700 h-6 w-3/4 mb-4 rounded-lg"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/2 mb-2 rounded-lg"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/4 mb-2 rounded-lg"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 h-4 w-3/4 mb-2 rounded-lg"></div>
                        </div>
                    }
                >
                    <header className="container rounded-xl">
                        <div className="max-w-screen-md mx-auto">
                            <SingleHeader
                                description={data.description}
                                likes={data.likeCount[0].count as number}
                                estimatedReadingTime={data.estimatedReadingTime}
                                title={data.title}
                                category={data.post_categories}
                                author={data.author}
                                created_at={
                                    data.created_at ? data.created_at : ''
                                }
                                comments={data.commentCount[0].count}
                                id={data.id}
                            />
                        </div>
                    </header>
                </Suspense>

                <Suspense
                    fallback={
                        <div className="animate-pulse container my-10 sm:my-12 flex justify-center items-center rounded-xl">
                            <div className="bg-gray-300 dark:bg-gray-700 h-48 w-64"></div>
                        </div>
                    }
                >
                    <NcImage
                        alt="single"
                        containerClassName="container my-10 sm:my-12 flex justify-center items-center"
                        className="rounded-xl"
                        src={data.image}
                        width={800} // Adjust the desired width
                        height={480} // Adjust the desired height
                    />
                </Suspense>
                {/* SINGLE MAIN CONTENT */}
                <Suspense
                    fallback={
                        <div className="animate-pulse">
                            <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full mb-4 rounded-lg"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full mb-4 rounded-lg"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full mb-4 rounded-lg"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full mb-4 rounded-lg"></div>
                        </div>
                    }
                >
                    <div className="container mt-10">
                        <SingleContent
                            body={data.rawText}
                            author={data.author}
                            id={data.id}
                            //@ts-ignore
                            currentUserID={currentUserID ? currentUserID : ''}
                            likeCount={data.likeCount[0].count}
                            isLiked={data.isLiked}
                            commentCount={
                                commentData?.length ? commentData.length : 0
                            }
                        />
                    </div>
                </Suspense>

                {/* RELATED POSTS */}
                <SingleRelatedPosts id={data.id} authorId={data.author.id} />
            </div>
        </>
    )
}

export default PageSingle
