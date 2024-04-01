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
    if (title === 'image') {
        return (
            <MenuItemImage action={action}>
                <button
                    className={`menu-item ${className} ${
                        isActive && isActive() ? ' is-active' : ''
                    }`}
                    onClick={() => {
                        action
                        console.log('action')
                    }}
                    title={title}
                >
                    {icon}
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
                console.log('Button clicked')
                action()
            }}
            title={title}
        >
            {icon}
        </button>
    )
}
export default MenuItem
