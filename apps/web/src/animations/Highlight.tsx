'use client'
import { useThemeMode } from '@/hooks/useThemeMode'
import { cn } from '@/utils/cn'
import { useMotionValue, motion, useMotionTemplate } from 'framer-motion'
import React, { useEffect } from 'react'

export const HeroHighlight = ({
    children,
    className,
    containerClassName,
}: {
    children: React.ReactNode
    className?: string
    containerClassName?: string
}) => {
    let mouseX = useMotionValue(0)
    let mouseY = useMotionValue(0)

    const { isDarkMode } = useThemeMode()

    useEffect(() => {}, [isDarkMode])

    function handleMouseMove({
        currentTarget,
        clientX,
        clientY,
    }: React.MouseEvent<HTMLDivElement>) {
        if (!currentTarget) return
        let { left, top } = currentTarget.getBoundingClientRect()

        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
    }
    return (
        <div
            className={cn(
                'relative flex items-center font-bold bg-transparent justify-center w-full group',
                containerClassName
            )}
            onMouseMove={handleMouseMove}
        >
            <div className="absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800  pointer-events-none" />

            <div className={cn('relative', className)}>{children}</div>
        </div>
    )
}

export const Highlight = ({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) => {
    return (
        <motion.span
            initial={{
                backgroundSize: '0% 100%',
            }}
            animate={{
                backgroundSize: '100% 100%',
            }}
            transition={{
                duration: 2,
                ease: 'linear',
                delay: 0.5,
            }}
            style={{
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
                display: 'inline',
            }}
            className={cn(
                `relative inline-block pb-1 text-blue-500 px-1 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-950 dark:to-blue-950`,
                className
            )}
        >
            {children}
        </motion.span>
    )
}
