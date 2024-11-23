import React, { Suspense } from 'react'
import { Img } from 'ui'
import SingleHeader from '../../SingleHeader'
import SingleContent from '../../SingleContent'
import SingleRelatedPosts from '../../SingleRelatedPosts'
import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import PostType from '@/types/PostType'
import stringToSlug from '@/utils/stringToSlug'
import { Sidebar } from '../../Sidebar'

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
                avatar,
                created_at,
                postCount:posts(count),
                customization(
                    font_title,
                    font_body,
                    color,
                    sidebar
                )
            ),
            post_topics (
                topic:topics (
                    id,
                    name,
                    color,
                    image,
                    postCount:post_topics(count)
                )
            ),
            likeCount:likes(count),
            commentCount:comments(count),
            likes (
                liker (
                    id
                )
            )
        `
        )
        .eq('id', id)
        .single()
    const postData: PostType | null = data as unknown as PostType

    console.log(data)
    const { count: followerData, error: followerErr } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following', postData.author.id)

    const { count: followingData, error: followingErr } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower', postData.author.id)

    //@ts-ignore
    postData.author.followerCount = followerData
    //@ts-ignore
    postData.author.followingCount = followingData
    const { data: session } = await supabase.auth.getUser()
    postData.isLiked = false
    data?.likes.forEach((like: any) => {
        if (like.liker.id === session.user?.id) {
            postData.isLiked = true
        }
    })
    return postData
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
    const showSidebar = true
    let theme = ''

    switch (postData.author.customization.color) {
        case 'topaz':
            theme = 'topaz'
            break
        case 'saffron':
            theme = 'saffron'
            break
        default:
            theme = ''
    }

    const data: PostType = postData
    if (!data) {
        // Handle the case where data is undefined
        return <div>Post not found</div>
    }
    return (
        <>
            <div
                className={`PageSingle pt-8 lg:pt-16 ${theme} ${showSidebar ? 'lg:flex lg:space-x-8' : ''}`}
            >
                <div className={`container ${showSidebar ? 'lg:w-3/4' : ''}`}>
                    <header className="rounded-xl">
                        <div className="max-w-screen-md mx-auto">
                            <SingleHeader
                                description={data.description}
                                likes={data.likeCount[0].count as number}
                                estimatedReadingTime={data.estimatedReadingTime}
                                title={data.title}
                                topic={data.post_topics}
                                author={data.author}
                                created_at={
                                    data.created_at ? data.created_at : ''
                                }
                                font={data.author.customization.font_title}
                                comments={data.commentCount[0].count as number}
                                id={data.id}
                            />
                        </div>
                    </header>
                    <Img
                        alt="single"
                        containerClassName="my-10 sm:my-12 flex justify-center items-center"
                        className="rounded-xl"
                        src={data.image}
                        width={800} // Adjust the desired width
                        height={480} // Adjust the desired height
                    />
                    <div className="mt-10">
                        <SingleContent
                            body={data.rawText}
                            author={data.author}
                            json={data.json}
                            id={data.id}
                            currentUserID={currentUserID ? currentUserID : ''}
                            likeCount={data.likeCount[0].count as number}
                            isLiked={data.isLiked}
                            license={data.license}
                            commentCount={
                                commentData?.length ? commentData.length : 0
                            }
                            font={data.author.customization.font_body}
                        />
                    </div>
                </div>
                {data.author.customization.sidebar && (
                    <div className="lg:w-1/4">
                        <Sidebar
                            topics={data.post_topics.map((topic) => ({
                                ...topic.topic,
                                postCount: topic.topic.postCount || [
                                    { count: 0 },
                                ],
                            }))}
                            author={data.author}
                            showSidebar={showSidebar}
                        />
                    </div>
                )}
            </div>
            {/* RELATED POSTS */}
            <div className="mt-10 w-full">
                <SingleRelatedPosts id={data.id} authorId={data.author.id} />
            </div>
        </>
    )
}

export default PageSingle
