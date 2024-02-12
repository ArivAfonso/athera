import './globals.css'
import '@/styles/index.scss'
import { Poppins } from 'next/font/google'
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import NextTopLoader from 'nextjs-toploader'

import AuthProvider from '@/providers/AuthProvider'
import { env } from 'process'
import { Toaster } from 'react-hot-toast'
import CustomScrollbar from './CustomScrollbar'

// do not cache this layout
export const revalidate = 0

export const metadata = {
    title: 'Athera - A True Home for Extremely Revolting Articles',
}

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: ['300', '400', '500', '600', '700'],
})

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = createServerComponentClient({ cookies })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    const accessToken = session?.access_token || ''
    return (
        <html lang="en" className={poppins.className}>
            <head>{/* Add your head content here */}</head>
            <body className="bg-[#f8f8f8] flex flex-col h-[100%] text-base dark:bg-neutral-900/95 text-neutral-900 dark:text-neutral-200">
                <NextTopLoader
                    color="#0018f9"
                    speed={600}
                    showSpinner={false}
                />

                <Header />

                <AuthProvider accessToken={accessToken}>
                    {/* @ts-ignore */}
                    <div className="flex-1 overflow-y-auto">{children}</div>
                </AuthProvider>
                <Toaster
                    position="bottom-center"
                    toastOptions={{
                        style: {
                            fontSize: '14px',
                            borderRadius: '0.75rem',
                        },
                    }}
                    containerClassName="text-sm"
                />
                <Footer />
            </body>
        </html>
    )
}
