import NewsType from './NewsType'
import PostType from './PostType'

export default interface CommentType {
    id: string
    news?: NewsType
    post: PostType
    comment: string
    created_at: string
    likes: number
    is_liked_by_current_user: boolean
    commenter: {
        name: string
        id: string
        username: string
        avatar: string
    }
}
