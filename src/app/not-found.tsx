'use client'

import ButtonPrimary from '@/components/Button/ButtonPrimary'
import React from 'react'
import Link from 'next/link'

const ErrorPage: React.FC = () => (
    <div className="nc-Page404">
        <div className="flex flex-col items-center justify-center pt-8 pb-8">
            <video autoPlay loop muted className="w-1/2">
                <source src="/error.webm" type="video/webm" />
            </video>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-snug md:leading-snug lg:leading-snug">
                What on{' '}
                <span className="text-blue-500 bg-blue-100 dark:bg-blue-950 p-1 rounded-md">
                    Earth
                </span>
            </h1>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-snug md:leading-snug lg:leading-snug">
                are you doing here!?
            </h1>
            <p>
                Well this is awkward... The page you are trying to visit does
                not exist
            </p>
            <Link href="/">
                <ButtonPrimary className="mt-4">Go to Home Page</ButtonPrimary>
            </Link>
        </div>
    </div>
)

export default ErrorPage
