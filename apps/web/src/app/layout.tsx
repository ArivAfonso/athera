import '../styles/index.scss'
import './globals.css'

import { Poppins } from 'next/font/google'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import NextTopLoader from 'nextjs-toploader'

import AuthProvider from '@/providers/AuthProvider'

import { Toaster } from 'react-hot-toast'
import { ReactQueryClientProvider } from '@/providers/ReactQueryClientProvider'

// do not cache this layout
export const revalidate = 0

export const metadata = {
    title: 'Athera - A True Home for Extremely Revolting Articles',
    description:
        'Athera is a news aggregation website designed to showcase interesting content from all over the internet.',
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
    const supabase = createClient(cookies())

    const {
        data: { session },
    } = await supabase.auth.getSession()

    const accessToken = session?.access_token || ''
    return (
        <html lang="en" suppressHydrationWarning className={poppins.className}>
            <link
                rel="preconnect"
                href={process.env.NEXT_PUBLIC_SUPABASE_URL}
            />
            <link
                rel="dns-prefetch"
                href={process.env.NEXT_PUBLIC_SUPABASE_URL}
            />
            <head>
                <meta
                    name="viewport"
                    content="height=device-height, initial-scale=1, width=device-width, initial-scale=1"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebSite',
                            name: 'Athera',
                            url: 'https://athera.blog',
                            description:
                                'Athera is a news aggregation website designed to showcase interesting content from all over the internet.',
                        }),
                    }}
                />
            </head>
            <body className="text-base text-neutral-900 dark:text-neutral-200 bg-white dark:bg-neutral-800">
                <NextTopLoader
                    color="#1d4ed8"
                    speed={600}
                    showSpinner={false}
                />
                <ReactQueryClientProvider>
                    <AuthProvider accessToken={accessToken}>
                        {/* @ts-ignore */}
                        {children}
                    </AuthProvider>
                </ReactQueryClientProvider>
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
            </body>
        </html>
    )
}
