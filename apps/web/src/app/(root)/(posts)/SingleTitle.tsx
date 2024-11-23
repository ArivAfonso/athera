import React, { FC } from 'react'
import {
    Nunito,
    EB_Garamond,
    Expletus_Sans,
    Dancing_Script,
    Caveat,
    Special_Elite,
    Bungee_Shade,
    Rye,
    Poppins,
} from 'next/font/google'

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700'] })
const ebGaramond = EB_Garamond({ subsets: ['latin'], weight: ['400', '700'] })
const expletusSans = Expletus_Sans({
    subsets: ['latin'],
    weight: ['400', '700'],
})
const dancingScript = Dancing_Script({
    subsets: ['latin'],
    weight: ['400', '700'],
})
const caveat = Caveat({ subsets: ['latin'], weight: ['400', '700'] })
const specialElite = Special_Elite({ subsets: ['latin'], weight: ['400'] })
const bungeeShade = Bungee_Shade({ subsets: ['latin'], weight: ['400'] })
const rye = Rye({ subsets: ['latin'], weight: ['400'] })

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: ['300', '400', '500', '600', '700'],
})

export interface SingleTitleProps {
    title: string
    className?: string
    font: string
}

const SingleTitle: FC<SingleTitleProps> = ({ className = '', title, font }) => {
    let myFont

    switch (font) {
        case 'rounded':
            myFont = nunito
            break
        case 'traditional':
            myFont = ebGaramond
            break
        case 'modern':
            myFont = expletusSans
            break
        case 'cursive':
            myFont = dancingScript
            break
        case 'handwritten':
            myFont = caveat
            break
        case 'typewriter':
            myFont = specialElite
            break
        case 'retro':
            myFont = bungeeShade
            break
        case 'wild west':
            myFont = rye
            break
        case 'classic':
        default:
            myFont = poppins
    }

    return (
        <h1
            className={`${className} text-neutral-900 font-semibold text-3xl md:text-4xl md:!leading-[120%] lg:text-5xl dark:text-neutral-100 ${myFont.className} max-w-4xl`}
            title={title}
        >
            {title}
        </h1>
    )
}

export default SingleTitle
