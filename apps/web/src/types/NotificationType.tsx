export default interface NotificationType {
    type: string
    id: string
    description: string
    created_at: string
    notifier: {
        name: string
        id: string
        username: string
        avatar: string
    }
    avatar: string
    href: string
    post: {
        id: string
        title: string
        slug: string
    }
    read_at: string
}
