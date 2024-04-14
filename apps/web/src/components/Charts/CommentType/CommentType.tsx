'use client'

import {
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ComposedChart,
    ResponsiveContainer,
} from 'recharts'
import { CustomTooltip } from '../CustomTooltip'
import WidgetCard from '../WidgetCard'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { useThemeMode } from '@/hooks/useThemeMode'
import { useState, useRef, useEffect } from 'react'

const data = [
    {
        country: 'Feature',
        amount: 868,
    },
    {
        country: 'Coding',
        amount: 1397,
    },
    {
        country: 'Design',
        amount: 1480,
    },
    {
        country: 'Coding',
        amount: 1397,
    },
    {
        country: 'Design',
        amount: 1480,
    },
    {
        country: 'Email',
        amount: 1520,
    },
    {
        country: 'Hosting',
        amount: 1400,
    },
    {
        country: 'Other',
        amount: 868,
    },
]

export default function CommentTypes({ className }: { className?: string }) {
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
            rounded="lg"
            className={className}
            title="Types of Comments"
            descriptionClassName="text-gray-500 text-sm mt-1.5"
            description="Different comments received on your posts determined by AI based on various parameters"
        >
            <div
                className="h-[350px] text-xs w-full lg:h-[420px] min-[1780px]:h-[28rem] 3xl:h-96"
                ref={divRef}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        layout="vertical"
                        margin={{ top: 20, bottom: -10, left: -2 }}
                        barCategoryGap={50}
                        data={data}
                        className="[&_.recharts-tooltip-cursor]:fill-opacity-20 dark:[&_.recharts-tooltip-cursor]:fill-opacity-10 [&_.recharts-cartesian-axis-tick-value]:fill-gray-500  rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12"
                    >
                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            dataKey="country"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="amount"
                            barSize={20}
                            radius={4}
                            fill="#3872FA"
                            isAnimationActive={isAnimationActive}
                            animationDuration={500}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </WidgetCard>
    )
}
