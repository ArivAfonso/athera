import { create } from 'zustand'

interface NewPostType {
    images: {
        url: string
        rating: boolean
    }[]
}

type Store = {
    newPostImgs: NewPostType | null
    setNewPost: (post: NewPostType | null) => void
}

export const useStore = create<Store>((set) => ({
    newPostImgs: null,
    setNewPost: (post) => set({ newPostImgs: post }),
}))
