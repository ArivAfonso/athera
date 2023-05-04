import React from 'react'
import ModalCategories from '../../ModalCategories'
import ModalTags from '../../ModalTags'
import { DEMO_POSTS_AUDIO } from '@/data/posts'
import { PostDataType } from '@/data/types'
import { DEMO_CATEGORIES, DEMO_TAGS } from '@/data/taxonomies'
import { DEMO_AUTHORS } from '@/data/authors'
import Pagination from '@/components/Pagination/Pagination'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import ArchiveFilterListBox from '@/components/ArchiveFilterListBox/ArchiveFilterListBox'
import Newsletter from '@/components/Newsletter/Newsletter'
import NcImage from '@/components/NcImage/NcImage'
import BackgroundSection from '@/components/BackgroundSection/BackgroundSection'
import SectionSliderNewAuthors from '@/components/SectionSliderNewAthors/SectionSliderNewAuthors'
import Card16Podcast from '@/components/Card16Podcast/Card16Podcast'
import Card15Podcast from '@/components/Card15Podcast/Card15Podcast'

const PageArchiveAudio = ({}) => {
    const FILTERS = [
        { name: 'Most Recent' },
        { name: 'Curated by Admin' },
        { name: 'Most Appreciated' },
        { name: 'Most Discussed' },
        { name: 'Most Viewed' },
    ]

    const renderSection = (sectionPosts: PostDataType[]) => {
        const loopPosts = sectionPosts.filter((_, i) => i > 2)
        return (
            <div className="mt-8 lg:mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <Card16Podcast post={sectionPosts[0]} />
                <Card16Podcast post={sectionPosts[1]} />
                <Card16Podcast post={sectionPosts[2]} />
                <div className="md:col-span-2 lg:col-span-3">
                    <div
                        className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8`}
                    >
                        {loopPosts.map((p, i) => (
                            <Card15Podcast key={i} post={p} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`nc-PageArchiveAudio `}>
            {/* HEADER */}
            <div className="w-full px-2 xl:max-w-screen-2xl mx-auto">
                <div className="rounded-3xl relative aspect-w-16 aspect-h-12 sm:aspect-h-7 lg:aspect-h-6 xl:aspect-h-5 2xl:aspect-h-4 overflow-hidden z-0">
                    <NcImage
                        alt="archive"
                        fill
                        containerClassName="absolute inset-0"
                        src="https://images.pexels.com/photos/144429/pexels-photo-144429.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                        className="object-cover w-full h-full"
                        sizes="(max-width: 1280px) 100vw, 1536px"
                    />
                    <div className="absolute inset-0 bg-black text-white bg-opacity-30 flex flex-col items-center justify-center">
                        <h2 className="inline-block align-middle ml-3 text-5xl font-semibold md:text-7xl ">
                            Podcast
                        </h2>
                        <span className="block mt-4 text-neutral-300">
                            122 Podcast
                        </span>
                    </div>
                </div>
            </div>
            {/* ====================== END HEADER ====================== */}

            <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
                <div>
                    <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row">
                        <div className="flex space-x-2.5">
                            <ModalCategories categories={DEMO_CATEGORIES} />
                            <ModalTags tags={DEMO_TAGS} />
                        </div>
                        <div className="block my-4 border-b w-full border-neutral-300 dark:border-neutral-500 sm:hidden"></div>
                        <div className="flex justify-end">
                            <ArchiveFilterListBox lists={FILTERS} />
                        </div>
                    </div>

                    {/* LOOP ITEMS */}
                    {renderSection(DEMO_POSTS_AUDIO.filter((_, i) => i < 29))}

                    {/* PAGINATIONS */}
                    <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                        <Pagination />
                        <ButtonPrimary>Show me more</ButtonPrimary>
                    </div>
                </div>

                {/* MORE SECTIONS */}
                {/* === SECTION 5 === */}
                <div className="relative py-16">
                    <BackgroundSection />
                    <SectionSliderNewAuthors
                        heading="Top elite authors"
                        subHeading="Discover our elite writers"
                        authors={DEMO_AUTHORS.filter((_, i) => i < 10)}
                    />
                </div>

                {/* SUBCRIBES */}
                <Newsletter />
            </div>
        </div>
    )
}

export default PageArchiveAudio
