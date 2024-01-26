'use client'

import React, { useState, MouseEvent } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { customTooltips, chartLinearGradient } from '../utils'
import DashboardChart from '../Charts/DashboardChart'

const earnings = {
    today: {
        users: [20, 36, 28, 50, 40, 55, 40, 75, 35, 40, 35, 58],
        labels: [
            '2(h)',
            '4(h)',
            '6(h)',
            '8(h)',
            '10(h)',
            '12(h)',
            '14(h)',
            '16(h)',
            '18(h)',
            '20(h)',
            '22(h)',
            '24(h)',
        ],
    },
    week: {
        users: [40, 30, 35, 20, 25, 40, 35],
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
    month: {
        users: [45, 20, 35, 32, 50, 45, 32, 35, 25, 40, 30, 55],
        labels: ['1-5', '6-10', '11-15', '16-20', '21-25', '26-31'],
    },
}

interface MonthlyEarningProps {
    title?: string
}

const MonthlyEarning: React.FC<MonthlyEarningProps> = ({
    title = 'Total Views',
}) => {
    const [earningsTab, setEarningsTab] = useState<string>('today')

    const handleTabActivation = (value: string, e: MouseEvent) => {
        e.preventDefault()
        setEarningsTab(value)
    }

    const earningsData =
        earnings !== null
            ? [
                  {
                      //@ts-ignore
                      data: earnings[earningsTab].users,
                      borderColor: '#8231D3',
                      borderWidth: 3,
                      fill: true,
                      backgroundColor: () =>
                          chartLinearGradient(
                              document.getElementById(
                                  'athera-views'
                              ) as HTMLCanvasElement,
                              300,
                              {
                                  start: '#8231D340',
                                  end: '#ffffff05',
                              }
                          ),
                      label: 'Current period',
                      pointStyle: 'circle',
                      pointRadius: '0',
                      hoverRadius: '9',
                      pointBorderColor: '#fff',
                      pointBackgroundColor: '#8231D3',
                      hoverBorderWidth: 5,
                      amount: '$7,596',
                  },
              ]
            : []

    return (
        <>
            {earningsData.length > 0 && (
                <div className="bg-white dark:bg-[#1b1e2b] m-0 p-0 text-theme-gray dark:text-white60 text-[15px] rounded-xl relative h-full">
                    <div className="h-[60px] px-[25px] text-dark dark:text-white87 font-medium text-[17px] flex flex-wrap items-center justify-between sm:flex-col sm:h-auto sm:mb-[15px]">
                        <h1 className="mb-0 inline-flex items-center py-[18px] sm:pb-[5px] overflow-hidden whitespace-nowrap text-ellipsis text-2xl font-semibold">
                            {title}
                        </h1>
                    </div>
                    <div className="hexadash-chart-container px-[25px] pb-[25px]">
                        <DashboardChart
                            id="athera-views"
                            // @ts-ignore
                            labels={earnings[earningsTab].labels}
                            datasets={earningsData}
                            layout={{
                                padding: {
                                    left: -10,
                                    right: -10,
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
                                        drawTicks: false,
                                        drawBorder: false,
                                        borderWidth: 0,
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        font: {
                                            size: 13,
                                            family: "'Jost', sans-serif",
                                        },
                                        color: '#747474',
                                        max: 80,
                                        min: 0,
                                        stepSize: 20,
                                        padding: 10,
                                        callback(label: any) {
                                            return `${label}k`
                                        },
                                    },
                                },

                                x: {
                                    grid: {
                                        display: true,
                                        zeroLineWidth: 2,
                                        zeroLineColor: 'transparent',
                                        color: 'transparent',
                                        z: 1,
                                        tickMarkLength: 10,
                                        drawTicks: true,
                                        drawBorder: false,
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        font: {
                                            size: 13,
                                            family: "'Jost', sans-serif",
                                        },
                                        color: '#747474',
                                    },
                                },
                            }}
                            tooltip={{
                                custom: customTooltips,
                                callbacks: {
                                    title() {
                                        return `Total Views`
                                    },
                                    label(t: any) {
                                        const { formattedValue, dataset } = t
                                        return `${formattedValue}k ${dataset.label}`
                                    },
                                },
                            }}
                            height={
                                window.innerWidth < 1399
                                    ? window.innerWidth < 575
                                        ? 220
                                        : 130
                                    : 90
                            }
                        />
                    </div>
                </div>
            )}
        </>
    )
}

MonthlyEarning.defaultProps = {
    title: 'Total Views',
}

MonthlyEarning.propTypes = {
    title: PropTypes.string,
}

export default MonthlyEarning
