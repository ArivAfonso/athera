import React, { useState } from 'react'

const colorThemes = [
    {
        name: 'Blue',
        colors: ['#DBEAFE', '#93C5FD', '#3B82F6', '#1D4ED8'],
        darkColors: ['#1E3A8A', '#1D4ED8', '#2563EB', '#3B82F6'],
    },
    {
        name: 'Red',
        colors: ['#FEE2E2', '#FCA5A5', '#EF4444', '#B91C1C'],
        darkColors: ['#7F1D1D', '#991B1B', '#B91C1C', '#EF4444'],
    },
    {
        name: 'Green',
        colors: ['#DCFCE7', '#86EFAC', '#22C55E', '#15803D'],
        darkColors: ['#064E3B', '#065F46', '#047857', '#10B981'],
    },
    {
        name: 'Yellow',
        colors: ['#FEF9C3', '#FDE047', '#EAB308', '#A16207'],
        darkColors: ['#78350F', '#92400E', '#B45309', '#F59E0B'],
    },
]

export default function ThemeSwitcher() {
    const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(
        null
    )
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

    return (
        <div className="flex space-x-4">
            {colorThemes.map((theme, themeIndex) => {
                const borderColor =
                    selectedThemeIndex === themeIndex
                        ? `border-${theme.colors[3]} dark:border-${theme.darkColors[0]}`
                        : 'border-transparent'

                return (
                    <div
                        key={themeIndex}
                        className={`flex flex-col items-center cursor-pointer transition-transform duration-300 ${
                            selectedThemeIndex === themeIndex
                                ? `p-0.5 border-2 rounded-xl transform rotate-45 ${borderColor}`
                                : 'transform rotate-0'
                        }`}
                        onClick={() => setSelectedThemeIndex(themeIndex)}
                    >
                        <div
                            className={`w-10 h-10 rounded-lg overflow-hidden transition-transform duration-300`}
                        >
                            <div className="w-full h-full grid grid-cols-2 grid-rows-2">
                                {(isDarkMode
                                    ? theme.darkColors
                                    : theme.colors
                                ).map((color, colorIndex) => (
                                    <div
                                        key={colorIndex}
                                        className="transition-colors duration-300"
                                        style={{
                                            backgroundColor: color,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
