import React, { useState } from 'react'
import { Combobox } from '@headlessui/react'
import {
    Nunito,
    EB_Garamond,
    Expletus_Sans,
    Dancing_Script,
    Caveat,
    Special_Elite,
    Bungee_Shade,
    Rye,
} from 'next/font/google'
import { Drawer } from 'ui'
import { ChevronsUpDownIcon } from 'lucide-react'

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700'] })
const ebGaramond = EB_Garamond({ subsets: ['latin'], weight: ['400', '700'] })
const expletusSans = Expletus_Sans({
    subsets: ['latin'],
    weight: ['400', '700'],
})
const dancingScript = Dancing_Script({
    subsets: ['latin'],
    weight: ['400', '700'],
})
const caveat = Caveat({ subsets: ['latin'], weight: ['400', '700'] })
const specialElite = Special_Elite({ subsets: ['latin'], weight: ['400'] })
const bungeeShade = Bungee_Shade({ subsets: ['latin'], weight: ['400'] })
const rye = Rye({ subsets: ['latin'], weight: ['400'] })

const fonts = [
    { name: 'Poppins', alias: 'Classic', className: '' },
    { name: 'Nunito', alias: 'Rounded', className: nunito.className },
    {
        name: 'EB Garamond',
        alias: 'Traditional',
        className: ebGaramond.className,
    },
    {
        name: 'Expletus Sans',
        alias: 'Modern',
        className: expletusSans.className,
    },
    {
        name: 'Dancing Script',
        alias: 'Cursive',
        className: dancingScript.className,
    },
    { name: 'Caveat', alias: 'Handwritten', className: caveat.className },
    {
        name: 'Special Elite',
        alias: 'Typewriter',
        className: specialElite.className,
    },
    { name: 'Bungee Shade', alias: 'Retro', className: bungeeShade.className },
    { name: 'Rye', alias: 'Wild West', className: rye.className },
]

interface FontSwitcherProps {
    label: string
    type: string
    defaultFont?: string
    onFontSelect?: (font: string, type: string) => void
}

export default function FontSwitcher({
    label,
    type,
    defaultFont = 'Classic',
    onFontSelect,
}: FontSwitcherProps) {
    const initialFont =
        fonts.find((font) => font.alias === defaultFont) || fonts[0]
    const [selectedFont, setSelectedFont] = useState(initialFont)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const handleFontSelect = async (font: (typeof fonts)[0]) => {
        setSelectedFont(font)
        if (onFontSelect) {
            onFontSelect(font.alias.toLowerCase(), type)
        }
        setIsDrawerOpen(false)
    }

    return (
        <>
            {/* Mobile View: Drawer */}
            <div className="sm:hidden">
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-gray-300"
                >
                    <div className="flex items-center">
                        <div
                            className={`w-8 h-8 flex items-center justify-center border-2 rounded-lg mr-2 ${selectedFont.className}`}
                        >
                            <span className="text-xl">Aa</span>
                        </div>
                        <span>{selectedFont.alias}</span>
                    </div>
                </button>

                <Drawer
                    isDrawerOpen={isDrawerOpen}
                    closeDrawer={() => setIsDrawerOpen(false)}
                    heading={label}
                >
                    <div className="grid grid-cols-2 gap-4 p-4">
                        {fonts.map((font, index) => (
                            <button
                                key={index}
                                className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                                    selectedFont.name === font.name
                                        ? 'border-blue-500'
                                        : 'border-gray-200 dark:border-gray-600'
                                }`}
                                onClick={() => handleFontSelect(font)}
                            >
                                <div
                                    className={`w-12 h-12 flex items-center justify-center ${font.className}`}
                                >
                                    <span className="text-2xl">Aa</span>
                                </div>
                                <span className="mt-2 text-sm">
                                    {font.alias}
                                </span>
                            </button>
                        ))}
                    </div>
                </Drawer>
            </div>

            {/* Desktop View: Combobox */}
            <div className="hidden sm:block">
                <Combobox value={selectedFont} onChange={handleFontSelect}>
                    <Combobox.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                    </Combobox.Label>
                    <div className="relative mt-1 w-full">
                        <Combobox.Button className="relative w-full border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
                            <span className="block truncate">
                                {selectedFont.alias}
                            </span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <ChevronsUpDownIcon
                                    strokeWidth={1.75}
                                    className="h-5 w-5 text-gray-400 dark:text-gray-500"
                                />
                            </span>
                        </Combobox.Button>
                        <Combobox.Options className="z-20 absolute mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {fonts.map((font, fontIndex) => (
                                <Combobox.Option
                                    key={fontIndex}
                                    value={font}
                                    className={({ active }) =>
                                        `cursor-default select-none relative py-2 pl-3 pr-9 ${
                                            active
                                                ? 'bg-neutral-100 dark:bg-indigo-500'
                                                : 'text-gray-900 dark:text-gray-300'
                                        }`
                                    }
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <div className="flex items-center">
                                                <div
                                                    className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg ${
                                                        selected
                                                            ? 'border-blue-500'
                                                            : 'border-gray-200 dark:border-gray-600'
                                                    } ${font.className}`}
                                                >
                                                    <span className="text-2xl">
                                                        Aa
                                                    </span>
                                                </div>
                                                <span
                                                    className={`ml-3 block truncate ${
                                                        selected
                                                            ? 'font-semibold'
                                                            : 'font-normal'
                                                    }`}
                                                >
                                                    {font.alias}
                                                </span>
                                            </div>
                                            {selected && (
                                                <span
                                                    className={`absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 dark:text-indigo-400`}
                                                >
                                                    <svg
                                                        className="h-5 w-5"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 00-1.414 0L7 13.586 4.707 11.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l9-9a1 1 0 000-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    </div>
                </Combobox>
            </div>
        </>
    )
}
