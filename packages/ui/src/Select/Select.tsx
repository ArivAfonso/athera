import React, { FC, SelectHTMLAttributes } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    className?: string
    sizeClass?: string
}

const Select: FC<SelectProps> = ({
    className = '',
    sizeClass = 'h-11',
    children,
    ...args
}) => {
    return (
        <select
            className={`Select ${sizeClass} ${className} text-sm rounded-lg border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900`}
            {...args}
        >
            {children}
        </select>
    )
}

export default Select
