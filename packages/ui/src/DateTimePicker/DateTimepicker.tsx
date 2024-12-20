'use client'

import React, { useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Calendar } from 'lucide-react'
import { format, setMonth, setYear, setHours, setMinutes } from 'date-fns'
import { CalendarHeader } from './calendar/CalendarHeader'
import { MonthYearPicker } from './calendar/MonthYearPicker'
import { DayGrid } from './calendar/DayGrid'
import { TimeInput } from './calendar/TimeInput'

interface DateTimePickerProps {
    value: Date
    onChange: (date: Date) => void
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
    const [currentDate, setCurrentDate] = useState(value)
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false)

    const handlePrevMonth = () => {
        setCurrentDate(
            (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
        )
    }

    const handleNextMonth = () => {
        setCurrentDate(
            (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
        )
    }

    const handleMonthSelect = (month: number) => {
        setCurrentDate((prev) => setMonth(prev, month))
    }

    const handleYearSelect = (year: number) => {
        setCurrentDate((prev) => setYear(prev, year))
    }

    const handleDateSelect = (date: Date) => {
        const newDate = new Date(date)
        newDate.setHours(value.getHours(), value.getMinutes())
        onChange(newDate)
    }

    const handleTimeChange = (hours: number, minutes: number) => {
        const newDate = setMinutes(setHours(value, hours), minutes)
        onChange(newDate)
    }

    return (
        <Popover className="relative">
            <Popover.Button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-neutral-200 rounded-lg hover:bg-gray-50 dark:focus:ring-primary-500/30 focus:border-primary-300 focus:ring focus:ring-primary-200/50">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{format(value, 'PPP p')}</span>
            </Popover.Button>

            <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Popover.Panel className="absolute z-10 w-[280px] mt-1 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden md:overflow-visible">
                    {showMonthYearPicker ? (
                        <MonthYearPicker
                            currentDate={currentDate}
                            onMonthSelect={handleMonthSelect}
                            onYearSelect={handleYearSelect}
                            onBack={() => setShowMonthYearPicker(false)}
                        />
                    ) : (
                        <>
                            <CalendarHeader
                                currentDate={currentDate}
                                onPrevMonth={handlePrevMonth}
                                onNextMonth={handleNextMonth}
                                onMonthYearClick={() =>
                                    setShowMonthYearPicker(true)
                                }
                            />
                            <DayGrid
                                currentDate={currentDate}
                                selectedDate={value}
                                onSelectDate={handleDateSelect}
                            />
                            <TimeInput
                                hours={value.getHours()}
                                minutes={value.getMinutes()}
                                onChange={handleTimeChange}
                            />
                        </>
                    )}
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}

export default DateTimePicker
