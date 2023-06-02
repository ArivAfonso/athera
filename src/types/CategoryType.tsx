import PostType from "./PostType"

export default interface CategoryType {
    title: string,
    image?: {
        asset: {
            _ref: string,
            _type: string
        },
        _type: string
    },
    slug: {
        current: string,
        _type: string
    },
    color?: string
    postCount?: number
    posts?: PostType[]
}