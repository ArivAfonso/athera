import React from 'react'
import { ChevronLeft } from 'lucide-react'

interface MonthYearPickerProps {
    currentDate: Date
    onMonthSelect: (month: number) => void
    onYearSelect: (year: number) => void
    onBack: () => void
}

export function MonthYearPicker({
    currentDate,
    onMonthSelect,
    onYearSelect,
    onBack,
}: MonthYearPickerProps) {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    const currentYear = currentDate.getFullYear()
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

    return (
        <div className="p-2">
            <button
                onClick={onBack}
                className="flex items-center text-xs text-gray-600 hover:text-gray-900 mb-2"
            >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
            </button>

            <div className="grid grid-cols-3 gap-1">
                {months.map((month, index) => (
                    <button
                        key={month}
                        onClick={() => onMonthSelect(index)}
                        className={`p-1.5 text-xs rounded-md transition-colors ${
                            currentDate.getMonth() === index
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        {month.slice(0, 3)}
                    </button>
                ))}
            </div>

            <div className="mt-2 grid grid-cols-3 gap-1">
                {years.map((year) => (
                    <button
                        key={year}
                        onClick={() => onYearSelect(year)}
                        className={`p-1.5 text-xs rounded-md transition-colors ${
                            currentDate.getFullYear() === year
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        {year}
                    </button>
                ))}
            </div>
        </div>
    )
}
