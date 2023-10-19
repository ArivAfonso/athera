import PostType from './PostType'

export default interface CategoryType {
    name: string
    otherCategories?: CategoryType[]
    postCount: {
        count: number
    }[]
    post_categories?: {
        post: PostType
    }[]
    color: string
}
