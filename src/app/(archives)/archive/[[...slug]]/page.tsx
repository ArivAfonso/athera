import React, { FC } from 'react'
import ModalCategories from '../../ModalCategories'
import ModalTags from '../../ModalTags'
import { DEMO_POSTS } from '@/data/posts'
import { PostDataType } from '@/data/types'
import { DEMO_CATEGORIES, DEMO_TAGS } from '@/data/taxonomies'
import { DEMO_AUTHORS } from '@/data/authors'
import Pagination from '@/components/Pagination/Pagination'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import ArchiveFilterListBox from '@/components/ArchiveFilterListBox/ArchiveFilterListBox'
import Newsletter from '@/components/Newsletter/Newsletter'
import Card11 from '@/components/Card11/Card11'
import BackgroundSection from '@/components/BackgroundSection/BackgroundSection'
import SectionGridCategoryBox from '@/components/SectionGridCategoryBox/SectionGridCategoryBox'
import ButtonSecondary from '@/components/Button/ButtonSecondary'
import SectionSliderNewAuthors from '@/components/SectionSliderNewAthors/SectionSliderNewAuthors'
import Image from 'next/image'

// Tag and category have same data type - we will use one demo data
const posts: PostDataType[] = DEMO_POSTS.filter((_, i) => i < 16)

const PageArchive = ({}) => {
    const FILTERS = [
        { name: 'Most Recent' },
        { name: 'Curated by Admin' },
        { name: 'Most Appreciated' },
        { name: 'Most Discussed' },
        { name: 'Most Viewed' },
    ]

    return (
        <div className={`nc-PageArchive`}>
            {/* HEADER */}
            <div className="w-full px-2 xl:max-w-screen-2xl mx-auto">
                <div className="relative aspect-w-16 aspect-h-13 sm:aspect-h-9 lg:aspect-h-8 xl:aspect-h-5 rounded-3xl md:rounded-[40px] overflow-hidden z-0">
                    <Image
                        alt="archive"
                        fill
                        src="https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                        className="object-cover w-full h-full rounded-3xl md:rounded-[40px]"
                        sizes="(max-width: 1280px) 100vw, 1536px"
                    />
                    <div className="absolute inset-0 bg-black text-white bg-opacity-30 flex flex-col items-center justify-center">
                        <h2 className="inline-block align-middle text-5xl font-semibold md:text-7xl ">
                            Garden
                        </h2>
                        <span className="block mt-4 text-neutral-300">
                            115 Articles
                        </span>
                    </div>
                </div>
            </div>
            {/* ====================== END HEADER ====================== */}

            <div className="container pt-10 pb-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
                <div>
                    <div className="flex flex-col sm:justify-between sm:flex-row">
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
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
                        {posts.map((post) => (
                            <Card11 key={post.id} post={post} />
                        ))}
                    </div>

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
                    <SectionGridCategoryBox
                        categories={DEMO_CATEGORIES.filter((_, i) => i < 10)}
                    />
                    <div className="text-center mx-auto mt-10 md:mt-16">
                        <ButtonSecondary loading>Show me more</ButtonSecondary>
                    </div>
                </div>

                {/* === SECTION 5 === */}
                <SectionSliderNewAuthors
                    heading="Top elite authors"
                    subHeading="Discover our elite writers"
                    authors={DEMO_AUTHORS.filter((_, i) => i < 10)}
                />

                {/* SUBCRIBES */}
                <Newsletter />
            </div>
        </div>
    )
}

export default PageArchive
