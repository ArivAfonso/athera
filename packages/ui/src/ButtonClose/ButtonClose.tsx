import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'

function twFocusClass(hasRing = false) {
    if (!hasRing) {
        return 'focus:outline-none'
    }
    return 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0'
}

export interface ButtonCloseProps {
    className?: string
    onClick?: () => void
    iconSize?: string
}

const ButtonClose: React.FC<ButtonCloseProps> = ({
    className = '',
    onClick = () => {},
    iconSize = 'w-5 h-5',
}) => {
    return (
        <button
            className={
                `w-8 h-8 flex items-center justify-center rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 ${className} ` +
                twFocusClass()
            }
            onClick={onClick}
        >
            <span className="sr-only">Close</span>
            <XMarkIcon className={iconSize} />
        </button>
    )
}

export default ButtonClose
