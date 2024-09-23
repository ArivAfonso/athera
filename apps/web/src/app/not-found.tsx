'use client'

import { ButtonPrimary } from 'ui'
import React from 'react'
import Link from 'next/link'
import { useThemeMode } from '@/hooks/useThemeMode'
import Image from 'next/image'

const ErrorPage: React.FC = () => {
    const theme: any = useThemeMode()
    return (
        <div className="Page404">
            <div className="flex flex-col items-center justify-center pl-8 pr-8 pt-8 pb-8">
                {theme.isDarkMode ? (
                    <Image
                        src="/404-dark.png"
                        width={400}
                        height={400}
                        alt="404"
                    />
                ) : (
                    <video autoPlay loop muted className="w-full">
                        <source src="/error.webm" type="video/webm" />
                    </video>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-snug md:leading-snug lg:leading-snug">
                    What on{' '}
                    <span className="text-blue-500 bg-blue-100 dark:bg-blue-950 p-1 rounded-md">
                        Earth
                    </span>
                </h1>
                <h1 className="text-4xl md:text-5xl lg:text-6xl text-center font-bold leading-snug md:leading-snug lg:leading-snug">
                    are you doing here!?
                </h1>
                <p className="text-center">
                    Well this is awkward... The page you are trying to visit
                    does not exist
                </p>
                <Link href="/">
                    <ButtonPrimary className="mt-4">
                        Go to Home Page
                    </ButtonPrimary>
                </Link>
            </div>
        </div>
    )
}

export default ErrorPage
