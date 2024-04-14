export default interface DraftType {
    id: string
    title: string
    image: string | null
    created_at?: string
    edited_at?: string
    estimatedReadingTime: number
    description: string | null
    text: string | null
    rawText: string | null
    json: JSON | null
    draft_topics:
        | {
              topic: {
                  name: string
                  id: string
                  color: string
              }
          }[]
        | null
    author: {
        name: string
        id: string
        avatar: string
    }
}
