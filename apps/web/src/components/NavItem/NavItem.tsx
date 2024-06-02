import React, { FC, ReactNode } from 'react'

export interface NavItemProps {
    className?: string
    radius?: string
    onClick?: () => void
    isActive?: boolean
    renderX?: ReactNode
    children?: ReactNode
}

const NavItem: FC<NavItemProps> = ({
    className = 'px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize',
    radius = 'rounded-full',
    children,
    onClick = () => {},
    isActive = false,
    renderX,
}) => {
    return (
        <li className="NavItem relative flex-shrink-0">
            {renderX && renderX}
            <button
                className={`flex items-center justify-center font-medium ${className} ${radius} ${
                    isActive
                        ? 'bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-black'
                        : 'text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-500'
                } `}
                onClick={onClick}
            >
                {children}
            </button>
        </li>
    )
}

export default NavItem
