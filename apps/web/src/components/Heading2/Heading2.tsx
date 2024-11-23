import Link from 'next/link'
import { FC } from 'react'

export interface Heading2Props {
    className?: string
    title: string
    viewAllLink?: string
    viewAllLabel?: string
    icon?: React.ReactNode
}

const Heading2: FC<Heading2Props> = ({
    className = '',
    title,
    viewAllLink,
    viewAllLabel = 'View all',
    icon,
}) => {
    return (
        <div
            className={`Heading2 flex items-center justify-between border-b border-neutral-100 p-4 dark:border-neutral-700 ${className}`}
        >
            <h2 className="flex flex-wrap gap-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {icon && <span className="flex-shrink-0">{icon}</span>}
                <span>{title}</span>
            </h2>
            {!!viewAllLink && (
                <Link
                    className="block flex-shrink-0 text-sm font-semibold text-primary-700 dark:text-primary-500"
                    href={viewAllLink}
                >
                    {viewAllLabel}
                </Link>
            )}
        </div>
    )
}

export default Heading2
