import React, { FC, ReactNode, useEffect, useState } from 'react'
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
    className = 'flex-shrink-0',
}) => {
    const [worker, setWorker] = useState<Worker | null>(null)

    useEffect(() => {
        if (title === 'Image') {
            const newWorker = new Worker(
                new URL('./worker.ts', import.meta.url)
            )
            setWorker(newWorker)

            // Cleanup function to terminate the worker when the component unmounts or title changes
            return () => {
                newWorker.terminate()
            }
        }
    }, [title]) // Dependency array includes title to re-run effect if title changes

    if (title === 'Image' && worker) {
        return (
            <MenuItemImage worker={worker} action={action}>
                <button
                    className={`menu-item ${className} ${isActive && isActive() ? 'is-active' : ''}`}
                    onClick={() => action}
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
