'use client'

import PostType from '@/types/PostType'
import Card11 from '../Card11/Card11'
import Card6 from '../Card6/Card6'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Card2 from '../Card2/Card2'
import Card9 from '../Card9/Card9'
import Card8 from '../Card8/Card8'

interface Props {
    posts: PostType[] | null | undefined
    rows?: number
    type?: string
    watchOption?: boolean
}

function PostsSection({
    posts,
    rows = 4,
    watchOption = false,
    type = 'grid',
}: Props) {
    const [postsState, setPosts] = useState<PostType[] | null | undefined>(
        posts
    )

    useEffect(() => {
        async function filterPostsAndAuthors() {
            // Get the hidden posts and authors from localStorage
            const hiddenPosts: string[] = JSON.parse(
                localStorage.getItem('hiddenPosts') || '[]'
            )
            const hiddenAuthors: string[] = JSON.parse(
                localStorage.getItem('hiddenAuthors') || '[]'
            )

            const supabase = createClient()
            const { data: session } = await supabase.auth.getSession()

            if (!session.session) {
                return
            }

            // If there are no hidden posts, get them from supabase
            if (!hiddenPosts.length) {
                const { data: Hidposts } = await supabase
                    .from('hidden_posts')
                    .select('post')
                    .eq('user_id', session.session.user.id)

                // Update localStorage
                localStorage.setItem(
                    'hiddenPosts',
                    JSON.stringify(Hidposts?.map((p) => p.post) || hiddenPosts)
                )
            }

            // If there are no hidden authors, get them from supabase
            if (!hiddenAuthors.length) {
                const { data: Hidauthors } = await supabase
                    .from('hidden_authors')
                    .select('author')
                    .eq('user_id', session.session.user.id)

                // Update localStorage
                localStorage.setItem(
                    'hiddenAuthors',
                    JSON.stringify(
                        Hidauthors?.map((a) => a.author) || hiddenAuthors
                    )
                )
            }

            // Filter out hidden posts and posts from hidden authors
            setPosts(
                posts?.filter(
                    (post) =>
                        !hiddenPosts.includes(post.id) &&
                        !hiddenAuthors.includes(post.author.id)
                )
            )
        }

        filterPostsAndAuthors()
    }, [posts])

    const handleHidePost = async (postId: string) => {
        //Update localStorage
        const hiddenPostsItem = localStorage.getItem('hiddenPosts')
        const hiddenPosts = hiddenPostsItem ? JSON.parse(hiddenPostsItem) : []

        localStorage.setItem(
            'hiddenPosts',
            JSON.stringify([...hiddenPosts, postId])
        )

        //Remove the post from the UI
        setPosts(posts?.filter((post) => post.id !== postId))
    }

    const handleRemoveWatchlist = async (postId: string) => {
        // Remove the post from the watchlist
        const supabase = createClient()
        const { data: session } = await supabase.auth.getSession()

        if (!session.session) {
            return
        }

        await supabase
            .from('watch_history')
            .delete()
            .eq('user_id', session.session.user.id)
            .eq('post', postId)

        // Remove the post from the UI
        setPosts(posts?.filter((post) => post.id !== postId))
    }

    return (
        <>
            {type === 'grid' && (
                <div
                    className={`gap-6 md:gap-8 mt-8 lg:mt-10 ${(posts ? posts.length : 0) < rows ? 'flex justify-center flex-wrap' : `grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${rows}`}`}
                >
                    {postsState &&
                        postsState.map((post, id) => (
                            <div
                                key={id}
                                className={`${(posts ? posts.length : 0) < rows ? `w-full sm:w-1/2 lg:w-1/3 xl:w-1/${rows}` : ''}`}
                            >
                                <div className="hidden sm:block">
                                    {/* Render Card11 on larger screens */}
                                    <Card11
                                        onHidePost={handleHidePost}
                                        post={post}
                                        onRemoveWatchlist={
                                            handleRemoveWatchlist
                                        }
                                        watchOption={watchOption}
                                    />
                                </div>

                                <div className="sm:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Render Card5 on smaller screens */}
                                    <Card6
                                        onHidePost={handleHidePost}
                                        post={post}
                                        onRemoveWatchlist={
                                            handleRemoveWatchlist
                                        }
                                        watchOption={watchOption}
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            )}
            {type === 'magazine' && (
                <>
                    <div className="hidden md:grid grid-cols-1 gap-6 md:gap-8">
                        {postsState &&
                            postsState.length > 0 &&
                            Array(Math.ceil(postsState.length / 3))
                                .fill(0)
                                .map((_, i) => {
                                    // Get the posts for this set
                                    const posts = postsState.slice(
                                        i * 3,
                                        i * 3 + 3
                                    )
                                    return (
                                        <div
                                            key={i}
                                            className={`flex ${i % 2 === 0 ? '' : 'flex-row-reverse'} gap-6 md:gap-8`}
                                        >
                                            {/* Render Card2 for the first post if there are three posts in the group */}
                                            {posts.length === 3 ? (
                                                <>
                                                    <div className="w-full lg:w-1/2">
                                                        <Card2
                                                            size="large"
                                                            post={posts[0]}
                                                        />
                                                    </div>
                                                    <div className="w-full lg:w-1/2 flex flex-col gap-6 md:gap-8">
                                                        {posts
                                                            .slice(
                                                                posts.length ===
                                                                    3
                                                                    ? 1
                                                                    : 0
                                                            )
                                                            .map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <Card6
                                                                        onHidePost={
                                                                            handleHidePost
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        post={
                                                                            item
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex justify-center w-full gap-8">
                                                    {posts
                                                        .slice(
                                                            posts.length === 3
                                                                ? 1
                                                                : 0
                                                        )
                                                        .map((item, index) => (
                                                            <Card6
                                                                onHidePost={
                                                                    handleHidePost
                                                                }
                                                                className="w-[50%]"
                                                                key={index}
                                                                post={item}
                                                            />
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                    </div>
                    <div className="gap-6 md:gap-8 mt-8 lg:mt-10 flex justify-center flex-wrap">
                        {postsState &&
                            postsState.map((post, id) => (
                                <div
                                    className="w-full sm:hidden grid grid-cols-1 sm:grid-cols-2 gap-6"
                                    key={id}
                                >
                                    {/* Render Card5 on smaller screens */}
                                    <Card6
                                        onHidePost={handleHidePost}
                                        key={id}
                                        post={post}
                                        onRemoveWatchlist={
                                            handleRemoveWatchlist
                                        }
                                        watchOption={watchOption}
                                    />
                                </div>
                            ))}
                    </div>
                </>
            )}
            {type === 'stacked' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-8 lg:mt-10">
                    {postsState &&
                        postsState.map((post, id) => (
                            <div key={id}>
                                <Card6
                                    onHidePost={handleHidePost}
                                    post={post}
                                    key={id}
                                    onRemoveWatchlist={handleRemoveWatchlist}
                                    watchOption={watchOption}
                                />
                            </div>
                        ))}
                </div>
            )}
            {type === 'modern_magazine' && (
                <div className="">
                    {postsState &&
                        Array(Math.ceil(postsState.length / 3))
                            .fill(0)
                            .map((_, i) => {
                                const posts = postsState.slice(i * 3, i * 3 + 3)
                                const isLastIteration =
                                    i === Math.floor(postsState.length / 3)
                                return (
                                    <>
                                        {posts.length === 3 ||
                                        !isLastIteration ? (
                                            <div
                                                key={i}
                                                className={`flex flex-col md:flex-row ${i % 2 === 0 ? '' : 'md:flex-row-reverse'} gap-6 mb-8 md:gap-8`}
                                            >
                                                <div className="w-full">
                                                    <Card8 post={posts[0]} />
                                                </div>
                                                <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8">
                                                    {posts
                                                        .slice(1)
                                                        .map((post, index) => (
                                                            <div
                                                                className="w-full"
                                                                key={index}
                                                            >
                                                                <Card9
                                                                    onHidePost={
                                                                        handleHidePost
                                                                    }
                                                                    key={index}
                                                                    post={post}
                                                                    hover={true}
                                                                />
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center gap-8">
                                                {posts.map((post, index) => (
                                                    <div
                                                        className="w-[25%] mb-8"
                                                        key={index}
                                                    >
                                                        <Card9
                                                            onHidePost={
                                                                handleHidePost
                                                            }
                                                            key={index}
                                                            post={post}
                                                            hover={true}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )
                            })}
                </div>
            )}
        </>
    )
}

export default PostsSection
