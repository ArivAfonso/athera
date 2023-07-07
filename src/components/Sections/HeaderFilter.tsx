'use client'

import React, { FC, useState } from 'react'
import Heading from '@/components/Heading/Heading'

export interface HeaderFilterProps {
    tabs?: string[]
    heading: string
}

const HeaderFilter: FC<HeaderFilterProps> = ({
    heading = '🎈 Latest Articles',
}) => {
    return (
        <div className="flex flex-col mb-8 relative">
            <Heading>{heading}</Heading>
            <div className="flex justify-between"></div>
        </div>
    )
}

export default HeaderFilter
