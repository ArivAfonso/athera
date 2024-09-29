import React, { Suspense } from 'react'
import { Img } from 'ui'
import SingleHeader from '@/app/(root)/(posts)/SingleHeader'
import SingleContent from '../../SingleContent'
import SingleRelatedPosts from '../../SingleRelatedPosts'
import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import PostType from '@/types/PostType'
import stringToSlug from '@/utils/stringToSlug'

async function getPostData(context: { params: { slug: any } }) {
    const supabase = createClient(cookies())

    const id = context.params.slug[1]
    const { data, error } = await supabase
        .from('posts')
        .select(
            `
            title,
            id,
            json,
            created_at,
            estimatedReadingTime,
            description,
            image,
            license,
            author (
                name,
                id,
                username,
                avatar
            ),
            post_topics(topic:topics(id,name,color)),
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
    console.log(postData, error)
    const { data: session } = await supabase.auth.getUser()
    //@ts-ignore
    postData[0].isLiked = false
    //@ts-ignore
    data[0].likes.forEach((like: any) => {
        if (like.liker.id === session.user?.id) {
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
        keywords: data.post_topics.map((topic) => topic.topic.name),
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
    const supabase = createClient(cookies())
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
    const { data: session } = await supabase.auth.getUser()

    // Query the comment_likes table to get the number of likes for each comment and whether the current user has liked each comment.
    const { data: commentLikes, error: errorComment } = await supabase
        .from('comment_likes')
        .select('comment, liker')
        .eq('liker', session.user ? session.user?.id : '')

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
    return data
}

const PageSingle = async (context: any) => {
    const supabase = createClient(cookies())
    const postData = await getPostData(context)
    const commentData = await getCommentData(context)
    const { data: session } = await supabase.auth.getUser()
    const currentUserID = session.user?.id

    const data: PostType = postData
    if (!data) {
        // Handle the case where data is undefined
        return <div>Post not found</div>
    }
    return (
        <>
            <div className={`PageSingle pt-8 lg:pt-16`}>
                <header className="container rounded-xl">
                    <div className="max-w-screen-md mx-auto">
                        <SingleHeader
                            description={data.description}
                            likes={data.likeCount[0].count as number}
                            estimatedReadingTime={data.estimatedReadingTime}
                            title={data.title}
                            topic={data.post_topics}
                            author={data.author}
                            created_at={data.created_at ? data.created_at : ''}
                            comments={data.commentCount[0].count as number}
                            id={data.id}
                        />
                    </div>
                </header>
                <Img
                    alt="single"
                    containerClassName="container my-10 sm:my-12 flex justify-center items-center"
                    className="rounded-xl"
                    src={data.image}
                    width={800} // Adjust the desired width
                    height={480} // Adjust the desired height
                />
                <div className="container mt-10">
                    <SingleContent
                        body={data.rawText}
                        author={data.author}
                        json={data.json}
                        id={data.id}
                        //@ts-ignore
                        currentUserID={currentUserID ? currentUserID : ''}
                        likeCount={data.likeCount[0].count as number}
                        isLiked={data.isLiked}
                        license={data.license}
                        commentCount={
                            commentData?.length ? commentData.length : 0
                        }
                    />
                </div>

                {/* RELATED POSTS */}
                <SingleRelatedPosts id={data.id} authorId={data.author.id} />
            </div>
        </>
    )
}

export default PageSingle
