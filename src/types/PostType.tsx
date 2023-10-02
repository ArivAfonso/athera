export default interface PostType {
    id: string
    title: string
    image: string
    created_at?: string
    estimatedReadingTime: number
    description: string
    text: string
    rawText: string
    author: {
        name: string
        username: string
        avatar: string
        description: string
    }
    post_categories: {
        category: {
            title: string
            color: string
        }
    }[]
    likeCount: {
        count: number
    }[]
    commentCount: {
        count: number
    }[]
    isLiked: boolean
    comments?: {
        commenter: {
            name: string
            username: string
            image: string
            description: string
        }
        comment: string
        created_at: string
    }[]
}
