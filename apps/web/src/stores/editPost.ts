import { create } from 'zustand'
import PostType from '@/types/PostType'

type Store = {
    post: PostType | null
    setPost: (post: PostType | null) => void
}

export const useStore = create<Store>((set) => ({
    post: null,
    setPost: (post: PostType | null) => set({ post }),
}))
