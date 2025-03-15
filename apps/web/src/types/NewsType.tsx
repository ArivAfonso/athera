import CommentType from './CommentType'
import SourceType from './SourceType'

export default interface NewsType {
    id: string
    title: string
    description: string
    summary: string
    image: string
    author: string
    link: string
    source: SourceType
    created_at: string
    lat: number
    long: number
    likeCount: {
        count: number
    }[]

    commentCount: {
        count: number
    }[]
    isLiked: boolean
    isBookmarked: boolean
    license: string | null
    comments_allowed: boolean
    bookmarkCount: {
        count: number
    }[]
    comments?: CommentType[]
    news_topics: {
        topic: {
            name: string
            id: string
            color: string
            newsCount: {
                count: number
            }[]
        }
    }[]
}
