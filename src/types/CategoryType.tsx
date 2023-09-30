import PostType from './PostType'

export default interface CategoryType {
    name: string
    otherCategories?: CategoryType[]
    postCount?: number
    posts_categories?: {
        posts: PostType
    }[]
    color: string
}
