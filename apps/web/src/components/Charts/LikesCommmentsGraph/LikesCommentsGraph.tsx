'use client'

/* eslint-disable no-param-reassign */
import React from 'react'
import { Cards } from '../Charts/ChartCard'
import DashboardChart from '../Charts/DashboardChart'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline'
// import { TotalChartStyleWrap, ChartContainer } from '../../Style'

const totalChartData = [
    {
        title: 'Likes',
        labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'July',
            'Aug',
            'Sep',
            'Oct',
        ],
        data: [20, 38, 30, 42, 38, 78, 60, 65, 50, 80],
        lineColor: '#760DFF',
        total: '8,550',
        status: 'growth',
        statusRate: '25.36',
    },
    {
        title: 'Comments',
        labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        data: [32, 20, 45, 35, 58, 56, 65],
        lineColor: '#01B81A',
        total: '950',
        status: 'growth',
        statusRate: '25.36',
    },
]

const TotalLineChart: React.FC = React.memo(() => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {totalChartData.map((item: any, i: any) => (
                <div
                    key={i}
                    className={`${
                        i === 2 ? 'sm:col-span-2' : 'sm:col-span-1'
                    } col-span-1`}
                >
                    {/* <TotalChartStyleWrap> */}
                    <div className="ninjaDash-total-chart">
                        {/* <ChartContainer> */}
                        <Cards
                            title={
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-semibold inline-block">
                                        Total {item.title}
                                    </span>
                                    {/* <div className="flex justify-end items-end">
                                        <span className="text-base font-semibold text-dark-text">
                                            {' '}
                                            $8550
                                        </span>

                                        <span
                                            className={`flex items-center text-sm font-medium`}
                                        >
                                            {item.status === 'growth' ? (
                                                <ArrowUpIcon
                                                    width={15}
                                                    height={15}
                                                />
                                            ) : (
                                                <ArrowDownIcon
                                                    width={15}
                                                    height={15}
                                                />
                                            )}{' '}
                                            25.36%
                                        </span>
                                    </div> */}
                                </div>
                            }
                        >
                            <div className="ninjadash-chart-container">
                                <DashboardChart
                                    labels={item.labels}
                                    id={`id_${i}`}
                                    datasets={[
                                        {
                                            data: item.data,
                                            borderColor: item.lineColor,
                                            borderWidth: 3,
                                            fill: false,
                                            pointBackgroundColor: '#FA8B0C',
                                            pointBorderColor: '#fff',
                                            pointHoverBorderColor: '#fff',
                                            pointBorderWidth: 0,
                                            pointHoverBorderWidth: 0,
                                            pointHoverRadius: 0,
                                            z: 5,
                                        },
                                    ]}
                                    height={
                                        window.innerWidth <= 575 ? 200 : 180
                                    }
                                    tooltip={{
                                        custom(tooltip: any) {
                                            if (!tooltip) return
                                            // disable displaying the color box;
                                            tooltip.displayColors = false
                                        },
                                        callbacks: {
                                            title(t: any) {
                                                const { label } = t[0]
                                                return `${label}`
                                            },
                                            label(t: any) {
                                                const { formattedValue } = t
                                                return `  ${item.title}: ${formattedValue}k`
                                            },
                                            labelColor() {
                                                return {
                                                    backgroundColor:
                                                        item.lineColor,
                                                    borderColor: 'transparent',
                                                }
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </Cards>
                        {/* </ChartContainer> */}
                    </div>
                    {/* </TotalChartStyleWrap> */}
                </div>
            ))}
        </div>
    )
})

TotalLineChart.displayName = 'TotalLineChart'

export default TotalLineChart
