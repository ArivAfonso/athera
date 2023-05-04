'use client'

import React, { FC, useState } from 'react'
import { DEMO_POSTS } from '@/data/posts'
import { PostDataType } from '@/data/types'
import { DEMO_AUTHORS } from '@/data/authors'
import { DEMO_CATEGORIES } from '@/data/taxonomies'
import Pagination from '@/components/Pagination/Pagination'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Nav from '@/components/Nav/Nav'
import NavItem from '@/components/NavItem/NavItem'
import ArchiveFilterListBox from '@/components/ArchiveFilterListBox/ArchiveFilterListBox'
import Input from '@/components/Input/Input'
import Newsletter from '@/components/Newsletter/Newsletter'
import SectionSliderNewAuthors from '@/components/SectionSliderNewAthors/SectionSliderNewAuthors'
import ButtonSecondary from '@/components/Button/ButtonSecondary'
import SectionGridCategoryBox from '@/components/SectionGridCategoryBox/SectionGridCategoryBox'
import BackgroundSection from '@/components/BackgroundSection/BackgroundSection'
import Card11 from '@/components/Card11/Card11'
import CardCategory2 from '@/components/CardCategory2/CardCategory2'
import Tag from '@/components/Tag/Tag'
import CardAuthorBox2 from '@/components/CardAuthorBox2/CardAuthorBox2'

const posts: PostDataType[] = DEMO_POSTS.filter((_, i) => i < 12)
const cats = DEMO_CATEGORIES.filter((_, i) => i < 15)
const tags = DEMO_CATEGORIES.filter((_, i) => i < 32)
const authors = DEMO_AUTHORS.filter((_, i) => i < 12)

const FILTERS = [
    { name: 'Most Recent' },
    { name: 'Curated by Admin' },
    { name: 'Most Appreciated' },
    { name: 'Most Discussed' },
    { name: 'Most Viewed' },
]
const TABS = ['Articles', 'Categories', 'Tags', 'Authors']

const PageSearchV2 = ({}) => {
    let s = 'Ui Design'

    const [tabActive, setTabActive] = useState<string>(TABS[0])

    const handleClickTab = (item: string) => {
        if (item === tabActive) {
            return
        }
        setTabActive(item)
    }

    return (
        <div className={`nc-PageSearchV2`}>
            <div
                className={`h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-100/50 dark:bg-neutral-900`}
            />
            <div className="container">
                <header className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7">
                    <form className="relative" action="" method="post">
                        <label
                            htmlFor="search-input"
                            className="text-neutral-500 dark:text-neutral-300"
                        >
                            <span className="sr-only">Search all icons</span>
                            <Input
                                id="search-input"
                                type="search"
                                placeholder="Type and press enter"
                                className="shadow-lg rounded-xl border-opacity-0"
                                sizeClass="pl-14 py-5 pr-5 md:pl-16"
                                defaultValue={s}
                            />
                            <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
                                <svg
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M19.25 19.25L15.5 15.5M4.75 11C4.75 7.54822 7.54822 4.75 11 4.75C14.4518 4.75 17.25 7.54822 17.25 11C17.25 14.4518 14.4518 17.25 11 17.25C7.54822 17.25 4.75 14.4518 4.75 11Z"
                                    ></path>
                                </svg>
                            </span>
                        </label>
                    </form>
                    <span className="block text-sm mt-4 text-neutral-500 dark:text-neutral-300">
                        We found{' '}
                        <strong className="font-semibold text-neutral-800 dark:text-neutral-100">
                            1135
                        </strong>{' '}
                        results articles for{' '}
                        <strong className="font-semibold text-neutral-800 dark:text-neutral-100">
                            {`"${s}"`}
                        </strong>
                    </span>
                </header>
            </div>
            <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
                <main>
                    {/* TABS FILTER */}
                    <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row ">
                        <Nav
                            containerClassName="w-full overflow-x-auto hiddenScrollbar"
                            className=" sm:space-x-2"
                        >
                            {TABS.map((item, index) => (
                                <NavItem
                                    key={index}
                                    isActive={tabActive === item}
                                    onClick={() => handleClickTab(item)}
                                >
                                    {item}
                                </NavItem>
                            ))}
                        </Nav>
                        <div className="block my-4 border-b w-full border-neutral-300 dark:border-neutral-500 sm:hidden"></div>
                        <div className="flex justify-end">
                            <ArchiveFilterListBox lists={FILTERS} />
                        </div>
                    </div>

                    {/* LOOP ITEMS */}
                    {/* LOOP ITEMS POSTS */}
                    {tabActive === 'Articles' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8 mt-8 lg:mt-10">
                            {posts.map((post) => (
                                <Card11 key={post.id} post={post} />
                            ))}
                        </div>
                    )}
                    {/* LOOP ITEMS CATEGORIES */}
                    {tabActive === 'Categories' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-8 mt-8 lg:mt-10">
                            {cats.map((cat) => (
                                <CardCategory2 key={cat.id} taxonomy={cat} />
                            ))}
                        </div>
                    )}
                    {/* LOOP ITEMS TAGS */}
                    {tabActive === 'Tags' && (
                        <div className="flex flex-wrap mt-12 ">
                            {tags.map((tag) => (
                                <Tag
                                    className="mb-3 mr-3"
                                    key={tag.id}
                                    tag={tag}
                                />
                            ))}
                        </div>
                    )}
                    {/* LOOP ITEMS POSTS */}
                    {tabActive === 'Authors' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-8 mt-8 lg:mt-10">
                            {authors.map((author) => (
                                <CardAuthorBox2
                                    key={author.id}
                                    author={author}
                                />
                            ))}
                        </div>
                    )}

                    {/* PAGINATION */}
                    <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                        <Pagination />
                        <ButtonPrimary>Show me more</ButtonPrimary>
                    </div>
                </main>

                {/* MORE SECTIONS */}
                {/* === SECTION 5 === */}
                <div className="relative py-16">
                    <BackgroundSection />
                    <SectionGridCategoryBox
                        categories={DEMO_CATEGORIES.filter((_, i) => i < 10)}
                    />
                    <div className="text-center mx-auto mt-10 md:mt-16">
                        <ButtonSecondary>Show me more</ButtonSecondary>
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

export default PageSearchV2
