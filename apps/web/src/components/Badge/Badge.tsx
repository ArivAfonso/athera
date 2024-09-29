import Link from 'next/link'
import React, { FC, ReactNode } from 'react'
import { UrlObject } from 'url'

export type BadgeColor =
    | 'pink'
    | 'green'
    | 'yellow'
    | 'red'
    | 'indigo'
    | 'blue'
    | 'purple'
    | 'brown'
    | 'orange'
    | 'gray'

export interface BadgeProps {
    className?: string
    name: ReactNode
    color?: BadgeColor
    href?: string
}

const Badge: FC<BadgeProps> = ({
    className = 'relative',
    name,
    color = 'blue',
    href,
}) => {
    const getColorClass = (hasHover = true) => {
        switch (color) {
            case 'pink':
                return `text-pink-800 bg-pink-100 dark:bg-pink-950 dark:text-pink-100 ${
                    hasHover
                        ? 'hover:text-white hover:bg-pink-800 dark:hover:bg-pink-100 dark:hover:text-pink-800'
                        : ''
                }`
            case 'red':
                return `text-red-800 bg-red-100 dark:bg-red-950 dark:text-red-100 ${
                    hasHover
                        ? 'hover:text-white hover:bg-red-800 dark:hover:bg-red-100 dark:hover:text-red-800'
                        : ''
                }`
            case 'gray':
                return `text-gray-800 bg-gray-100 dark:bg-gray-950 dark:text-gray-100 ${
                    hasHover
                        ? 'hover:text-white hover:bg-gray-800 dark:hover:bg-gray-100 dark:hover:text-gray-800'
                        : ''
                }`
            case 'green':
                return `text-green-800 bg-green-100 dark:bg-green-950 dark:text-green-100 ${
                    hasHover
                        ? 'hover:text-white hover:bg-green-800 dark:hover:bg-green-100 dark:hover:text-green-800'
                        : ''
                }`
            case 'purple':
                return `text-purple-800 bg-purple-100 dark:bg-purple-950 dark:text-purple-100 ${
                    hasHover
                        ? 'hover:text-white hover:bg-purple-800 dark:hover:bg-purple-100 dark:hover:text-purple-800'
                        : ''
                }`
            case 'indigo':
                return `text-indigo-800 bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-100 ${
                    hasHover
                        ? 'hover:text-white hover:bg-indigo-800 dark:hover:bg-indigo-100 dark:hover:text-indigo-800'
                        : ''
                }`
            case 'yellow':
                return `text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100 ${
                    hasHover
                        ? 'hover:text-white hover:bg-yellow-800 dark:hover:text-yellow-800 dark:hover:bg-yellow-100'
                        : ''
                }`
            case 'blue':
                return `text-blue-800 bg-blue-100 dark:bg-blue-950 dark:text-blue-100 ${
                    hasHover
                        ? 'hover:text-white hover:bg-blue-800 dark:hover:bg-blue-100 dark:hover:text-blue-800'
                        : ''
                }`
            case 'orange':
                return `text-orange-800 bg-orange-100 dark:bg-orange-900 dark:text-orange-100 ${
                    hasHover
                        ? 'hover:text-white hover:bg-orange-800 dark:hover:bg-orange-100 dark:hover:text-orange-800'
                        : ''
                }`
            default:
                return `text-pink-800 bg-pink-100 dark:bg-pink-950 dark:text-pink-100 ${
                    hasHover
                        ? 'hover:text-white hover:bg-pink-800 dark:hover:bg-pink-100 dark:hover:text-pink-800'
                        : ''
                }`
        }
    }

    const CLASSES =
        'nc-Badge  inline-flex px-2.5 py-1 rounded-full font-medium text-xs ' +
        className

    return href ? (
        <Link
            href={href as unknown as UrlObject}
            className={`transition-colors hover:text-white duration-300 ${CLASSES} ${getColorClass()}`}
        >
            {name}
        </Link>
    ) : (
        <span
            className={`transition-colors duration-300 cursor-default ${CLASSES} ${getColorClass()}`}
        >
            {name}
        </span>
    )
}

export default Badge
