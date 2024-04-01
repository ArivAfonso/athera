'use client'

import { createContext, useEffect, ReactNode } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface AuthProviderProps {
    accessToken: string
    children: ReactNode
}

export const AuthContext = createContext<any>(null) // Update 'any' to the appropriate type

const AuthProvider = ({ accessToken, children }: AuthProviderProps) => {
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const {
            data: { subscription: authListener },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.access_token !== accessToken) {
                router.refresh()
            }
        })

        return () => {
            authListener?.unsubscribe()
        }
    }, [accessToken, supabase, router])

    return <>{children}</> // Return children as JSX
}

export default AuthProvider
