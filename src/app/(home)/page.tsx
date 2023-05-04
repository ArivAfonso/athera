import React from 'react'
import SectionLargeSlider from '@/app/(home)/SectionLargeSlider'
import BackgroundSection from '@/components/BackgroundSection/BackgroundSection'
import SectionSliderNewAuthors from '@/components/SectionSliderNewAthors/SectionSliderNewAuthors'
import { DEMO_POSTS } from '@/data/posts'
import { DEMO_CATEGORIES } from '@/data/taxonomies'
import { DEMO_AUTHORS } from '@/data/authors'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories/SectionSliderNewCategories'
import SectionMagazine1 from '@/components/Sections/SectionMagazine1'

//
const MAGAZINE1_POSTS = DEMO_POSTS.filter((_, i) => i >= 8 && i < 16)

//

const PageHome = ({}) => {
    return (
        <div className="nc-PageHome relative overflow-x-hidden">
            <div className="container relative">
                <SectionLargeSlider
                    className="pt-10 pb-16 md:py-16 lg:pb-28 lg:pt-20"
                    posts={DEMO_POSTS?.filter((_, i) => i < 3)}
                />

                <div className="relative py-16">
                    <BackgroundSection />
                    <SectionSliderNewAuthors
                        heading="Newest authors test 2"
                        subHeading="Say hello to future creator potentials"
                        authors={DEMO_AUTHORS.filter((_, i) => i < 10)}
                    />
                </div>

                <SectionSliderNewCategories
                    className="py-16 lg:py-28"
                    heading="Top trending topics"
                    subHeading="Discover 233 topics"
                    categories={DEMO_CATEGORIES.filter((_, i) => i < 10)}
                    categoryCardType="card4"
                />

                <SectionMagazine1
                    className="py-16 lg:py-28"
                    posts={MAGAZINE1_POSTS}
                />
            </div>
        </div>
    )
}

export default PageHome
