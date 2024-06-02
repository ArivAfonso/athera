'use client'

import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { useThemeMode } from '@/hooks/useThemeMode'
import { cn } from '@/utils/cn'
import {
    BookMarkedIcon,
    HeartIcon,
    ScanEyeIcon,
    TrendingDownIcon,
    TrendingUpIcon,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { BarChart, Bar, ResponsiveContainer } from 'recharts'

const metricCardClasses = {
    base: 'border border-muted border-neutral-200 dark:border-neutral-900 bg-transparent p-5 lg:p-6',
    rounded: {
        sm: 'rounded-sm',
        DEFAULT: 'rounded-lg',
        lg: 'rounded-xl',
        xl: 'rounded-2xl',
    },
}

type MetricCardTypes = {
    title: string
    metric: React.ReactNode
    icon?: React.ReactNode
    iconClassName?: string
    contentClassName?: string
    chart?: React.ReactNode
    info?: React.ReactNode
    rounded?: keyof typeof metricCardClasses.rounded
    titleClassName?: string
    metricClassName?: string
    chartClassName?: string
    className?: string
}

export function MetricCard({
    title,
    metric,
    icon,
    chart,
    info,
    rounded = 'DEFAULT',
    className,
    iconClassName,
    contentClassName,
    titleClassName,
    metricClassName,
    chartClassName,
    children,
}: React.PropsWithChildren<MetricCardTypes>) {
    return (
        <div
            className={cn(
                metricCardClasses.base,
                metricCardClasses.rounded[rounded],
                className
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {icon ? (
                        <div
                            className={cn(
                                'flex h-11 w-11 items-center justify-center rounded-lg bg-transparent lg:h-12 lg:w-12',
                                iconClassName
                            )}
                        >
                            {icon}
                        </div>
                    ) : null}

                    {/* <div className={cn(icon && 'ps-3', contentClassName)}>
                        <p
                            className={cn(
                                'mb-0.5 text-gray-500',
                                titleClassName
                            )}
                        >
                            {title}
                        </p>
                        <p
                            className={cn(
                                'font-lexend text-lg font-semibold text-gray-900  2xl:xl:text-xl dark:text-gray-100',
                                metricClassName
                            )}
                        >
                            {metric}
                        </p>

                        {info ? info : null}
                    </div> */}
                </div>

                {chart ? (
                    <div className={cn('h-12 w-20', chartClassName)}>
                        {chart}
                    </div>
                ) : null}
            </div>

            {children}
        </div>
    )
}

const orderData = [
    {
        day: 'Sunday',
        sale: 4000,
        cost: 2400,
    },
    {
        day: 'Monday',
        sale: 3000,
        cost: 1398,
    },
    {
        day: 'Tuesday',
        sale: 2000,
        cost: 9800,
    },
    {
        day: 'Wednesday',
        sale: 2780,
        cost: 3908,
    },
    {
        day: 'Thursday',
        sale: 1890,
        cost: 4800,
    },
    {
        day: 'Friday',
        sale: 2390,
        cost: 3800,
    },
    {
        day: 'Saturday',
        sale: 3490,
        cost: 4300,
    },
]

const salesData = [
    {
        day: 'Sunday',
        sale: 2000,
        cost: 2400,
    },
    {
        day: 'Monday',
        sale: 3000,
        cost: 1398,
    },
    {
        day: 'Tuesday',
        sale: 2000,
        cost: 9800,
    },
    {
        day: 'Wednesday',
        sale: 2780,
        cost: 3908,
    },
    {
        day: 'Thursday',
        sale: 1890,
        cost: 4800,
    },
    {
        day: 'Friday',
        sale: 2390,
        cost: 3800,
    },
    {
        day: 'Saturday',
        sale: 3490,
        cost: 4300,
    },
]

const revenueData = [
    {
        day: 'Sunday',
        sale: 2000,
        cost: 2400,
    },
    {
        day: 'Monday',
        sale: 2800,
        cost: 1398,
    },
    {
        day: 'Tuesday',
        sale: 3500,
        cost: 9800,
    },
    {
        day: 'Wednesday',
        sale: 2780,
        cost: 3908,
    },
    {
        day: 'Thursday',
        sale: 1890,
        cost: 4800,
    },
    {
        day: 'Friday',
        sale: 2390,
        cost: 3800,
    },
    {
        day: 'Saturday',
        sale: 3490,
        cost: 4300,
    },
]

const eComDashboardStatData = [
    {
        id: '1',
        icon: <BookMarkedIcon className="h-6 w-6" />,
        title: 'Bookmarks',
        metric: '1,390',
        increased: true,
        decreased: false,
        percentage: '+32.40',
        style: 'text-[#3872FA]',
        fill: '#3872FA',
        chart: orderData,
    },
    {
        id: '2',
        icon: <HeartIcon className="h-6 w-6" />,
        title: 'Likes',
        metric: '57,890',
        increased: false,
        decreased: true,
        percentage: '-4.40',
        style: 'text-[#10b981]',
        fill: '#10b981',
        chart: salesData,
    },
    {
        id: '3',
        icon: <ScanEyeIcon className="h-6 w-6" />,
        title: 'Views',
        metric: '12,390',
        increased: true,
        decreased: false,
        percentage: '+32.40',
        style: 'text-[#7928ca]',
        fill: '#7928ca',
        chart: revenueData,
    },
]

export default function StatCards({ className }: { className?: string }) {
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
        <div
            className={cn(
                'grid grid-cols-3 gap-5 md:gap-8 lg:gap-9 overflow-y-auto',
                className
            )}
        >
            {eComDashboardStatData.map((stat) => (
                <MetricCard
                    key={stat.title + stat.id}
                    title={stat.title}
                    metric={stat.metric}
                    metricClassName="lg:text-[22px]"
                    icon={stat.icon}
                    iconClassName={cn(
                        '[&>svg]:w-10 [&>svg]:h-8 lg:[&>svg]:w-11 lg:[&>svg]:h-9 w-auto h-auto p-0 bg-transparent -mx-1.5',
                        stat.id === '1' &&
                            '[&>svg]:w-9 [&>svg]:h-7 lg:[&>svg]:w-[42px] lg:[&>svg]:h-[34px]',
                        stat.style
                    )}
                    chart={
                        <ResponsiveContainer
                            className="w-10 h-10"
                            width="100%"
                            height="100%"
                        >
                            <BarChart barSize={5} barGap={2} data={stat.chart}>
                                <Bar
                                    dataKey="sale"
                                    fill={stat.fill}
                                    radius={5}
                                    isAnimationActive={isAnimationActive}
                                    animationDuration={500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    }
                    chartClassName="h-14 w-24"
                    className="container [&>div]:items-center"
                >
                    <p className="mt-5 flex items-center text-sm border-t border-dashed border-muted pt-4 leading-none text-gray-700 dark:text-gray-300">
                        <span
                            className={cn(
                                'me-2 inline-flex items-center text-sm font-medium',
                                stat.increased ? 'text-green' : 'text-red'
                            )}
                        >
                            {stat.increased ? (
                                <TrendingUpIcon className="me-1 h-4 w-4" />
                            ) : (
                                <TrendingDownIcon className="me-1 h-4 w-4" />
                            )}
                            {stat.percentage}%
                        </span>
                        <span className="me-1 hidden [240px]:inline-flex">
                            {stat.increased ? 'Increased' : 'Decreased'}
                        </span>{' '}
                        last month
                    </p>
                </MetricCard>
            ))}
        </div>
    )
}
