import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Logo: React.FC = ({}) => {
    return (
        <Link
            href="/"
            className="ttnc-logo inline-block text-primary-6000 flex-shrink-0"
        >
            <Image
                src="/full-logo-transparent.png"
                alt="Logo"
                priority
                width={220}
                height={220}
                style={{
                    height: 'auto',
                }}
            />
        </Link>
    )
}

export default Logo
