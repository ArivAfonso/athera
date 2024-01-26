'use client'

import React, { ReactNode } from 'react'
import { Cards } from '../Charts/ChartCard'
import Badge from '@/components/Badge/Badge'
import facebookSvg from '@/images/Facebook.svg'
import Image from 'next/image'

// const moreContent = (
//   <>
//     <NavLink to="#">
//       <UilPrint />
//       <span>Printer</span>
//     </NavLink>
//     <NavLink to="#">
//       <UilBookOpen />
//       <span>PDF</span>
//     </NavLink>
//     <NavLink to="#">
//       <UilFileAlt />
//       <span>Google Sheets</span>
//     </NavLink>
//     <NavLink to="#">
//       <UilTimes />
//       <span>Excel (XLSX)</span>
//     </NavLink>
//     <NavLink to="#">
//       <UilFile />
//       <span>CSV</span>
//     </NavLink>
//   </>
// );

const locationColumns = [
    {
        title: '',
        dataIndex: 'channel',
        key: 'channel',
        width: 200,
    },
    {
        title: '',
        dataIndex: 'traffic',
        key: 'traffic',
        width: 40,
    },
    {
        title: '',
        dataIndex: 'percentage',
        key: 'percentage',
    },
]

const trafficData = [
    {
        id: 1,
        channel: 'Facebook',
        traffic: '38,536',
        percent: 90,
        progressType: 'primary',
        svg: facebookSvg,
        color: '#3b5998',
    },
    {
        id: 2,
        channel: 'Instragram',
        traffic: '28,536',
        percent: 70,
        progressType: 'info',
        color: '#e1306c',
    },
    {
        id: 3,
        channel: 'WhatsApp',
        traffic: '18,536',
        percent: 60,
        progressType: 'success',
        color: '#25d366',
    },
    {
        id: 4,
        channel: 'Twitter',
        traffic: '15,536',
        percent: 55,
        progressType: 'secondary',
        color: '#1da1f2',
    },
    {
        id: 5,
        channel: 'YouTube',
        traffic: '10,536',
        percent: 50,
        progressType: 'warning',
        color: '#ff0000',
    },
    {
        id: 6,
        channel: 'LinkedIn',
        traffic: '9,536',
        percent: 45,
        progressType: 'dark',
        color: '#0e76a8',
    },
]

function TrafficChannel() {
    const locationData: any[] = []

    // trafficData.map(({ id, channel, traffic, percent, progressType }) => {
    //     return locationData.push({
    //         key: id,
    //         channel: (
    //             <span className="ninjadash-social-channel">{channel}</span>
    //         ),
    //         traffic: <span className="ninjadash-traffic">{traffic}</span>,
    //         percentage: (
    //             <Progress
    //                 percent={percent}
    //                 strokeWidth={5}
    //                 status="active"
    //                 showInfo={false}
    //                 className={`progress-dt progress-${progressType}`}
    //             />
    //         ),
    //     })
    // })

    return (
        <div className="full-width-table">
            <Cards title="Social Media Traffic">
                {/* <TrafficTableWrapper> */}
                <div className="table-bordered table-responsive">
                    <div className="flex flex-col space-y-8">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300 dark:divide-neutral-600">
                                    <thead>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-start text-sm font-normal text-neutral-600 dark:text-neutral-400 sm:pl-0 capitalize"
                                            >
                                                Source
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                                            >
                                                Visitors
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                                            >
                                                Time Spent
                                            </th>
                                            {/* <th
                                                scope="col"
                                                className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                                            >
                                                Bookmarks
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                                            >
                                                Comments
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-600">
                                        {trafficData.map((source, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className="whitespace-nowrap py-4 sm:py-5 ps-4 pe-3 text-sm sm:ps-0">
                                                        <div className="h-12 w-12 sm:h-16 sm:w-16 relative flex-shrink-0">
                                                            <>
                                                                <Image
                                                                    src={
                                                                        source.svg
                                                                            ? source.svg
                                                                            : ''
                                                                    }
                                                                    alt=""
                                                                    className="rounded-md object-cover w-full h-full"
                                                                    fill
                                                                />
                                                            </>
                                                        </div>

                                                        <div className="ms-4">
                                                            <div className="font-medium text-gray-900 dark:text-neutral-200 w-84 max-w-sm flex whitespace-normal">
                                                                <span
                                                                    dangerouslySetInnerHTML={{
                                                                        __html:
                                                                            source.channel ||
                                                                            '',
                                                                    }}
                                                                ></span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                        <Badge
                                                            name={
                                                                (source.traffic as ReactNode) ||
                                                                0
                                                            }
                                                            color="red"
                                                            className="rounded-md"
                                                        />
                                                    </td>
                                                    {/* <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                        <CategoryBadgeList
                                                            categories={
                                                                post.post_categories
                                                            }
                                                            chars={20}
                                                            className="flex space-x-1 justify-center"
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-8 py-5 text-sm text-gray-500">
                                                        <Badge
                                                            name={
                                                                (post
                                                                    .bookmarkCount[0]
                                                                    .count as ReactNode) ||
                                                                0
                                                            }
                                                            color="blue"
                                                            className="rounded-md"
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-8 py-5 text-sm text-gray-500">
                                                        <Badge
                                                            name={
                                                                (post
                                                                    .commentCount[0]
                                                                    .count as ReactNode) ||
                                                                0
                                                            }
                                                            color="blue"
                                                            className="rounded-md"
                                                        />
                                                    </td> */}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* </TrafficTableWrapper> */}
            </Cards>
        </div>
    )
}

export default TrafficChannel
