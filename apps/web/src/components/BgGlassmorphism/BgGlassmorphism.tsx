import React, { FC } from 'react'

export interface BgGlassmorphismProps {
    className?: string
}

const BgGlassmorphism: FC<BgGlassmorphismProps> = ({
    className = 'absolute inset-0 top-0 min-h-0 pl-10 py-32 flex flex-col overflow-hidden z-0',
}) => {
    return (
        <div
            className={`BgGlassmorphism ${className}`}
            data-nc-id="BgGlassmorphism"
        >
            <span className="bg-[#0077b6] w-1/2 h-1/2 mx-auto rounded-full mix-blend-multiply filter blur-3xl opacity-20 lg:w-1/2 lg:h-1/2" />
            <span className="bg-[#023e8a] w-1/2 h-1/2 mx-auto -mt-10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 lg:w-1/2 lg:h-1/2 nc-animation-delay-2000" />
        </div>
    )
}

export default BgGlassmorphism
