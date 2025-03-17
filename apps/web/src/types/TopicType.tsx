import NewsType from './NewsType'
import PostType from './PostType'

export default interface TopicType {
    name: string
    id: string
    otherTopics?: TopicType[]
    image?: string
    postCount: {
        count: number
    }[]
    newsCount: {
        count: number
    }[]
    posts?: PostType[]
    news?: NewsType[]
    color: string
}
