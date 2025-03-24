'use client'

import { ButtonPrimary } from 'ui'
import React, { useMemo } from 'react'
import Link from 'next/link'
import { useThemeMode } from '@/hooks/useThemeMode'
import Lottie from 'react-lottie'
import darkAnimation from '../lotties/dark.json'
import lightAnimation from '../lotties/light.json'

const ErrorPage: React.FC = () => {
    const theme: any = useThemeMode()

    const defaultOptions = useMemo(() => {
        return {
            loop: true,
            autoplay: true,
            animationData: theme.isDarkMode ? darkAnimation : lightAnimation, // Use the appropriate animation based on theme
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
            },
        }
    }, [theme.isDarkMode])

    return (
        <div className="Page404">
            <div className="flex flex-col items-center justify-center pl-8 pr-8 pt-8 pb-8">
                <div className="w-full max-w-lg">
                    <Lottie
                        options={defaultOptions}
                        height={400}
                        width="100%"
                        isClickToPauseDisabled={true}
                    />
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-snug md:leading-snug lg:leading-snug">
                    <span className="text-blue-500 bg-blue-100 dark:bg-blue-950 p-1 rounded-md">
                        Lost??
                    </span>
                </h1>
                <h1 className="text-2xl md:text-3xl lg:text-4xl text-center font-bold leading-snug md:leading-snug lg:leading-snug">
                    Looks like you've drifted off course
                </h1>
                <p className="text-center text-md mt-4 mb-6 max-w-md mx-auto text-gray-600 dark:text-gray-300">
                    Well this is awkward... The page you are trying to visit
                    does not exist.
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
