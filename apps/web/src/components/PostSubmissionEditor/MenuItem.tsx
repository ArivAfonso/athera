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
                    className={`menu-item ${className} ${
                        isActive && isActive() ? ' is-active' : ''
                    }`}
                    // onClick={action}
                    title={title}
                >
                    <div
                        className="menu-item-svg"
                        dangerouslySetInnerHTML={{ __html: icon }}
                    ></div>
                </button>
            </MenuItemImage>
        )
    }

    return (
        <button
            className={`menu-item ${className} ${
                isActive && isActive() ? ' is-active' : ''
            }`}
            onClick={(e) => {
                e.preventDefault()
                action()
            }}
            title={title}
        >
            <div
                className="menu-item-svg"
                dangerouslySetInnerHTML={{ __html: icon }}
            ></div>
        </button>
    )
}
export default MenuItem
