import PostType from './PostType'

export default interface SourceType {
    id: string
    name: string
    followerCount?: number
    followingCount?: number
    followers?: {
        following: string
    }[]
    isFollowing?: boolean
    created_at?: string
    username: string
    background?: string
    description?: string
    url?: string
    posts?: PostType[]
    image: string
    newsCount: {
        count: number
    }[]
}
