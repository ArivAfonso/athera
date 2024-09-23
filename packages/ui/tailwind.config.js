/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')
const svgToDataUri = require('mini-svg-data-uri')
const {
    default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette')

// Custom color with css variable color in __theme_color.scss
function customColors(cssVar) {
    return ({ opacityVariable, opacityValue }) => {
        if (opacityValue !== undefined) {
            return `rgba(var(${cssVar}), ${opacityValue})`
        }
        if (opacityVariable !== undefined) {
            return `rgba(var(${cssVar}), var(${opacityVariable}, 1))`
        }
        return `rgb(var(${cssVar}))`
    }
}

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', '../apps/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class', // or 'media' or 'class',
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                '2xl': '128px',
            },
        },

        extend: {
            colors: {
                primary: {
                    50: customColors('--c-primary-50'),
                    100: customColors('--c-primary-100'),
                    200: customColors('--c-primary-200'),
                    300: customColors('--c-primary-300'),
                    400: customColors('--c-primary-400'),
                    500: customColors('--c-primary-500'),
                    6000: customColors('--c-primary-600'),
                    700: customColors('--c-primary-700'),
                    800: customColors('--c-primary-800'),
                    900: customColors('--c-primary-900'),
                },
                secondary: {
                    50: customColors('--c-secondary-50'),
                    100: customColors('--c-secondary-100'),
                    200: customColors('--c-secondary-200'),
                    300: customColors('--c-secondary-300'),
                    400: customColors('--c-secondary-400'),
                    500: customColors('--c-secondary-500'),
                    6000: customColors('--c-secondary-600'),
                    700: customColors('--c-secondary-700'),
                    800: customColors('--c-secondary-800'),
                    900: customColors('--c-secondary-900'),
                },
                neutral: {
                    50: customColors('--c-neutral-50'),
                    100: customColors('--c-neutral-100'),
                    200: customColors('--c-neutral-200'),
                    300: customColors('--c-neutral-300'),
                    400: customColors('--c-neutral-400'),
                    500: customColors('--c-neutral-500'),
                    6000: customColors('--c-neutral-600'),
                    700: customColors('--c-neutral-700'),
                    800: customColors('--c-neutral-800'),
                    900: customColors('--c-neutral-900'),
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/aspect-ratio'),
        addVariablesForColors,
        function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    'bg-dot-thick': (value) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`
                        )}")`,
                    }),
                },
                {
                    values: flattenColorPalette(theme('backgroundColor')),
                    type: 'color',
                }
            )
        },
    ],
}

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
    let allColors = flattenColorPalette(theme('colors'))
    let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    )

    addBase({
        ':root': newVars,
    })
}
