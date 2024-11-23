import PostType from './PostType'

export default interface AuthorType {
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
    bio?: string
    website?: string
    posts?: PostType[]
    avatar: string
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
    github?: string
    twitch?: string
    youtube?: string
    tiktok?: string
    pinterest?: string
    customization?: {
        profile_layout: string
        font_title: string
        font_body: string
        color: string
    }
    postCount?: {
        count: number
    }[]
    verified?: boolean
}
