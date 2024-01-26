'use client'

import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { Cards } from '../Charts/ChartCard'
import { useThemeMode } from '@/hooks/useThemeMode'
// Sample data

const PerformanceOverviewRadial = React.memo(() => {
    const { isDarkMode } = useThemeMode()

    const labels = ['Good', 'Average', 'Horrible']
    const dataSets = {
        series: [90, 80, 70],
        options: {
            chart: {
                width: '100%',
                height: '100%',
                type: 'radialBar',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#22c55e', '#f97316', '#dc2626'],
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 0,
                        size: '38%',
                    },
                    track: {
                        show: true,
                        margin: 9,
                        background: isDarkMode ? '#1F2937' : '#f2f2f2',
                    },
                    dataLabels: {
                        show: true,
                        name: {
                            offsetY: 20,
                        },
                        value: {
                            fontSize: '24px',
                            fontFamily: '"Jost", sans-serif',
                            color: isDarkMode ? '#fafafa' : '#404040',
                            fontWeight: 600,
                            offsetY: -21,
                        },
                        total: {
                            show: true,
                            label: 'Comments',
                            fontSize: '16px',
                            fontFamily: '"Jost", sans-serif',
                            fontWeight: 400,
                            color: isDarkMode ? '#fafafa' : '#404040',
                            formatter() {
                                return '2 mins'
                            },
                        },
                    },
                },
            },
            stroke: {
                lineCap: 'round',
            },
            grid: {
                padding: {
                    to: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            labels,
        },
    }
    return (
        <Cards
            key={isDarkMode ? 'dark' : 'light'}
            title="Reading Time"
            size="large"
        >
            <div className="flex justify-center items-center">
                <Chart
                    //@ts-ignore
                    options={dataSets.options}
                    series={dataSets.series}
                    type="radialBar"
                    width={320}
                />
            </div>
            <div className="flex m-5 justify-between items-center">
                {dataSets.series.map((value, index) => {
                    return (
                        <div className="flex items-center" key={index}>
                            <span
                                className="block w-3 h-3 rounded-full m-1"
                                style={{
                                    backgroundColor:
                                        dataSets.options.colors[index],
                                }}
                            />
                            <span className="text-sm">{labels[index]}</span>
                        </div>
                    )
                })}
            </div>
        </Cards>
    )
})

PerformanceOverviewRadial.displayName = 'PerformanceOverviewRadial'

export default PerformanceOverviewRadial
