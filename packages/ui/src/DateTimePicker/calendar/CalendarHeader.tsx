import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

interface CalendarHeaderProps {
    currentDate: Date
    onPrevMonth: () => void
    onNextMonth: () => void
    onMonthYearClick: () => void
}

export function CalendarHeader({
    currentDate,
    onPrevMonth,
    onNextMonth,
    onMonthYearClick,
}: CalendarHeaderProps) {
    return (
        <div className="flex items-center justify-between px-2 py-1.5">
            <button
                onClick={onPrevMonth}
                className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
            >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            <button
                onClick={onMonthYearClick}
                className="text-sm font-semibold text-gray-900 hover:bg-gray-100 px-2 py-0.5 rounded-md transition-colors"
            >
                {format(currentDate, 'MMMM yyyy')}
            </button>

            <button
                onClick={onNextMonth}
                className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
            >
                <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
        </div>
    )
}
