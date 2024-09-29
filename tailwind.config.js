/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

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
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
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
                'athera-blue': '#2f26d4',
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
    variants: {
        extend: {
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            },
            'custom-rte-styles': {
                margin: '0 auto',
                '& .e-code-mirror::before': {
                    content: '\\e345',
                },
                '& .e-html-preview::before': {
                    content: '\\e350',
                },
                '& .sb-header': {
                    zIndex: '100 !important',
                },
                '& .e-richtexteditor .e-rte-content .e-content': {
                    float: 'left',
                    width: '100%',
                },
                '& .content-wrapper': {
                    width: 'auto',
                    margin: '0',
                },
                '& .fabric-dark #rteTools .cm-s-default .cm-tag, & .bootstrap5-dark #rteTools .cm-s-default .cm-tag, & .material-dark #rteTools .cm-s-default .cm-tag, & .tailwind-dark #rteTools .cm-s-default .cm-tag, & .highcontrast #rteTools .cm-s-default .cm-tag':
                    {
                        color: '#00ff00',
                    },
                '& .fabric-dark #rteTools .cm-s-default .cm-string, & .bootstrap5-dark #rteTools .cm-s-default .cm-string, & .material-dark #rteTools .cm-s-default .cm-string, & .tailwind-dark #rteTools .cm-s-default .cm-string':
                    {
                        color: 'blue',
                    },
                '& .highcontrast #rteTools .cm-s-default .cm-string': {
                    color: '#ffd939',
                },
                '& .fabric-dark #rteTools .cm-s-default .cm-attribute, & .bootstrap5-dark #rteTools .cm-s-default .cm-attribute, & .material-dark #rteTools .cm-s-default .cm-attribute, & .tailwind-dark #rteTools .cm-s-default .cm-attribute, & .highcontrast #rteTools .cm-s-default .cm-attribute':
                    {
                        color: '#f00',
                    },
                '& .fabric-dark #rteTools .CodeMirror, & .bootstrap5-dark #rteTools .CodeMirror, & .material-dark #rteTools .CodeMirror, & .tailwind-dark #rteTools .CodeMirror':
                    {
                        background: '#303030',
                    },
                '& .highcontrast #rteTools .CodeMirror': {
                    background: 'black',
                },
                '& .sb-content.e-view.hide-header': {
                    top: '0 !important',
                },
                '& .sb-header.e-view.hide-header': {
                    display: 'none',
                },
                '& .e-richtexteditor .e-rte-content .e-content pre': {
                    padding: '10px',
                    background: '#f4f5f7',
                },
                '& .fabric-dark .e-richtexteditor .e-rte-content .e-content pre, & .bootstrap5-dark .e-richtexteditor .e-rte-content .e-content pre, & .material-dark .e-richtexteditor .e-rte-content .e-content pre, & .tailwind-dark .e-richtexteditor .e-rte-content .e-content pre, & .highcontrast .e-richtexteditor .e-rte-content .e-content pre':
                    {
                        padding: '10px',
                        background: '#303030',
                    },
            },
            'custom-rte-styles-dark': [
                // Add your dark mode styles here
                {
                    // #rteTools .rte-control-section
                    '.control-pane .control-section .rte-control-section': {
                        margin: '0 auto',
                    },
                },
                {
                    // #rteTools .e-code-mirror::before
                    '.control-pane .control-section .e-code-mirror::before': {
                        content: '\\e345',
                    },
                },
                {
                    // #rteTools .e-html-preview::before
                    '.control-pane .control-section .e-html-preview::before': {
                        content: '\\e350',
                    },
                },
                {
                    // .CodeMirror-linenumber, .CodeMirror-gutters
                    '.control-pane .control-section .CodeMirror-linenumber, .control-pane .control-section .CodeMirror-gutters':
                        {
                            display: 'none',
                        },
                },
                {
                    // .sb-header
                    '.sb-header': {
                        'z-index': '100 !important',
                    },
                },
                {
                    // #rteTools .e-richtexteditor .e-rte-content .e-content
                    '.control-pane .control-section .e-richtexteditor .e-rte-content .e-content':
                        {
                            float: 'left',
                            width: '100%',
                        },
                },
                {
                    // #rteTools .content-wrapper
                    '.control-pane .control-section .content-wrapper': {
                        width: 'auto',
                        margin: '0',
                    },
                },
                {
                    // .fabric-dark #rteTools .cm-s-default .cm-tag, .bootstrap5-dark #rteTools .cm-s-default .cm-tag, .material-dark #rteTools .cm-s-default .cm-tag, .tailwind-dark #rteTools .cm-s-default .cm-tag, .highcontrast #rteTools .cm-s-default .cm-tag
                    '.tailwind-dark .control-pane .control-section .cm-s-default .cm-tag, .highcontrast .control-pane .control-section .cm-s-default .cm-tag':
                        {
                            color: '#00ff00',
                        },
                },
                {
                    // .fabric-dark #rteTools .cm-s-default .cm-string, .bootstrap5-dark #rteTools .cm-s-default .cm-string, .material-dark #rteTools .cm-s-default .cm-string, .tailwind-dark #rteTools .cm-s-default .cm-string
                    '.fabric-dark .control-pane .control-section .cm-s-default .cm-string, .bootstrap5-dark .control-pane .control-section .cm-s-default .cm-string, .material-dark .control-pane .control-section .cm-s-default .cm-string, .tailwind-dark .control-pane .control-section .cm-s-default .cm-string':
                        {
                            color: 'blue',
                        },
                },
                {
                    // .highcontrast #rteTools .cm-s-default .cm-string
                    '.highcontrast .control-pane .control-section .cm-s-default .cm-string':
                        {
                            color: '#ffd939',
                        },
                },
                {
                    // .fabric-dark #rteTools .cm-s-default .cm-attribute, .bootstrap5-dark #rteTools .cm-s-default .cm-attribute, .material-dark #rteTools .cm-s-default .cm-attribute, .tailwind-dark #rteTools .cm-s-default .cm-attribute, .highcontrast #rteTools .cm-s-default .cm-attribute
                    '.tailwind-dark .control-pane .control-section .cm-s-default .cm-attribute, .highcontrast .control-pane .control-section .cm-s-default .cm-attribute':
                        {
                            color: '#f00',
                        },
                },
                {
                    // .sb-content.e-view.hide-header
                    '.sb-content.e-view.hide-header': {
                        top: '0 !important',
                    },
                },
                {
                    // .sb-header.e-view.hide-header
                    '.sb-header.e-view.hide-header': {
                        display: 'none',
                    },
                },
                {
                    // .e-richtexteditor .e-rte-content .e-content pre
                    '.control-pane .control-section .e-richtexteditor .e-rte-content .e-content pre':
                        {
                            padding: '10px',
                            padding_top: '70px',
                            background: '#F4F5F7',
                        },
                },
                {
                    // .fabric-dark .e-richtexteditor .e-rte-content .e-content pre, .bootstrap5-dark .e-richtexteditor .e-rte-content .e-content pre, .material-dark .e-richtexteditor .e-rte-content .e-content pre, .tailwind-dark .e-richtexteditor .e-rte-content .e-content pre, .highcontrast .e-richtexteditor .e-rte-content .e-content pre
                    '.tailwind-dark .control-pane .control-section .e-richtexteditor .e-rte-content .e-content pre, .highcontrast .control-pane .control-section .e-richtexteditor .e-rte-content .e-content pre':
                        {
                            padding: '10px',
                            background: '#303030',
                            color: '#FFFFFF',
                        },
                },
            ],
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/aspect-ratio'),
    ],
}
