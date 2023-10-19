import Image from 'next/image'
import React from 'react'

type NoResultsFoundProps = {
    message: string
}

const NoResultsFound: React.FC<NoResultsFoundProps> = ({ message }) => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="mb-4">
                    <Image
                        src="/not-found.png"
                        alt="Not Found"
                        width={400}
                        height={400}
                    />
                </div>
                <p className="text-xl text-blue-500">{message}</p>
            </div>
        </div>
    )
}

export default NoResultsFound
