import PostType from './PostType'

export default interface CategoryType {
    name: string
    otherCategories?: CategoryType[]
    image?: string
    postCount: {
        count: number
    }[]
    post_categories?: {
        post: PostType
    }[]
    color: string
}
