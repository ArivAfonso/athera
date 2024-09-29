import {
    ValueType,
    NameType,
} from 'recharts/types/component/DefaultTooltipContent'
import { TooltipProps } from 'recharts'
import { cn } from '@/utils/cn'

function isValidHexColor(colorCode: string) {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return hexColorRegex.test(colorCode)
}

function addSpacesToCamelCase(str: string) {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2')
}

function formatNumber(value: number): string {
    // Check if the value is less than 0
    if (value < 0) {
        // Handle negative values separately and format the absolute value
        const absoluteValue = Math.abs(value)
        return `-${formatNumber(absoluteValue)}`
    } else if (value >= 1e9) {
        // Format the value in billions
        const formattedValue = value / 1e9
        return `${formattedValue.toFixed(1)}B`
    } else if (value >= 1e6) {
        // Check if the value is between 1 million and 1 billion
        // Format the value in millions
        const formattedValue = value / 1e6
        return `${formattedValue.toFixed(1)}M`
    } else if (value >= 1000) {
        // Check if the value is between 1 thousand and 1 million
        // Format the value in thousands
        const formattedValue = value / 1000
        return `${formattedValue.toFixed(1)}K`
    } else {
        // If the value is less than 1 thousand, return the original value as a string
        return value.toString()
    }
}

export interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
    prefix?: string
    postfix?: string
    className?: string
    formattedNumber?: boolean
}

export function CustomTooltip({
    label,
    prefix,
    active,
    postfix,
    payload,
    className,
    formattedNumber,
}: CustomTooltipProps) {
    if (!active) return null

    return (
        <div
            className={cn(
                'overflow-hidden rounded-md border border-gray-300 dark:border-gray-800 bg-white shadow-2xl dark:bg-gray-900',
                className
            )}
        >
            <h3 className="label mb-0.5 block bg-gray-100 dark:bg-gray-700 p-2 px-2.5 text-center font-lexend text-xs font-semibold capitalize text-gray-600  dark:text-gray-200">
                {label}
            </h3>
            <div className="px-3 py-1.5 text-xs">
                {payload?.map((item: any, index: number) => (
                    <div
                        key={item.dataKey + index}
                        className="chart-tooltip-item flex items-center py-1.5"
                    >
                        <span
                            className="me-1.5 h-2 w-2 rounded-full"
                            style={{
                                backgroundColor: isValidHexColor(item.fill)
                                    ? item.fill === '#fff'
                                        ? item.stroke
                                        : item.fill
                                    : item.stroke,
                            }}
                        />
                        <span className="capitalize">
                            {addSpacesToCamelCase(item.dataKey)}:
                        </span>{' '}
                        <span className="font-medium text-gray-900 dark:text-gray-200">
                            {prefix && prefix + `{'}'}`}
                            {formattedNumber
                                ? formatNumber(item.value)
                                : item.value}
                            {postfix && postfix}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
