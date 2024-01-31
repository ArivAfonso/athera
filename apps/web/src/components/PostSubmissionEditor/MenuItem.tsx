import React, { FC } from 'react'
import MenuItemImage from './MenuItemImage'

interface Props {
    icon: string
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
                    className={`flex items-center justify-center rounded-lg ${className} ${
                        isActive && isActive() ? ' is-active' : ''
                    }`}
                    onClick={() => {
                        action
                        console.log('action')
                    }}
                    title={title}
                >
                    <img
                        className="w-6 h-6"
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(
                            icon
                        )}`}
                    />
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
            <img
                className="w-6 h-6"
                src={`data:image/svg+xml;utf8,${encodeURIComponent(icon)}`}
            />
        </button>
    )
}
export default MenuItem
