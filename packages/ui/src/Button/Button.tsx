'use client'

import React, { ButtonHTMLAttributes, FC } from 'react'
import Link from 'next/link'
import Loading from './Loading'

export interface ButtonProps {
    className?: string
    sizeClass?: string
    fontSize?: string
    pattern?: 'primary' | 'secondary' | 'third' | 'white' | 'default'
    //
    loading?: boolean
    disabled?: boolean
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
    href?: string
    targetBlank?: boolean
    onClick?: () => void
    children?: React.ReactNode
}

const Button: FC<ButtonProps> = ({
    pattern = 'default',
    className = '',
    sizeClass = 'py-3 px-4 sm:py-3.5 sm:px-6',
    fontSize = 'text-sm sm:text-base font-medium',
    disabled = false,
    href,
    children,
    type,
    loading,
    onClick = () => {},
}) => {
    let colors =
        'bg-[#1338be] hover:bg-blue-500 text-white dark:bg-neutral-100 dark:hover:bg-neutral-50 dark:text-black'
    switch (pattern) {
        case 'primary':
            colors =
                'bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 hover:bg-primary-6000 text-primary-50'
            break
        case 'secondary':
            colors =
                'bg-secondary-500 hover:bg-secondary-6000 text-secondary-50'
            break
        case 'white':
            colors =
                'bg-white hover:bg-[#1338be] hover:text-white dark:hover:bg-[#1338be] dark:bg-neutral-900 text-athera-blue dark:text-neutral-200'
            break
        case 'third':
            colors =
                'bg-white dark:bg-transparent ring-1 ring-neutral-300 hover:ring-neutral-400 dark:ring-neutral-700 dark:hover:ring-neutral-500'
            break

        default:
            break
    }

    let CLASSES = `relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg text-base/6 font-semibold px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] sm:text-sm/6 ${colors} ${fontSize} ${sizeClass} ${className} `

    // relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-base/6 font-semibold',
    //     // Sizing
    //     'px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] sm:text-sm/6',
    //     // Focus
    //     'focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500',
    //     // Disabled
    //     'data-[disabled]:opacity-50',
    //     // Icon
    //     '[&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[--btn-icon] [&>[data-slot=icon]]:sm:my-1 [&>[data-slot=icon]]:sm:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-[hover]:[--btn-icon:ButtonText]',
    if (!!href) {
        return (
            <Link
                href={href}
                className={`${CLASSES} `}
                onClick={onClick}
                type={type}
            >
                {loading && <Loading />}
                {children || `This is Link`}
            </Link>
        )
    }

    return (
        <button
            disabled={disabled || loading}
            className={`${CLASSES}`}
            onClick={onClick}
            type={type}
        >
            {loading && <Loading />}
            {children || `Button default`}
        </button>
    )
}

export default Button
