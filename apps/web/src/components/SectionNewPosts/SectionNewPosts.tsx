import PostType from '@/types/PostType'
import Card14 from '../Card14/Card14'

interface SectionNewPostsProps {
    posts: PostType[]
    className?: string
    heading?: string
    gridClass?: string
}

const SectionNewPosts = ({
    posts,
    className = '',
    heading = '',
    gridClass = '',
}: SectionNewPostsProps) => {
    return (
        <div className="gap-6 md:gap-8 mt-8 mb-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {posts &&
                posts.slice(0, 8).map((post: PostType, id: number) => (
                    <div key={id}>
                        <div className="hidden sm:block">
                            <Card14 post={post} />
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default SectionNewPosts
