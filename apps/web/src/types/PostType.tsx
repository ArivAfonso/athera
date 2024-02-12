export default interface PostType {
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
    }
    post_categories: {
        category: {
            name: string
            id: string
            color: string
        }
    }[]
    likeCount:
        | {
              count: number
          }[]

    commentCount:
        | {
              count: number
          }[]
    isLiked: boolean
    isBookmarked: boolean
    bookmarkCount: {
        count: number
    }[]
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
