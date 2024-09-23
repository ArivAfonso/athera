'use client'
import React, { useState, useEffect } from 'react'

type AlertType = 'danger' | 'info' | 'success' | 'warning'

interface AlertProps {
    type: AlertType
    message: string
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
    const [showAlert, setShowAlert] = useState(true)

    // Function to close the alert
    const handleClose = () => {
        setShowAlert(false)
    }

    // Automatically dismiss the alert after 7 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAlert(false)
        }, 7000)

        return () => clearTimeout(timer)
    }, [])

    // Define different SVG icons based on the type
    const getIcon = () => {
        switch (type) {
            case 'danger':
                return (
                    <svg
                        className="flex-shrink-0 w-4 h-4 text-red-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 6l8 8M6 14L14 6"
                        />
                    </svg>
                )
            case 'info':
                return (
                    <svg
                        className="flex-shrink-0 w-4 h-4 text-blue-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 3v9a4 4 0 01-4 4H5a4 4 0 01-4-4V5a4 4 0 014-4h3a4 4 0 014 4z"
                        />
                    </svg>
                )
            case 'success':
                return (
                    <svg
                        className="flex-shrink-0 w-4 h-4 text-green-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                )
            case 'warning':
                return (
                    <svg
                        className="flex-shrink-0 w-4 h-4 text-yellow-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 9v6M6 5l12 12M6 5L18 5"
                        />
                    </svg>
                )
            default:
                return null
        }
    }
    if (!showAlert) return null

    return (
        <div
            id={`alert-${type}`}
            className={`flex items-center p-4 mb-4 rounded-lg ${getColorClass(
                type
            )}`}
            role="alert"
        >
            {getIcon()}
            <span className="sr-only">Info</span>
            <div className="ml-3 text-sm font-medium">{message}</div>
        </div>
    )
}

// Helper function to get color and close button style based on alert type
const getColorClass = (type: AlertType) => {
    switch (type) {
        case 'danger':
            return 'text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400'
        case 'info':
            return 'text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400'
        case 'success':
            return 'text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400'
        case 'warning':
            return 'text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300'
        default:
            return 'text-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-gray-300'
    }
}

export default Alert
