'use client'

import PostType from '@/types/PostType'
import Card11 from '../Card11/Card11'
import Card6 from '../Card6/Card6'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Props {
    posts: PostType[] | null | undefined
    rows?: number
    watchOption?: boolean
}

function PostsSection({ posts, rows = 4, watchOption = false }: Props) {
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
                                onRemoveWatchlist={handleRemoveWatchlist}
                                watchOption={watchOption}
                            />
                        </div>
                        <div className="sm:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Render Card5 on smaller screens */}
                            <Card6 post={post} />
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default PostsSection
