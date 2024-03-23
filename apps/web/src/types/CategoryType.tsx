import PostType from './PostType'

export default interface CategoryType {
    name: string
    id: string
    otherCategories?: CategoryType[]
    image?: string
    postCount: {
        count: number
    }[]
    posts?: PostType[]
    color: string
}
