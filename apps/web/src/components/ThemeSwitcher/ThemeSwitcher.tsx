import { useThemeMode } from '@/hooks/useThemeMode'
import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

const colorThemes = [
    {
        name: 'Classic',
        colors: [
            '#EEF2FF',
            '#E0E7FF',
            '#C7D2FE',
            '#A5B4FC',
            '#818CF8',
            '#6366F1',
            '#4F46E5',
            '#4338CA',
            '#3730A3',
            '#312E81',
        ],
        darkColors: ['#312E81', '#3730A3', '#4338CA', '#4F46E5'],
    },
    {
        name: 'Turquoise',
        colors: [
            '#ECFEFF',
            '#CFFAFE',
            '#A5F3FC',
            '#67E8F9',
            '#22D3EE',
            '#06B6D4',
            '#0891B2',
            '#0E7490',
            '#155E75',
            '#164E63',
        ],
        darkColors: ['#164E63', '#155E75', '#0E7490', '#0891B2'],
    },
    {
        name: 'Sapphire',
        colors: [
            '#EFF6FF',
            '#DBEAFE',
            '#BFDBFE',
            '#93C5FD',
            '#60A5FA',
            '#3B82F6',
            '#2563EB',
            '#1D4ED8',
            '#1E40AF',
            '#1E3A8A',
        ],
        darkColors: ['#1E3A8A', '#1E40AF', '#1D4ED8', '#2563EB'],
    },
    {
        name: 'Violet',
        colors: [
            '#FAF5FF',
            '#F3E8FF',
            '#E9D5FF',
            '#D8B4FE',
            '#C084FC',
            '#A855F7',
            '#9333EA',
            '#7E22CE',
            '#6B21A8',
            '#581C87',
        ],
        darkColors: ['#581C87', '#6B21A8', '#7E22CE', '#9333EA'],
    },
    {
        name: 'Teal',
        colors: [
            '#F0FDF4',
            '#CCFBF1',
            '#99F6E4',
            '#5EEAD4',
            '#2DD4BF',
            '#14B8A6',
            '#0D9488',
            '#0F766E',
            '#115E59',
            '#134E4A',
        ],
        darkColors: ['#134E4A', '#115E59', '#0F766E', '#0D9488'],
    },
    {
        name: 'Carbon',
        colors: [
            '#F8FAFC',
            '#F1F5F9',
            '#E2E8F0',
            '#CBD5E1',
            '#94A3B8',
            '#64748B',
            '#475569',
            '#334155',
            '#1E293B',
            '#0F172A',
        ],
        darkColors: ['#0F172A', '#1E293B', '#334155', '#475569'],
    },
    {
        name: 'Crimson',
        colors: [
            '#FEF2F2',
            '#FEE2E2',
            '#FECACA',
            '#FCA5A5',
            '#F87171',
            '#EF4444',
            '#DC2626',
            '#B91C1C',
            '#991B1B',
            '#7F1D1D',
        ],
        darkColors: ['#7F1D1D', '#991B1B', '#B91C1C', '#DC2626'],
    },
    {
        name: 'Blush',
        colors: [
            '#FDF2F8',
            '#FCE7F3',
            '#FBCFE8',
            '#F9A8D4',
            '#F472B6',
            '#EC4899',
            '#DB2777',
            '#BE185D',
            '#9D174D',
            '#831843',
        ],
        darkColors: ['#831843', '#9D174D', '#BE185D', '#DB2777'],
    },
    {
        name: 'Jade',
        colors: [
            '#F0FDF4',
            '#DCFCE7',
            '#BBF7D0',
            '#86EFAC',
            '#4ADE80',
            '#22C55E',
            '#16A34A',
            '#15803D',
            '#166534',
            '#14532D',
        ],
        darkColors: ['#14532D', '#166534', '#15803D', '#16A34A'],
    },
    {
        name: 'Topaz',
        colors: [
            '#FEFCE8',
            '#FEF9C3',
            '#FEF08A',
            '#FDE047',
            '#FACC15',
            '#EAB308',
            '#CA8A04',
            '#A16207',
            '#854D0E',
            '#713F12',
        ],
        darkColors: ['#713F12', '#854D0E', '#A16207', '#CA8A04'],
    },
    {
        name: 'Saffron',
        colors: [
            '#FFF7ED',
            '#FFEDD5',
            '#FED7AA',
            '#FDBA74',
            '#FB923C',
            '#F97316',
            '#EA580C',
            '#C2410C',
            '#9A3412',
            '#7C2D12',
        ],
        darkColors: ['#7C2D12', '#9A3412', '#C2410C', '#EA580C'],
    },
    {
        name: 'Fuchsia',
        colors: [
            '#FDF4FF',
            '#FAE8FF',
            '#F5D0FE',
            '#F0ABFC',
            '#E879F9',
            '#D946EF',
            '#C026D3',
            '#A21CAF',
            '#86198F',
            '#701A75',
        ],
        darkColors: ['#701A75', '#86198F', '#A21CAF', '#C026D3'],
    },
]

function hexToRgb(hex: string) {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return [r, g, b]
}

function averageColor(colors: string[]) {
    const rgbColors = colors.map(hexToRgb)
    const avgRgb = rgbColors
        .reduce(
            (acc, [r, g, b]) => {
                acc[0] += r
                acc[1] += g
                acc[2] += b
                return acc
            },
            [0, 0, 0]
        )
        .map((sum) => Math.round(sum / colors.length))
    return `rgb(${avgRgb.join(',')})`
}

interface ThemeSwitcherProps {
    onFontUpdate?: (font: string) => void
    defaultTheme?: string
}

export default function ThemeSwitcher({
    onFontUpdate,
    defaultTheme,
}: ThemeSwitcherProps) {
    const initialThemeIndex = colorThemes.findIndex(
        (theme) => theme.name === defaultTheme
    )
    const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(
        initialThemeIndex !== -1 ? initialThemeIndex : null
    )
    const { isDarkMode } = useThemeMode()

    const handleThemeSelect = async (themeIndex: number) => {
        setSelectedThemeIndex(themeIndex)
        const selectedTheme = colorThemes[themeIndex].name
        if (onFontUpdate) {
            onFontUpdate(selectedTheme)
        }
    }

    return (
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-none sm:flex sm:space-x-4">
            {colorThemes.map((theme, themeIndex) => {
                const selectedColors = isDarkMode
                    ? theme.darkColors
                    : theme.colors
                const borderColor =
                    selectedThemeIndex === themeIndex
                        ? averageColor(selectedColors)
                        : 'transparent'

                return (
                    <div
                        key={themeIndex}
                        className={`flex flex-col items-center cursor-pointer transition-transform duration-300 ${
                            selectedThemeIndex === themeIndex
                                ? `p-0.5 border-2 rounded-xl transform rotate-45`
                                : 'transform rotate-0'
                        }`}
                        style={{ borderColor }}
                        onClick={() => handleThemeSelect(themeIndex)}
                        title={theme.name}
                    >
                        <div
                            className={`w-10 h-10 rounded-lg overflow-hidden transition-transform duration-300`}
                        >
                            <div className="w-full h-full grid grid-cols-2 grid-rows-2">
                                {selectedColors.map((color, colorIndex) => (
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
