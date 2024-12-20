import React from 'react'
import { Clock } from 'lucide-react'

interface TimeInputProps {
    hours: number
    minutes: number
    onChange: (hours: number, minutes: number) => void
}

export function TimeInput({ hours, minutes, onChange }: TimeInputProps) {
    const handleHoursChange = (value: string) => {
        const newHours = Math.min(Math.max(0, parseInt(value) || 0), 23)
        onChange(newHours, minutes)
    }

    const handleMinutesChange = (value: string) => {
        const newMinutes = Math.min(Math.max(0, parseInt(value) || 0), 59)
        onChange(hours, newMinutes)
    }

    return (
        <div className="p-2 border-t border-gray-200">
            <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <div className="flex items-center gap-1 ml-1">
                    <input
                        type="number"
                        value={hours.toString().padStart(2, '0')}
                        onChange={(e) => handleHoursChange(e.target.value)}
                        min="0"
                        max="23"
                        className="w-14 px-2 py-1 text-center text-sm border border-gray-300 rounded-md focus:border-primary-300 focus:ring focus:ring-primary-200/50 bg-white dark:border-neutral-500 dark:focus:ring-primary-500/30"
                    />
                    <span className="text-sm font-medium text-gray-500">:</span>
                    <input
                        type="number"
                        value={minutes.toString().padStart(2, '0')}
                        onChange={(e) => handleMinutesChange(e.target.value)}
                        min="0"
                        max="59"
                        className="w-14 px-2 py-1 text-center text-sm border border-gray-300 rounded-md focus:border-primary-300 focus:ring focus:ring-primary-200/50 bg-white dark:border-neutral-500 dark:focus:ring-primary-500/30"
                    />
                </div>
            </div>
        </div>
    )
}
