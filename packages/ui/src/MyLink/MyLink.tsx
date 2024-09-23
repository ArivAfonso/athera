import Link from 'next/link'
import React, { FC, ReactNode } from 'react'
import type { Route as NextRouter } from 'next'

export type Route<T = string> = NextRouter<string>

export interface MyLinkProps {
    className?: string
    colorClass?: string
    href: Route
    children: ReactNode
}

const MyLink: FC<MyLinkProps> = ({
    className = 'font-medium',
    colorClass = 'text-primary-6000 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-6000',
    children,
    href,
}) => {
    return (
        <Link className={`MyLink ${colorClass} ${className}`} href={href}>
            {children}
        </Link>
    )
}

export default MyLink
