import NewsType from './NewsType'
import PostType from './PostType'

export default interface TopicType {
    name: string
    id: string
    otherTopics?: TopicType[]
    image?: string
    newsCount: {
        count: number
    }[]
    posts?: PostType[]
    news?: NewsType[]
    color: string
}
