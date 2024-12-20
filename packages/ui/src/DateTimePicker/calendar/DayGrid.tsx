import React from 'react'
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isToday,
    isBefore,
    startOfDay,
} from 'date-fns'

interface DayGridProps {
    currentDate: Date
    selectedDate: Date
    onSelectDate: (date: Date) => void
}

export function DayGrid({
    currentDate,
    selectedDate,
    onSelectDate,
}: DayGridProps) {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const today = startOfDay(new Date())

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    const startDay = monthStart.getDay()
    const leadingDays = Array(startDay).fill(null)

    return (
        <div className="p-2">
            <div className="grid grid-cols-7 gap-0.5 mb-1">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs font-medium text-gray-500"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
                {leadingDays.map((_, index) => (
                    <div key={`empty-${index}`} className="h-7" />
                ))}

                {days.map((day) => {
                    const isPast = isBefore(day, today)
                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => !isPast && onSelectDate(day)}
                            disabled={isPast}
                            className={`
                h-7 w-full rounded-md text-xs font-medium transition-colors
                ${
                    isPast
                        ? 'text-gray-300 cursor-not-allowed'
                        : isSameDay(day, selectedDate)
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : isToday(day)
                            ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            : 'text-gray-900 hover:bg-gray-100'
                }
              `}
                        >
                            {format(day, 'd')}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
