import PostType from './PostType'

export default interface TopicType {
    name: string
    id: string
    otherTopics?: TopicType[]
    image?: string
    postCount: {
        count: number
    }[]
    posts?: PostType[]
    color: string
}
