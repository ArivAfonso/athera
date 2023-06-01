'use client'

import React, { FC, useState, useEffect } from 'react'
import Nav from '@/components/Nav/Nav'
import NavItem from '@/components/NavItem/NavItem'
import ArchiveFilterListBox from '@/components/ArchiveFilterListBox/ArchiveFilterListBox'
import Input from '@/components/Input/Input'
import Card11 from '@/components/Card11/Card11'
import CardCategory2 from '@/components/CardCategory2/CardCategory2'
import CardAuthorBox2 from '@/components/CardAuthorBox2/CardAuthorBox2'
import { sanityClient } from '@/lib/sanityClient'
import { useRouter } from 'next/navigation';
import groq from 'groq'
import { set } from 'lodash'

async function getData(context: { params: { slug: any } }) {
    const slug = context.params.slug[0]
    const query = groq`{
  "authors": *[_type == "author" && name match $slug]{
    name,
    username,
    slug,
    image,
    "postCount": count(*[_type == "post" && references(^._id)])
  },
  "categories": *[_type == "category" && title match $slug]{
    title,
    image,
    slug,
    "postCount": count(*[_type == "post" && references(^._id)])
  },
  "posts": *[_type == "post" && title match $slug]{
    title,
    "author": author->{
      name,
      slug,
      image
    },
    publishedAt,
    slug,
    mainImage,
    categories[]->{title, slug, color}
  }
}
      `
    const results = await sanityClient.fetch(query, { slug })
    return results
}

interface AuthorType {
    name: string,
    username: string,
    slug: {
        current: string,
        _type: string
    }
    image: {
        asset: {
            _ref: string,
            _type: string
        },
        _type: string
    }
    postCount: number
}

interface CategoryType {
    title: string,
    image: {
        asset: {
            _ref: string,
            _type: string
        },
        _type: string
    },
    postCount: number
}

interface PostType {
    title: string,
    author: {
        name: string,
        slug: {
            current: string,
            _type: string
        },
        image: {
            asset: {
                _ref: string,
                _type: string
            },
            _type: string
        }
    },
    publishedAt: string,
    slug: {
        current: string,
        _type: string
    },
    mainImage: {
        asset: {
            _ref: string,
            _type: string
        },
        _type: string
    },
    categories: {
        title: string,
        slug: {
            current: string,
            _type: string
        },
        color: string
    }[]
}

interface SearchType {
    authors: AuthorType[],
    categories: CategoryType[],
    posts: PostType[]
}

const FILTERS = [
    { name: 'Most Recent' },
    { name: 'Curated by Admin' },
    { name: 'Most Appreciated' },
    { name: 'Most Discussed' },
    { name: 'Most Viewed' },
]
const TABS = ['Articles', 'Categories', 'Authors']

const PageSearchV2 = (context: any) => {
    const [data, setData] = useState<SearchType>({
        authors: [],
        categories: [],
        posts: [],
    })
    const router = useRouter();

    let s = context.params.slug[0]

    useEffect( () => { 
        async function fetchData() {
            try {
                const res:SearchType = await getData(context);
                setData(res);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    const [tabActive, setTabActive] = useState<string>(TABS[0])

    const handleClickTab = (item: string) => {
        if (item === tabActive) {
            return
        }
        setTabActive(item)
    }

    const [searchValue, setSearchValue] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.push(`/search/${searchValue}`);
      };

    return (
        <div className={`nc-PageSearchV2`}>
            <div
                className={`h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-100/50 dark:bg-neutral-900`}
            />
            <div className="container">
                <header className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7">
                    <form className="relative" action="" method="post" onSubmit={handleSubmit}>
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
                                onChange={(e) => setSearchValue(e.target.value)}
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
                            {data.posts.map((post, id) => (
                                <Card11 key={id} post={post} />
                            ))}
                        </div>
                    )}
                    {/* LOOP ITEMS CATEGORIES */}
                    {tabActive === 'Categories' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-8 mt-8 lg:mt-10">
                            {data.categories.map((cat, id) => (
                                <CardCategory2 key={id} category={cat} />
                            ))}
                        </div>
                    )}
                    {/* LOOP ITEMS POSTS */}
                    {tabActive === 'Authors' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-8 mt-8 lg:mt-10">
                            {data.authors.map((author, id) => (
                                <CardAuthorBox2
                                    key={id}
                                    author={author}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default PageSearchV2
