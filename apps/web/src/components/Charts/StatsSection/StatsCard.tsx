'use client'

import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { useLocation } from 'react-use'

interface OverviewCardProps {
    data: {
        type: string
        icon: string
        label: string
        total: string
        status: string
        statusRate: number
        dataPeriod: string
        suffix: string
        prefix: string
        decimels: number
        statusColor: string
        separator: string
    }
    className?: string
    bottomStatus?: boolean
    contentFirst?: boolean
    halfCircleIcon?: boolean
}

const OverviewCard: React.FC<OverviewCardProps> = ({
    data,
    className = '',
    bottomStatus = true,
    contentFirst = false,
    halfCircleIcon = false,
}) => {
    const [didViewCountUp, setDidViewCountUp] = useState(false)

    const { pathname } = useLocation()
    useEffect(() => {
        setDidViewCountUp(true)
    }, [pathname])

    const {
        type,
        icon,
        label,
        total,
        status,
        statusRate,
        dataPeriod,
        suffix,
        prefix,
        decimels,
        statusColor,
        separator,
    } = data
    const totalNumber = Number(total)

    return (
        <div className={className}>
            <div
                className={
                    halfCircleIcon
                        ? 'p-[25px] bg-white dark:bg-[#1b1e2b] rounded-xl relative text-[15px] text-theme-gray dark:text-white60 leading-6'
                        : 'p-[25px] bg-white dark:bg-[#1b1e2b] rounded-xl relative text-[15px] text-theme-gray dark:text-white60 leading-6'
                }
            >
                <>
                    <div className="flex justify-between">
                        <div
                            className={
                                contentFirst
                                    ? `flex items-center justify-center order-2 bg-${type}-transparent text-${type} w-[58px] h-[58px] rounded-2xl`
                                    : `flex items-center justify-center bg-${type}-transparent text-${type} w-[58px] h-[58px] rounded-2xl`
                            }
                        >
                            {/* <ReactSVG
                                className={`fill-${type} w-[25px] h-[25px] svg-w-full [&>div>svg]:w-full [&>div>svg]:h-full flex items-center`}
                                src={require(`../../static/img/icon/${icon}`)}
                            /> */}
                        </div>
                        <div className={contentFirst ? '' : 'text-end'}>
                            {halfCircleIcon ? (
                                <>
                                    <span className="text-sm font-normal text-body dark:text-white60">
                                        {label}
                                    </span>
                                    <h4 className="mb-0 text-3xl lg:text-[26px] sm:text-2xl font-semibold leading-normal text-dark dark:text-white87">
                                        <CountUp
                                            start={0}
                                            end={
                                                didViewCountUp ? totalNumber : 0
                                            }
                                            suffix={suffix}
                                            prefix={prefix}
                                            delay={0.5}
                                            decimals={decimels}
                                            separator={separator}
                                            duration={2}
                                        />
                                    </h4>
                                </>
                            ) : (
                                <>
                                    <h4 className="mb-0 text-3xl lg:text-[26px] sm:text-2xl font-semibold leading-normal text-dark dark:text-white87">
                                        <CountUp
                                            start={0}
                                            end={
                                                didViewCountUp ? totalNumber : 0
                                            }
                                            suffix={suffix}
                                            prefix={prefix}
                                            delay={0.5}
                                            decimals={decimels}
                                            separator={separator}
                                            duration={2}
                                        />
                                    </h4>
                                    <span className="font-normal text-body dark:text-white60 text-15">
                                        {label}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </>
            </div>
        </div>
    )
}

export default OverviewCard
