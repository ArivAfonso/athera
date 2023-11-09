import React from 'react'
import SectionHero from '@/components/SectionHero/SectionHero'
import rightImg from '@/images/about-hero-right.png'
import SectionFounder from './SectionFounder'
import SectionStatistic from './SectionStatistic'
import Newsletter from '@/components/Newsletter/Newsletter'
import BgGlassmorphism from '@/components/BgGlassmorphism/BgGlassmorphism'
import BackgroundSection from '@/components/BackgroundSection/BackgroundSection'

export const runtime = 'edge'

const PageAbout = ({}) => {
    return (
        <div className={`nc-PageAbout relative`}>
            {/* ======== BG GLASS ======== */}
            <BgGlassmorphism />

            <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
                <SectionHero
                    rightImg={rightImg}
                    heading="👋 About Us."
                    btnText=""
                    subHeading="We’re impartial and independent, and every day we create distinctive, world-class programmes and content which inform, educate and entertain millions of people in the around the world."
                />

                <SectionFounder />

                <div className="relative py-16">
                    <BackgroundSection />
                    <SectionStatistic />
                </div>

                <Newsletter />
            </div>
        </div>
    )
}

export default PageAbout
