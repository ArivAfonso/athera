'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts'
import WidgetCard from '../WidgetCard'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { useThemeMode } from '@/hooks/useThemeMode'
import { useState, useRef, useEffect } from 'react'

const data = [
    { name: 'Available storage', value: 22 },
    { name: 'Total used storage', value: 78 },
]
const COLORS = ['#BFDBFE', '#0070F3']

function CustomLabel(props: any) {
    const { cx, cy } = props.viewBox
    return (
        <>
            <text
                x={cx}
                y={cy - 5}
                fill="#111111"
                className="recharts-text recharts-label"
                textAnchor="middle"
                dominantBaseline="central"
            >
                <tspan alignmentBaseline="middle" fontSize="36px">
                    {props.value1} GB
                </tspan>
            </text>
            <text
                x={cx}
                y={cy + 20}
                fill="#666666"
                className="recharts-text recharts-label"
                textAnchor="middle"
                dominantBaseline="central"
            >
                <tspan fontSize="14px">{props.value2}</tspan>
            </text>
        </>
    )
}

export default function StorageSummary({ className }: { className?: string }) {
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
            title={'Used Storage'}
            description="Shows the source of this post's audience"
            descriptionClassName="text-gray-500 text-sm my-1.5"
            className={className}
        >
            <div className="h-[280px] text-sm w-full sm:py-3" ref={divRef}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart className="[&_.recharts-layer:focus]:outline-none [&_.recharts-sector:focus]:outline-none dark:[&_.recharts-text.recharts-label]:first-of-type:fill-gray-400">
                        <Pie
                            data={data}
                            cornerRadius={40}
                            innerRadius={100}
                            outerRadius={120}
                            paddingAngle={10}
                            fill="#BFDBFE"
                            stroke="rgba(0,0,0,0)"
                            dataKey="value"
                            animationDuration={500}
                            isAnimationActive={isAnimationActive}
                        >
                            <Label
                                width={30}
                                position="center"
                                content={
                                    <CustomLabel
                                        value1={data[1].value}
                                        value2={'Used of 100'}
                                    />
                                }
                            ></Label>
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="  ">
                {data.map((item, index) => (
                    <div
                        key={item.name}
                        className="mb-4 flex items-center justify-between border-b border-muted pb-4 last:mb-0 last:border-0 last:pb-0"
                    >
                        <div className="flex items-center justify-start">
                            <span
                                className="me-2 h-2 w-2 rounded-full"
                                style={{ backgroundColor: COLORS[index] }}
                            />
                            <span className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-400">
                                {item.name}
                            </span>
                        </div>
                        <span>{item.value}%</span>
                    </div>
                ))}
            </div>
        </WidgetCard>
    )
}
