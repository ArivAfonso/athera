export default interface PostType {
    title: string
    description?: string
    latestPostsInCategory?: PostType[]
    estimatedReadingTime?: number
    body?: []
    author: {
        name: string
        slug: {
            current: string
            _type: string
        }
        image: {
            asset: {
                _ref: string
                _type: string
            }
            _type: string
        }
    }
    publishedAt: string
    slug: {
        current: string
        _type: string
    }
    mainImage: {
        asset: {
            _ref: string
            _type: string
        }
        _type: string
    }
    categories: {
        title: string
        slug: {
            current: string
            _type: string
        }
        color: string
    }[]
}
