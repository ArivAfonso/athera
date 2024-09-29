import classNames from 'classnames'
import Header from './Header'

import { isMonthInRange, getMonthsNames, formatYear } from '../utils'

export interface MonthTableProps {
    className: string
    value: { year: number; month: number }
    onChange: (value: number) => void
    locale: string
    year: number
    onYearChange: (year: number) => void
    onNextLevel?: () => void
    minDate?: Date
    maxDate?: Date
    monthLabelFormat?: string
    yearLabelFormat?: string
    preventFocus?: boolean
}

const MonthTable = (props: MonthTableProps) => {
    const {
        className,
        value,
        onChange,
        locale,
        year,
        onYearChange,
        onNextLevel,
        minDate,
        maxDate,
        preventFocus,
        monthLabelFormat = 'MMM',
        yearLabelFormat = 'YYYY',
        ...rest
    } = props

    const range = getMonthsNames(locale, monthLabelFormat)
    const minYear = minDate instanceof Date ? minDate.getFullYear() : undefined
    const maxYear = maxDate instanceof Date ? maxDate.getFullYear() : undefined

    const months = range.map((month, index) => {
        const disabled = !isMonthInRange({
            date: new Date(year, index),
            minDate,
            maxDate,
        })

        const active = index === value.month && year === value.year

        return (
            <button
                key={month}
                className={classNames(
                    'text-center py-2 rounded-lg font-semibold',
                    active &&
                        !disabled &&
                        `bg-blue-700 text-white month-picker-cell-active`,
                    !active && !disabled && 'hover:bg-gray-100',
                    disabled && 'opacity-30  cursor-not-allowed'
                )}
                disabled={disabled}
                onClick={() => onChange(index)}
                onMouseDown={(event) => preventFocus && event.preventDefault()}
                type="button"
            >
                {month}
            </button>
        )
    })

    return (
        <div className={classNames('w-full', className)} {...rest}>
            <Header
                label={formatYear(year, yearLabelFormat)}
                hasNext={typeof maxYear === 'number' ? year < maxYear : true}
                hasPrevious={
                    typeof minYear === 'number' ? year > minYear : true
                }
                className={className}
                nextLabel={'Next year'}
                previousLabel={'Previous year'}
                preventFocus={preventFocus}
                onNext={() => onYearChange(year + 1)}
                onPrevious={() => onYearChange(year - 1)}
                onNextLevel={onNextLevel}
            />
            <div className="w-full grid grid-cols-3 gap-4">{months}</div>
        </div>
    )
}

export default MonthTable
