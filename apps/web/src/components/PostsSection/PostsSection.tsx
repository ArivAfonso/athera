'use client'

import PostType from '@/types/PostType'
import Card11 from '../Card11/Card11'
import Card6 from '../Card6/Card6'

interface Props {
    posts: PostType[] | null | undefined
}

function PostsSection({ posts }: Props) {
    //Get the hidden posts from localStorage
    const hiddenPosts: string[] = JSON.parse(
        localStorage.getItem('hiddenPosts') || '[]'
    )

    //Filter out hidden posts
    posts = posts?.filter((post) => !hiddenPosts.includes(post.id))

    return (
        <div
            className={`gap-6 md:gap-8 mt-8 lg:mt-10 ${(posts ? posts.length : 0) < 4 ? 'flex justify-center flex-wrap' : 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}
        >
            {posts &&
                posts.map((post, id) => (
                    <div
                        key={id}
                        className={`${(posts ? posts.length : 0) < 4 ? 'w-full sm:w-1/2 lg:w-1/3 xl:w-1/4' : ''}`}
                    >
                        <div className="hidden sm:block">
                            {/* Render Card11 on larger screens */}
                            <Card11 post={post} />
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
