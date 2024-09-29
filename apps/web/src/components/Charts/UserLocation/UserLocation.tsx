'use client'

import { useState } from 'react'
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from 'react-simple-maps'
import { useThemeMode } from '@/hooks/useThemeMode'
import { cn } from '@/utils/cn'
import WidgetCard from '../WidgetCard'

const salesLocation = {
    today: [
        ['United states', '90', '$536'],
        ['United kingdom', '70', '$573'],
        ['Canada', '70', '$457'],
        ['Japan', '30', '$524'],
        ['Bangladesh', '50', '$354'],
        ['India', '60', '$654'],
    ],
    week: [
        ['Japan', '90', '$336'],
        ['United kingdom', '70', '$873'],
        ['Canada', '70', '$557'],
        ['Japan', '30', '$525'],
        ['Bangladesh', '50', '$352'],
        ['Pakistan', '60', '$658'],
    ],
    month: [
        ['Russia', '90', '$534'],
        ['Germany', '70', '$573'],
        ['Canada', '70', '$487'],
        ['Japan', '30', '$514'],
        ['Bangladesh', '50', '$394'],
        ['Vutan', '60', '$354'],
    ],
}

const geoUrl =
    'https://raw.githubusercontent.com/subyfly/topojson/master/world-countries.json'

const data = [
    { country: 'US', name: 'United States', value: 40, style: 'bg-[#028ca6]' },
    { country: 'CA', name: 'Canada', value: 20, style: 'bg-[#8bcad6]' },
    { country: 'IN', name: 'India', value: 15, style: 'bg-[#a1d4de]' },
    { country: 'CN', name: 'China', value: 5, style: 'bg-[#cce8ed]' },
    { country: 'GB', name: 'United Kingdom', value: 5, style: 'bg-[#cce8ed]' },
    { country: 'FR', name: 'France', value: 5, style: 'bg-[#cce8ed]' },
]

export default function UserLocation({ className }: { className?: string }) {
    const { isDarkMode } = useThemeMode()

    // Map Configuration
    const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 })
    const [content, setContent] = useState('')
    const handleZoomIn = () => {
        if (position.zoom >= 4) return
        setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }))
    }

    const handleZoomOut = () => {
        if (position.zoom <= 1) return
        setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }))
    }

    const handleMoveEnd = () => {
        setPosition(position)
    }

    return (
        <WidgetCard
            title={'User Location'}
            // action={
            //     <DatePicker
            //         selected={startDate}
            //         onChange={(date: Date) => setStartDate(date)}
            //         dateFormat="MMM, yyyy"
            //         placeholderText="Select Month"
            //         showMonthYearPicker
            //         popperPlacement="bottom-end"
            //         inputProps={{
            //             variant: 'text',
            //             inputClassName:
            //                 'p-0 px-1 h-auto [&_input]:text-ellipsis',
            //         }}
            //         className="w-36"
            //     />
            // }
            className={cn(
                'relative grid grid-cols-1 place-content-between gap-3',
                className
            )}
        >
            <div className="w-full h-auto overflow-hidden">
                {/* <ReactTooltip>{content}</ReactTooltip> */}
                <ComposableMap
                    data-tip=""
                    data-html
                    projectionConfig={{
                        scale: window.innerWidth <= 479 ? 190 : 120,
                    }}
                    viewBox={`20, ${
                        window.innerWidth <= 479 ? 20 : 150
                    }, 800, ${window.innerWidth <= 479 ? 500 : 320}`}
                >
                    <ZoomableGroup
                        zoom={position.zoom}
                        //@ts-ignore
                        center={position.coordinates}
                        onMoveEnd={handleMoveEnd}
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={() => {
                                            const { name } = geo.properties
                                            setContent(`${name}`)
                                        }}
                                        onMouseLeave={() => {
                                            setContent('')
                                        }}
                                        fill="#DBE1E8"
                                        stroke={isDarkMode ? '#1b1e2b' : '#FFF'}
                                        strokeWidth={0.5}
                                        style={{
                                            default: {
                                                fill: isDarkMode
                                                    ? '#374151'
                                                    : '#DBE1E8',
                                                outline: 'none',
                                            },
                                            hover: {
                                                fill: '#5F63F2',
                                                outline: 'none',
                                            },
                                            pressed: {
                                                fill: '#5F63F2',
                                                outline: 'none',
                                            },
                                        }}
                                    />
                                ))
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>

                <div className="controls">
                    <button
                        className="cursor-pointer flex justify-center items-center focus:outline-none rounded-tl-6 rounded-tr-6 rounded-br-0 rounded-bl-0"
                        onClick={handleZoomIn}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                    <button
                        className="cursor-pointer flex justify-center items-center focus:outline-none"
                        onClick={handleZoomOut}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="col-span-full text-sm -mx-5 border-t border-dashed border-muted px-5 pt-5 lg:-mx-7 lg:px-7">
                <div className="mx-auto flex w-full max-w-md flex-wrap justify-center gap-x-3 gap-y-1.5 text-center">
                    {data.map((country) => (
                        <div
                            key={country.name}
                            className="flex items-center gap-1"
                        >
                            {/* <Badge
                                renderAsDot
                                className={cn(country.style, 'dark:invert')}
                            /> */}
                            <p className="text-gray-500 dark:text-gray-600">
                                {country.name}
                                <span className="ms-1 font-lexend font-medium text-gray-700">
                                    {`${country.value}%`}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </WidgetCard>
    )
}
