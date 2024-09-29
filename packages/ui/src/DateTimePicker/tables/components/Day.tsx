import { forwardRef } from 'react'
import classNames from 'classnames'
import type { ComponentPropsWithRef, ReactNode, MouseEvent } from 'react'

export interface DayProps
    extends Omit<ComponentPropsWithRef<'button'>, 'value' | 'onMouseEnter'> {
    children?: ReactNode
    className?: string
    value: Date
    selected: boolean
    weekend: boolean
    outOfMonth: boolean
    onMouseEnter: (date: Date, event: MouseEvent<HTMLButtonElement>) => void
    hasValue: boolean
    inRange: boolean
    firstInRange: boolean
    lastInRange: boolean
    isToday: boolean
    fullWidth: boolean
    firstInMonth: boolean
    focusable: boolean
    hideOutOfMonthDates?: boolean
    renderDay?: (date: Date) => ReactNode
    disabled: boolean
}

function getDayTabIndex({
    focusable,
    hasValue,
    selected,
    firstInMonth,
}: {
    focusable: boolean
    hasValue: boolean
    selected: boolean
    firstInMonth: boolean
}) {
    if (!focusable) {
        return -1
    }

    if (hasValue) {
        return selected ? 0 : -1
    }

    return firstInMonth ? 0 : -1
}

const Day = forwardRef<HTMLButtonElement, DayProps>((props, ref) => {
    const {
        className,
        value,
        selected,
        weekend,
        outOfMonth,
        onMouseEnter,
        hasValue,
        firstInRange,
        lastInRange,
        inRange,
        isToday,
        firstInMonth,
        focusable,
        hideOutOfMonthDates,
        renderDay,
        disabled,
        fullWidth,
        ...others
    } = props

    return (
        <button
            {...others}
            ref={ref}
            type="button"
            disabled={disabled}
            tabIndex={getDayTabIndex({
                focusable,
                hasValue,
                selected,
                firstInMonth,
            })}
            className={classNames(
                'h-full w-full font-normal',
                disabled && 'opacity-30  cursor-not-allowed',
                isToday && `border border-primary-500`,
                weekend && !disabled && 'date-picker-cell-weekend',
                outOfMonth && !disabled && 'text-gray-400 dark:text-gray-500',
                outOfMonth && hideOutOfMonthDates && 'd-none',
                !outOfMonth &&
                    !disabled &&
                    !selected &&
                    'text-gray-700 dark:text-gray-100',
                !disabled &&
                    !selected &&
                    !inRange &&
                    'hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-gray-300',
                selected && !disabled && `bg-blue-700 text-gray-100`,
                inRange &&
                    !disabled &&
                    !firstInRange &&
                    !lastInRange &&
                    !selected &&
                    `bg-blue-700 bg-opacity-10`,
                !inRange && !firstInRange && !lastInRange && 'rounded-lg',
                firstInRange &&
                    !disabled &&
                    'ltr:rounded-tl-lg ltr:rounded-bl-lg rtl:rounded-tr-lg rtl:rounded-br-lg',
                lastInRange &&
                    !disabled &&
                    'ltr:rounded-tr-lg ltr:rounded-br-lg rtl:rounded-tl-lg rtl:rounded-bl-lg',
                className
            )}
            onMouseEnter={(event) => onMouseEnter(value, event)}
        >
            {typeof renderDay === 'function'
                ? renderDay(value)
                : value?.getDate()}
        </button>
    )
})

Day.displayName = 'Day'

export default Day
