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

    return (
        showAlert && (
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
                <button
                    type="button"
                    className={`ml-auto -mx-1.5 -my-1.5 ${getCloseButtonStyle(
                        type
                    )}`}
                    data-dismiss-target={`#alert-${type}`}
                    aria-label="Close"
                    onClick={handleClose}
                >
                    <span className="sr-only">Close</span>
                    <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                    </svg>
                </button>
            </div>
        )
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

const getCloseButtonStyle = (type: AlertType) => {
    switch (type) {
        case 'danger':
            return 'bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200'
        case 'info':
            return 'bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200'
        case 'success':
            return 'bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200'
        case 'warning':
            return 'bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200'
        default:
            return 'bg-gray-50 text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-200 hover:text-gray-800'
    }
}

export default Alert
