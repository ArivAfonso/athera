import React from 'react'
import { Transition } from '@headlessui/react'

interface ErrorMessageProps {
    message: string
    onClose: () => void
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
    return (
        <Transition
            show={!!message}
            enter="transform transition-transform opacity-0"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transform transition-transform opacity-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            {(ref) => (
                <div
                    // @ts-ignore
                    ref={ref}
                    className="fixed bottom-0 left-0 w-full bg-red-500 text-white p-2 text-center"
                >
                    {message}
                    <button
                        className="ml-2 text-sm font-medium hover:underline focus:outline-none"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            )}
        </Transition>
    )
}

export default ErrorMessage
