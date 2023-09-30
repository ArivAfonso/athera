import PostType from './PostType'

export default interface AuthorType {
    name: string
    username: string
    bio?: string
    website?: string
    posts?: PostType[]
    avatar: string
    postCount?: number
}
