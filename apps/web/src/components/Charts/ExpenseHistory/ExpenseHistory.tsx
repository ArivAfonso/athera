'use client'

import { cn } from '@/utils/cn'
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts'
import { CustomTooltip } from '../CustomTooltip'
import WidgetCard from '../WidgetCard'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { useThemeMode } from '@/hooks/useThemeMode'
import { useState, useRef, useEffect } from 'react'

const data = [
    {
        label: 'Mon',
        amount: 70,
    },
    {
        label: 'Tue',
        amount: 50,
    },
    {
        label: 'Thu',
        amount: 60,
    },
    {
        label: 'Wed',
        amount: 30,
    },
    {
        label: 'Fri',
        amount: 82,
    },
    {
        label: 'Sat',
        amount: 90,
    },
    {
        label: 'Sun',
        amount: 65,
    },
]

export default function ExpenseHistory({ className }: { className?: string }) {
    const isTablet = window.innerWidth <= 1024
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
            title="Expense History"
            headerClassName="items-center"
            // action={
            //     <DropdownAction
            //         className="rounded-md border"
            //         options={viewOptions}
            //         onChange={handleChange}
            //         dropdownClassName="!z-0"
            //     />
            // }
            description="Total expenses in the last 7 days"
            descriptionClassName="text-gray-500 text-sm my-1.5"
            action={
                <div className="mt-1 flex items-center gap-2">
                    <h2 className="font-semibold">$108.87k</h2>
                </div>
            }
            className={cn('min-h-[28rem]', className)}
        >
            <div
                className="h-[27.3rem] text-xs w-full pe-1 pt-3 overflow-y-auto"
                ref={divRef}
            >
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                    {...(isTablet && { minWidth: '700px' })}
                >
                    <AreaChart
                        data={data}
                        margin={{
                            left: 2,
                            right: 5,
                            bottom: 10,
                        }}
                        className="[&_.recharts-cartesian-axis-tick-value]:fill-gray-500 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-vertical]:opacity-0"
                    >
                        <defs>
                            <linearGradient
                                id="amountCustomer"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#EE0000"
                                    stopOpacity={0.15}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#EE0000"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="8 10"
                            strokeOpacity={0.435}
                        />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={20}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickMargin={20}
                            tickFormatter={(label) => `$${label}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            dataKey="amount"
                            stroke="#EE0000"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#amountCustomer)"
                            dot={<CustomizedDot />}
                            activeDot={<CustomizedDot />}
                            isAnimationActive={isAnimationActive}
                            animationDuration={500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </WidgetCard>
    )
}

function CustomizedDot(props: any) {
    const { cx, cy } = props
    const themeMode = useThemeMode()
    return (
        <svg
            x={cx - 6}
            y={cy - 9}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            className="scale-150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="7"
                cy="7"
                r="5.5"
                fill="#EE0000"
                stroke={themeMode.isDarkMode ? '#1F2937' : '#fff'}
                strokeWidth="4"
            />
        </svg>
    )
}
