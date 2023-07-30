import React from 'react'
import logoImg from '@/images/logo.png'
import logoLightImg from '@/images/logo-light.png'
import Link from 'next/link'
import Image from 'next/image'

export interface LogoProps {
    img?: string
    imgLight?: string
}

const Logo: React.FC<LogoProps> = ({
    img = logoImg,
    imgLight = logoLightImg,
}) => {
    return (
        <Link
            href="/"
            className="ttnc-logo inline-block text-primary-6000 flex-shrink-0"
        >
            <Image
                src="/full-logo-transparent.png"
                alt="Logo"
                width={220}
                height={220}
            />
        </Link>
    )
}

export default Logo
