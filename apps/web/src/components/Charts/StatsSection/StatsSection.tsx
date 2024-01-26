import React, { FC, memo } from 'react'
import StatsCard from './StatsCard'

interface OverviewDataItem {
    id: number
    type: string
    icon: string
    label: string
    total: string
    suffix: string
    prefix: string
    status: string
    statusRate: string
    decimel: number
    dataPeriod: string
    statusColor: string
    decimels?: number
    separator?: string
}

interface OverviewDataListProps {
    OverviewData: OverviewDataItem[]
}

const OverviewDataList: FC<OverviewDataListProps> = ({ OverviewData }) => {
    const OverviewDataSorted = OverviewData.slice(
        Math.max(OverviewData.length - 4, 1)
    )

    return (
        <div className="flex flex-wrap -mx-6">
            {OverviewDataSorted.map((item, i) => {
                return (
                    <div
                        key={i}
                        className="w-full sm:w-1/2 xxl:w-1/4 px-6 mb-6"
                    >
                        {/* @ts-ignore */}
                        <StatsCard data={item} contentFirst halfCircleIcon />
                    </div>
                )
            })}
        </div>
    )
}

export default memo(OverviewDataList)
