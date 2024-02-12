'use client'

import { useThemeMode } from '@/hooks/useThemeMode'
import React, { useEffect, useState } from 'react'

const CustomScrollbar = () => {
    const { isDarkMode } = useThemeMode()
    return (
        <style>
            {`
            /* This styles the width of the scrollbar */
            ::-webkit-scrollbar {
                width: 20px;
            }

            /* This styles the appearance of the scrollbar thumb */
            ::-webkit-scrollbar-thumb {
                width: 20px;
                border-radius: 20px;
                background-color: ${
                    isDarkMode ? '#374151' : '#d1d5db'
                }; /* default background color */
                border: 6px solid transparent;
                background-clip: content-box;
            }

            /* This styles the appearance of the scrollbar thumb when hovered */
            ::-webkit-scrollbar-thumb:hover {
                background-color: ${isDarkMode ? '#475569' : '#a8bbbf'};
            }

            /* This styles the background of the scrollbar track */
            ::-webkit-scrollbar-track {
                background-color: transparent; /* Set scrollbar track to transparent */
            }

            /* This styles the container to overlay the scrollbar track */
            .custom-scrollbar-container {
                position: relative;
                z-index: 1;
            }

            /* This styles the pseudo element to create an overlay for scrollbar track */
            .custom-scrollbar-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${
                    isDarkMode ? '#374151' : '#d1d5db'
                }; /* Set to match the children's background color */
                z-index: -1;
            }
            `}
        </style>
    )
}

export default CustomScrollbar
