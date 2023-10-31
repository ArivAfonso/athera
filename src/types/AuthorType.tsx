import PostType from './PostType'

export default interface AuthorType {
    id: string
    name: string
    followerCount?: number
    followers?: {
        following: string
    }[]
    isFollowing?: boolean
    username: string
    bio?: string
    website?: string
    posts?: PostType[]
    avatar: string
    postCount?: {
        count: number
    }[]
    verified?: boolean
}
