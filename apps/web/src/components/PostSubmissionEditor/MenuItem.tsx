import React, { FC, ReactNode } from 'react'
import MenuItemImage from './MenuItemImage'
import { LucideIcon } from 'lucide-react'

interface Props {
    icon: ReactNode
    title: string
    action: (args?: any) => void
    isActive?: () => boolean
    className?: string
}

const MenuItem: FC<Props> = ({
    icon,
    action,
    title,
    isActive,
    className = 'flex-shrink-0 mr-2',
}) => {
    if (title === 'Image') {
        return (
            <MenuItemImage action={action}>
                <button
                    className={`menu-item ${className} ${
                        isActive && isActive() ? ' is-active' : ''
                    }`}
                    onClick={() => {
                        action
                    }}
                    type="button"
                    title={title}
                >
                    <div className="text-neutral-600 dark:text-neutral-400">
                        {icon}
                    </div>
                </button>
            </MenuItemImage>
        )
    }

    return (
        <button
            className={`menu-item ${className} ${
                isActive && isActive() ? ' is-active' : ''
            }`}
            type="button"
            onClick={() => {
                action()
            }}
            title={title}
        >
            <div className="text-neutral-600 dark:text-neutral-400">{icon}</div>
        </button>
    )
}
export default MenuItem
