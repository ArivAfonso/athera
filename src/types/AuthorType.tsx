import PostType from "./PostType"

export default interface AuthorType {
    name: string,
    username?: string,
    bio?: string,
    website?: string,
    posts?: PostType[],
    slug: {
        current: string,
        _type: string
    }
    image: {
        asset: {
            _ref: string,
            _type: string
        },
        _type: string
    }
    postCount?: number
}