import CommentType from './CommentType'

export default interface PostType {
    scheduled_at: string
    id: string
    title: string
    image: string
    created_at?: string
    estimatedReadingTime: number
    description: string
    text: string
    rawText: string
    json: JSON
    author: {
        id: string
        verified?: boolean
        name: string
        username: string
        avatar: string
        description: string
        customization: {
            profile_layout: string
            font_body: string
            font_title: string
            color: string
            sidebar: boolean
        }
    }
    post_topics: {
        topic: {
            name: string
            id: string
            color: string
            postCount: {
                count: number
            }[]
        }
    }[]
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
}
