'use client'

import AccordionInfo from '@/components/AccordionInfo/AccordionInfo'
import MySwitch from '@/components/MySwitch/MySwitch'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { useEffect, useState } from 'react'

function Settings() {
    const [isParallaxTiltEnabled, setIsParallaxTiltEnabled] = useState(false)

    useEffect(() => {
        const storedParallaxTiltEnabled = getCookie('parallaxTiltEnabled')
        if (storedParallaxTiltEnabled !== null) {
            setIsParallaxTiltEnabled(storedParallaxTiltEnabled === 'true')
        }
    }, []) // Empty dependency array to run the effect only once on mount

    const handleParallaxTiltChange = (enabled: boolean) => {
        setIsParallaxTiltEnabled(enabled)
        // Update the value in localStorage if available
        if (enabled) setCookie('parallaxTiltEnabled', enabled)
        else deleteCookie('parallaxTiltEnabled')
    }

    const myData = [
        {
            name: 'User Interface',
            component: (
                <>
                    <MySwitch
                        enabled={isParallaxTiltEnabled}
                        label="Parallax Tilt Effect"
                        desc="All post cards will have a parallax tilt effect on hover"
                        onChange={handleParallaxTiltChange}
                    />
                </>
            ),
        },
    ]

    return (
        <>
            <title>Settings - Athera</title>
            <div className="max-w-4xl mx-auto sm:pt-26 pb-24 lg:pb-32">
                <div className="container">
                    <div className="my-8 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
                        {/* HEADING */}
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="text-3xl sm:text-4xl font-semibold">
                                Settings
                            </h2>
                            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                                You can customize the way Athera looks and
                                behaves here
                            </span>
                        </div>
                    </div>
                    <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
                        {/* ---- */}
                        <AccordionInfo data={myData} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings
