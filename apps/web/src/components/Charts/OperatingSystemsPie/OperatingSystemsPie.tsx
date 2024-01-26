'use client'

import React, { useMemo } from 'react'
import twitterSvg from '@/images/Twitter.svg'
import googleSvg from '@/images/Google.svg'
import facebookSvg from '@/images/Facebook.svg'
import { Cards } from '../Charts/ChartCard'
import DashboardChart from '../Charts/DashboardChart'
import Image from 'next/image'
import mac from '@/images/MacOS.png'
import windows from '@/images/Windows.png'
import linux from '@/images/Linux.png'
import android from '@/images/Android.png'
import apple from '@/images/Apple.svg'
import { DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

const SourceRevenueGenerated: React.FC = React.memo(() => {
    const chartHeight =
        window.innerWidth <= 1699 ? (window.innerWidth <= 991 ? 300 : 200) : 300
    const chartWidth =
        window.innerWidth <= 1699 ? (window.innerWidth <= 991 ? 300 : 200) : 300

    const chartjsPieChart = useMemo(
        () => ({
            height: chartHeight,
            width: chartWidth,
            labels: ['Android', 'MacOS', 'Windows', 'iOS', 'Linux', 'Others'],
            datasets: [
                {
                    data: [1540, 1540, 5346, 4873, 367, 2],
                    backgroundColor: [
                        '#22c55e',
                        '#6366f1',
                        '#5840FF',
                        '#6b7280',
                        '#eab308',
                        '#dc2626',
                    ],
                },
            ],
            scales: {
                x: {
                    display: false,
                },
                y: {
                    display: false,
                },
            },
            options: {
                maintainAspectRatio: true,
                responsive: false,
            },
            tooltip: {
                mode: 'index',
                callbacks: {
                    label(t: any) {
                        const { dataset, label, dataIndex } = t
                        return `  ${label} ${dataset.data[dataIndex]}`
                    },
                    labelColor({ dataIndex, dataset }: any) {
                        return {
                            backgroundColor: dataset.backgroundColor[dataIndex],
                            borderColor: 'transparent',
                        }
                    },
                },
            },
        }),
        [chartHeight, chartWidth]
    )

    return (
        <Cards title="Operating Systems">
            <div className="flex flex-col items-center justify-between">
                <div className="flex flex-col">
                    <div className="block">
                        <DashboardChart
                            {...chartjsPieChart}
                            type="pie"
                            id="pieChart"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 items-center gap-1">
                    <div className="px-2 sm:px-3 flex flex-col items-center">
                        <div className="flex items-center justify-center w-14 h-14 mb-2.5 rounded-xl md:w-14 md:h-14 dark:bg-green-800 bg-green-100">
                            <Image
                                className="w-7 h-7"
                                src={android}
                                alt="android"
                            />
                        </div>
                        <div className="text-center">
                            <span className="block font-bold text-xs">
                                {chartjsPieChart.labels[0]}
                            </span>
                            <span className="text-xs">
                                ${chartjsPieChart.datasets[0].data[0]}
                            </span>
                        </div>
                    </div>
                    <div className="m-2 sm:m-3 flex flex-col items-center">
                        <div className="flex items-center justify-center w-14 h-14 mb-2.5 rounded-xl md:w-14 md:h-14 dark:bg-cyan-800 bg-cyan-100">
                            <Image className="w-7 h-7" src={mac} alt="mac" />
                        </div>
                        <div className="text-center">
                            <span className="block font-bold text-xs">
                                {chartjsPieChart.labels[1]}
                            </span>
                            <span className="text-xs">
                                ${chartjsPieChart.datasets[0].data[1]}
                            </span>
                        </div>
                    </div>
                    <div className="m-2 sm:m-3 flex flex-col items-center">
                        <div className="flex items-center justify-center w-14 h-14 mb-2.5 rounded-xl md:w-14 md:h-14 dark:bg-indigo-800 bg-indigo-100">
                            <Image
                                className="w-7 h-7"
                                src={windows}
                                alt="windows"
                            />
                        </div>
                        <div className="text-center">
                            <span className="block font-bold text-xs">
                                {chartjsPieChart.labels[2]}
                            </span>
                            <span className="text-xs text-center">
                                ${chartjsPieChart.datasets[0].data[2]}
                            </span>
                        </div>
                    </div>
                    <div className="m-2 sm:m-3 flex flex-col items-center">
                        <div className="flex items-center justify-center w-14 h-14 mb-2.5 rounded-xl md:w-14 md:h-14 dark:bg-gray-800 bg-gray-100">
                            <Image className="w-8 h-8" src={apple} alt="ios" />
                        </div>
                        <div className="text-center">
                            <span className="block font-bold text-xs">
                                {chartjsPieChart.labels[3]}
                            </span>
                            <span className="text-xs">
                                ${chartjsPieChart.datasets[0].data[2]}
                            </span>
                        </div>
                    </div>
                    <div className="m-2 sm:m-3 flex flex-col items-center">
                        <div className="flex items-center justify-center w-14 h-14 mb-2.5 rounded-xl md:w-14 md:h-14 dark:bg-yellow-800 bg-yellow-100">
                            <Image
                                className="w-7 h-8"
                                src={linux}
                                alt="linux"
                            />
                        </div>
                        <div className="text-center">
                            <span className="block font-bold text-xs">
                                {chartjsPieChart.labels[4]}
                            </span>
                            <span className="text-xs">
                                ${chartjsPieChart.datasets[0].data[2]}
                            </span>
                        </div>
                    </div>
                    <div className="m-2 sm:m-3 flex flex-col items-center">
                        <div className="flex items-center justify-center w-14 h-14 mb-2.5 rounded-xl md:w-14 md:h-14 dark:bg-red-800 bg-red-100">
                            <DevicePhoneMobileIcon className="w-7 h-7" />
                        </div>
                        <div className="text-center">
                            <span className="block font-bold text-xs">
                                {chartjsPieChart.labels[5]}
                            </span>
                            <span className="text-xs">
                                ${chartjsPieChart.datasets[0].data[2]}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Cards>
    )
})

SourceRevenueGenerated.displayName = 'SourceRevenueGenerated'

export default SourceRevenueGenerated
