'use client'

import React from 'react'
import { Cards } from '../Charts/ChartCard'
import DoughnutChart from '../Charts/DoughnutChart'

const PerformanceOverview = React.memo(() => {
    const labels = ['In Progress', 'Target', 'Completed']

    const options = {
        cutout: 70,
        maintainAspectRatio: false,
        responsive: false,
        borderWidth: 2,
        borderColor: 'transparent',
        plugins: {
            legend: {
                display: false,
            },
        },
        tooltips: {},
    }

    const datasets = [
        {
            data: [10, 60, 30],
            backgroundColor: ['#FA8B0C', '#8231D3', '#00E4EC'],
            centerText: '',
            centerTextLabel: 'Completed',
        },
    ]

    return (
        <Cards title="Performance Overview" size="large">
            {/* <PerfomanceOverviewStyle> */}
            <DoughnutChart
                labels={labels}
                datasets={datasets}
                width={180}
                height={180}
                option={options}
            />
            {/* <ChartPointHorizontal> */}
            <div className="flex items-center justify-between m-5 pb-1">
                {datasets[0].data.map((value, index) => {
                    return (
                        <div className="flex items-center" key={index}>
                            <span
                                className="block w-2 h-2 m-2 rounded-full"
                                style={{
                                    backgroundColor:
                                        datasets[0].backgroundColor[index],
                                }}
                            />
                            <span className="text-sm">{labels[index]}</span>
                        </div>
                    )
                })}
            </div>
            {/* </ChartPointHorizontal>
                </PerfomanceOverviewStyle> */}
        </Cards>
    )
})

PerformanceOverview.displayName = 'PerformanceOverview'

export default PerformanceOverview
