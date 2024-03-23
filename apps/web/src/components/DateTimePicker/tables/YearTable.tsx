import { useState } from 'react'
import classNames from 'classnames'
import Header from './Header'
import { getDecadeRange, formatYear } from '../utils'

export interface YearTableProps {
    className?: string
    value: number
    onChange: (value: number) => void
    minYear?: number
    maxYear?: number
    yearLabelFormat?: string
    preventFocus?: boolean
}

const YearTable = (props: YearTableProps) => {
    const {
        className,
        value,
        onChange,
        minYear,
        maxYear,
        preventFocus,
        yearLabelFormat = 'YYYY',
        ...rest
    } = props

    const [decade, setDecade] = useState(value)
    const range = getDecadeRange(decade)

    const years = range.map((year) => {
        const disabled =
            year < (minYear as number) || year > (maxYear as number)

        const active = year === value

        return (
            <button
                key={year}
                disabled={disabled}
                className={classNames(
                    'text-center py-2 rounded-lg font-semibold',
                    active &&
                        !disabled &&
                        `bg-blue-700 text-white year-picker-cell-active`,
                    !active && !disabled && 'hover:bg-gray-100',
                    disabled && 'opacity-30  cursor-not-allowed'
                )}
                onClick={() => onChange(year)}
                onMouseDown={(event) => preventFocus && event.preventDefault()}
                type="button"
            >
                {formatYear(year, yearLabelFormat)}
            </button>
        )
    })

    return (
        <div className={classNames('w-full', className)} {...rest}>
            <Header
                nextLevelDisabled
                label={`${formatYear(range[0], yearLabelFormat)} - ${formatYear(
                    range[range.length - 1],
                    yearLabelFormat
                )}`}
                hasPrevious={
                    typeof minYear === 'number' ? minYear < range[0] : true
                }
                hasNext={
                    typeof maxYear === 'number'
                        ? maxYear > range[range.length - 1]
                        : true
                }
                nextLabel={'Next decade'}
                previousLabel={'Previous decade'}
                preventFocus={preventFocus}
                onNext={() => setDecade((current) => current + 10)}
                onPrevious={() => setDecade((current) => current - 10)}
            />
            <div className="w-full grid grid-cols-4 gap-4">
                {' '}
                {/* Modify this line */}
                {years}
            </div>
        </div>
    )
}

export default YearTable
