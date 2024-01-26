'use client'

import React from 'react'
import { Cards } from '../Charts/ChartCard'
import DashboardChart from '../Charts/DashboardChart'

const chartData = {
    title: 'Views/Viewers',
    labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
    ],
    orders: [10, 55, 42, 30, 42, 80, 35, 10, 53, 62],
    sales: [30, 30, 35, 10, 5, 60, 8, 42, 30, 70],
    total: '8,550',
    growthRate: '25.36',
    growthStatus: 'down',
}

const ProfitGrowth = React.memo(() => {
    const profitGrowthData = chartData

    const profitGrowthDataset = [
        {
            data: profitGrowthData.orders,
            backgroundColor: '#00AAFF50',
            hoverBackgroundColor: '#00AAFF',
            label: 'Orders',
            average: '50.8',
            maxBarThickness: 10,
            barThickness: 12,
            percent: 49,
        },
        {
            data: profitGrowthData.sales,
            backgroundColor: '#8231D350',
            hoverBackgroundColor: '#8231D3',
            label: 'Sales',
            average: '$28k',
            maxBarThickness: 10,
            barThickness: 12,
            percent: 60,
        },
    ]
    return (
        <Cards
            title={
                <div className="flex justify-between items-center">
                    <span className="text-md inline-block pr-24">
                        {profitGrowthData.title}{' '}
                    </span>
                    <span className="pl-20 flex items-center relative">
                        <span className="text-sm">
                            {profitGrowthData.total}
                        </span>
                        {/* <span
                            className={
                                profitGrowthData.growthStatus === 'down'
                                    ? 'ninjadash-total-chart-status ninjadash-total-chart-status-down'
                                    : 'ninjadash-total-chart-status ninjadash-total-chart-status-up'
                            }
                        >
                            {profitGrowthData.growthStatus === 'growth' ? (
                                <UilUp />
                            ) : (
                                <UilDown />
                            )}
                            25.36%
                        </span> */}
                    </span>
                </div>
            }
        >
            <div className="flex items-center justify-center m--2">
                {profitGrowthDataset.map((value, index) => {
                    return (
                        <div className="flex items-center" key={index}>
                            <span
                                className="block w-2 h-2 m-2 rounded-full"
                                style={{
                                    backgroundColor: value.hoverBackgroundColor,
                                }}
                            />
                            <span className="text-sm">{value.label}</span>
                        </div>
                    )
                })}
            </div>
            <div className="ninjadash-chart-container">
                <DashboardChart
                    id="ninjadash-profit-growth"
                    labels={profitGrowthData.labels}
                    datasets={profitGrowthDataset}
                    type="bar"
                    layout={{
                        padding: {
                            top: 20,
                        },
                    }}
                    tooltip={{
                        callbacks: {
                            label(t: any) {
                                const dstLabel = t.dataset.label
                                const { formattedValue } = t
                                return `  ${formattedValue} ${dstLabel}`
                            },
                            labelColor(t: any) {
                                return {
                                    backgroundColor:
                                        t.dataset.hoverBackgroundColor,
                                    borderColor: 'transparent',
                                }
                            },
                        },
                    }}
                    scales={{
                        y: {
                            grid: {
                                color: '#485e9029',
                                borderDash: [3, 3],
                                zeroLineColor: '#485e9029',
                                zeroLineWidth: 1,
                                zeroLineBorderDash: [3, 3],
                            },
                            ticks: {
                                beginAtZero: true,
                                fontSize: 12,
                                fontColor: '#182b49',
                                max: Math.max(...profitGrowthData.orders),
                                stepSize:
                                    Math.max(...profitGrowthData.orders) / 5,
                                display: true,
                                min: 0,
                                padding: 10,
                            },
                        },

                        x: {
                            grid: {
                                display: true,
                                zeroLineWidth: 2,
                                zeroLineColor: '#fff',
                                color: 'transparent',
                                z: 1,
                            },
                            ticks: {
                                beginAtZero: true,
                                fontSize: 12,
                                fontColor: '#182b49',
                                min: 0,
                            },
                        },
                    }}
                    height={window.innerWidth <= 575 ? 200 : 178}
                />
            </div>
        </Cards>
    )
})

ProfitGrowth.displayName = 'ProfitGrowth'

export default ProfitGrowth
