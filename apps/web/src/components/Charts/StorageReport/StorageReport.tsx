'use client'

import { cn } from '@/utils/cn'
import { TrendingUpIcon } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { CustomTooltip } from '../CustomTooltip'
import WidgetCard from '../WidgetCard'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { useThemeMode } from '@/hooks/useThemeMode'
import { useState, useRef, useEffect } from 'react'

const data = [
    {
        month: 'Jan',
        image: 5000,
        video: 1500,
        document: 1500,
        music: 1500,
    },
    {
        month: 'Feb',
        image: 8500,
        video: 1600,
        document: 5798,
        music: 2000,
    },
    {
        month: 'Mar',
        image: 7000,
        video: 8300,
        document: 3000,
        music: 1375,
    },
    {
        month: 'Apr',
        image: 3908,
        video: 1780,
        document: 6798,
        music: 5780,
    },
    {
        month: 'May',
        image: 4890,
        video: 2500,
        document: 1500,
        music: 5000,
    },
    {
        month: 'Jun',
        image: 8000,
        video: 3200,
        document: 7800,
        music: 4890,
    },
    {
        month: 'Jul',
        image: 8500,
        video: 2500,
        document: 2500,
        music: 4890,
    },
    {
        month: 'Aug',
        image: 3780,
        video: 3908,
        document: 9908,
        music: 2800,
    },
    {
        month: 'Sep',
        image: 7800,
        video: 2800,
        document: 8500,
        music: 1908,
    },
    {
        month: 'Oct',
        image: 5780,
        video: 1908,
        document: 7208,
        music: 2780,
    },
    {
        month: 'Nov',
        image: 4780,
        video: 1920,
        document: 2930,
        music: 1500,
    },
    {
        month: 'Dec',
        image: 7500,
        video: 3000,
        document: 9000,
        music: 1700,
    },
]

function CustomYAxisTick({ x, y, payload }: any) {
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="end"
                className="fill-gray-500"
            >
                {`${payload.value.toLocaleString()}`}GB
            </text>
        </g>
    )
}

export default function StorageReport({ className }: { className?: string }) {
    const isMobile = window.innerWidth <= 1024
    const isDesktop = window.innerWidth > 1024
    const is2xl = window.innerWidth > 1536
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024

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
            title={'Total Storage used'}
            description={
                <div className="flex items-center justify-start">
                    <h2 className="me-2 font-semibold">105,000 GB</h2>
                    <span className="flex items-center leading-none text-gray-500">
                        <span
                            className={cn(
                                'me-2 inline-flex items-center font-medium text-green'
                            )}
                        >
                            <TrendingUpIcon className="me-1 h-4 w-4" />
                            32.40%
                        </span>
                        last year
                    </span>
                </div>
            }
            descriptionClassName="text-gray-500 text-sm mt-1.5"
            //   action={
            //     <div className="hidden @2xl:block">
            //       <Badge renderAsDot className="me-0.5 bg-[#282ECA]" /> Image
            //       <Badge renderAsDot className="me-0.5 ms-4 bg-[#4052F6]" /> Video
            //       <Badge renderAsDot className="me-0.5 ms-4 bg-[#96C0FF]" /> Documents
            //       <Badge
            //         renderAsDot
            //         className="me-0.5 ms-4 bg-[#DEEAFC] dark:bg-[#7c88b2]"
            //       />{' '}
            //       Musics
            //     </div>
            //   }
            className={className}
        >
            <div className="h-96 text-xs w-full pt-9">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                    {...(isTablet && { minWidth: '700px' })}
                >
                    <BarChart
                        data={data}
                        barSize={
                            isMobile ? 16 : isDesktop ? 28 : is2xl ? 32 : 46
                        }
                        margin={{
                            left: 16,
                        }}
                        className="[&_.recharts-tooltip-cursor]:fill-opacity-20 dark:[&_.recharts-tooltip-cursor]:fill-opacity-10 [&_.recharts-cartesian-axis-tick-value]:fill-gray-500 [&_.recharts-cartesian-axis.yAxis]:-translate-y-3 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-vertical]:opacity-0"
                    >
                        <CartesianGrid
                            strokeDasharray="8 10"
                            strokeOpacity={0.435}
                        />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={<CustomYAxisTick />}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="image"
                            fill="#282ECA"
                            stackId="a"
                            animationDuration={500}
                            isAnimationActive={isAnimationActive}
                        />
                        <Bar
                            dataKey="video"
                            stackId="a"
                            fill="#4052F6"
                            animationDuration={500}
                            isAnimationActive={isAnimationActive}
                        />
                        <Bar
                            dataKey="document"
                            stackId="a"
                            fill="#96C0FF"
                            animationDuration={500}
                            isAnimationActive={isAnimationActive}
                        />
                        <Bar
                            dataKey="music"
                            stackId="a"
                            fill="#DEEAFC"
                            animationDuration={500}
                            isAnimationActive={isAnimationActive}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </WidgetCard>
    )
}
