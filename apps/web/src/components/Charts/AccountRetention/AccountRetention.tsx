'use client'

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts'
import WidgetCard from '../WidgetCard'
import { cn } from '@/utils/cn'
import { CustomTooltip } from '../CustomTooltip'
import { useThemeMode } from '@/hooks/useThemeMode'
import { useState, useEffect, useRef } from 'react'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { set } from 'lodash'

const data = [
    {
        day: 'Mon',
        expansions: 2,
        cancellations: 13,
    },
    {
        day: 'Tue',
        expansions: 27,
        cancellations: 39,
    },
    {
        day: 'Thu',
        expansions: 21,
        cancellations: 32,
    },
    {
        day: 'Wed',
        expansions: 45,
        cancellations: 25,
    },
    {
        day: 'Fri',
        expansions: 36,
        cancellations: 25,
    },
    {
        day: 'Sun',
        expansions: 50,
        cancellations: 31,
    },
]

export default function AccountRetention({
    className,
}: {
    className?: string
}) {
    const [isAnimationActive, setIsAnimationActive] = useState(false)
    const themeMode = useThemeMode()
    const divRef = useRef<HTMLDivElement>(null)
    const entry = useIntersectionObserver(divRef, { threshold: 0.1 })
    const [hasIntersected, setHasIntersected] = useState(false)

    useEffect(() => {
        if (entry?.isIntersecting && !hasIntersected) {
            setIsAnimationActive(true)
            setHasIntersected(true)
            const timer = setTimeout(() => setIsAnimationActive(false), 500)
            return () => clearTimeout(timer)
        }
    }, [themeMode.isDarkMode, entry])

    useEffect(() => {
        setIsAnimationActive(true)
        const timer = setTimeout(() => setIsAnimationActive(false), 500)
        return () => clearTimeout(timer)
    }, [themeMode.isDarkMode])

    return (
        <WidgetCard
            title={'Account Retention'}
            description={
                'Number of customers who have active subscription with you.'
            }
            rounded="lg"
            descriptionClassName="text-gray-500 text-sm my-1.5"
            className={cn('grid grid-cols-1', className)}
        >
            <div
                className="h-72 w-full text-xs sm:pt-3 lg:pt-4 xl:pt-5"
                ref={divRef}
            >
                <ResponsiveContainer className="w-full h-full">
                    <AreaChart
                        data={data}
                        margin={{
                            left: -30,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="8 10"
                            strokeOpacity={0.435}
                        />
                        <XAxis dataKey="day" tickLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="natural"
                            dataKey="expansions"
                            stroke="#5451FD"
                            fill="#5451FD"
                            strokeWidth={2.3}
                            fillOpacity={0.05}
                            isAnimationActive={isAnimationActive}
                            animationDuration={500}
                        />
                        <Area
                            type="natural"
                            dataKey="cancellations"
                            stroke="#00EEFD"
                            fill="#00EEFD"
                            strokeWidth={2.3}
                            fillOpacity={0.05}
                            isAnimationActive={isAnimationActive}
                            animationDuration={500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
                <div>
                    <h6 className="font-bold">1,680</h6>
                    <p className="mb-4 mt-0.5 text-xs">Expansions</p>
                    <p className="text-sm">Customers subscription with you.</p>
                </div>
                <div>
                    <h6 className="font-bold">1,520</h6>
                    <p className="mb-4 mt-0.5 text-xs">Cancellations</p>
                    <p className="text-sm">Customers subscription with you.</p>
                </div>
            </div>
        </WidgetCard>
    )
}
