'use client'

import React, { FC, useState, useEffect, Suspense } from 'react'
import Nav from '@/components/Nav/Nav'
import NavItem from '@/components/NavItem/NavItem'
import TopicFilterListBox from '@/components/TopicFilterListBox/TopicFilterListBox'
import Input from '@/components/Input/Input'
import Card11 from '@/components/Card11/Card11'
import CardTopic2 from '@/components/CardTopic2/CardTopic2'
import { useRouter } from 'next/navigation'
import PostType from '@/types/PostType'
import TopicType from '@/types/TopicType'
import AuthorType from '@/types/AuthorType'
import { createClient } from '@/utils/supabase/client'
import { pipeline } from '@xenova/transformers'
import CardAuthorBox from '@/components/CardAuthorBox/CardAuthorBox'
import Card6 from '@/components/Card6/Card6'
import Empty from '@/components/Empty'
import Card11Skeleton from '@/components/Card11/Card11Skeleton'
import PostsSection from '@/components/PostsSection/PostsSection'

async function getData(
    context: { params: { slug: any } },
    filter_option: string
) {
    const slug = context.params.slug[0]
    const supabase = createClient()

    const pipe = await pipeline('feature-extraction', 'Supabase/gte-small')

    // Generate the embedding from text
    const output = await pipe(slug, {
        pooling: 'mean',
        normalize: true,
    })

    // Extract the embedding output
    const embedding = Array.from(output.data)

    console.log(embedding)

    const { data, error } = await supabase
        .rpc('match_posts', {
            query_embedding: embedding,
            match_threshold: 0.85,
            match_count: 10,
            filter_option: filter_option,
        })
        .range(0, 10)
    data.map((post: any) => {
        post.likeCount = post.likecount
        post.commentCount = post.commentcount
    })
    console.log(data, error)
    return data
}

async function fetchTopicsData(context: { params: { slug: any } }) {
    const slug = context.params.slug[0]
    const supabase = createClient()

    const { data, error } = await supabase
        .from('topics')
        .select(`id, name, color, postCount:post_topics(count)`)
        .textSearch('name', `${slug}`)

    return data
}

async function fetchAuthorsData(context: { params: { slug: any } }) {
    const slug = context.params.slug[0]
    const supabase = createClient()

    const { data, error } = await supabase
        .from('users')
        .select(`*`)
        .textSearch('name', `${slug}`)

    return data
}

const FILTERS = [
    { name: 'Most Relevant' },
    { name: 'Most Commented' },
    { name: 'Most Recent' },
    { name: 'Most Liked' },
]
const TABS = ['Articles', 'Topics', 'Authors']

const PageSearchV2 = (context: any) => {
    const [data, setData] = useState<PostType[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    let s = ''

    if (!context.params.slug) {
        s = ''
    } else {
        s = context.params.slug[0]
        s = decodeURIComponent(s)
    }

    useEffect(() => {
        async function fetchData() {
            try {
                if (s === '') return
                const res: PostType[] = await getData(context, 'most_relevant')
                setData(res)
                setLoading(false)
            } catch (err) {
                setLoading(false)
            }
            document.title = `Search for "${context.params.slug[0]}" - Athera`
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [tabActive, setTabActive] = useState<string>(TABS[0])

    const [topics, setTopics] = useState<TopicType[]>([])

    const getTopicsData = async () => {
        try {
            // Implement the logic to fetch topics data based on the search term
            //@ts-ignore
            const topicsData: TopicType[] = await fetchTopicsData(context) // Implement the function to fetch topics
            setTopics(topicsData)
        } catch (error) {
            console.error('Failed to fetch topics:', error)
        }
    }

    const [authors, setAuthors] = useState<AuthorType[]>([])

    const getAuthorsData = async () => {
        try {
            // Implement the logic to fetch authors data based on the search value
            //@ts-ignore
            const authorsData: AuthorType[] = await fetchAuthorsData(context) // Implement the function to fetch authors
            setAuthors(authorsData)
        } catch (error) {
            console.error('Failed to fetch authors:', error)
        }
    }

    const handleClickTab = (item: string) => {
        if (item === tabActive) {
            return
        }
        setTabActive(item)

        // Lazy load topics data when the 'Topics' tab is clicked
        if (item === 'Topics' && topics.length === 0) {
            getTopicsData()
        } else if (item === 'Authors' && authors.length === 0) {
            getAuthorsData()
        }
    }

    const handleFilterClick = async (filterOption: string) => {
        try {
            const res: PostType[] = await getData(
                context,
                filterOption.replaceAll(' ', '_').toLowerCase()
            )
            setData(res)
        } catch (err) {
            console.log(err)
        }
    }

    const [searchValue, setSearchValue] = useState('')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (searchValue === '') return
        else if (searchValue === s) return
        router.push(`/search/${searchValue}`)
    }

    return (
        <div>
            <title>Search results for {s}</title>
            <div
                className={`h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-100/50 dark:bg-neutral-900`}
            />
            <div className="container">
                <header className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7">
                    <form
                        className="relative"
                        action=""
                        method="post"
                        onSubmit={handleSubmit}
                    >
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
                    {searchValue !== '' && (
                        <span className="block text-lg mt-4 text-neutral-500 dark:text-neutral-300">
                            We found{' '}
                            <strong className="font-semibold text-neutral-800 dark:text-neutral-100">
                                {data.length}
                            </strong>{' '}
                            results articles for{' '}
                            <strong className="font-semibold text-neutral-800 dark:text-neutral-100">
                                {`"${s}"`}
                            </strong>
                        </span>
                    )}
                </header>
            </div>
            <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
                <main>
                    {/* TABS FILTER */}
                    {searchValue !== '' ? (
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
                                <TopicFilterListBox
                                    lists={FILTERS}
                                    onFilterClick={handleFilterClick}
                                />
                            </div>
                        </div>
                    ) : (
                        <Empty
                            mainText="Search Something!!"
                            subText="Type something in the search bar to get started."
                        />
                    )}
                    {
                        /* LOADING STATE */
                        // loading && (
                        //     <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
                        //         {[...Array(8)].map((_, id) => (
                        //             <div key={id}>
                        //                 <div className="hidden sm:block">
                        //                     {/* Render Card11 on larger screens */}
                        //                     <Card11Skeleton />
                        //                 </div>
                        //                 <div className="sm:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
                        //                     {/* Render Card5 on smaller screens */}
                        //                     <Card11Skeleton />
                        //                 </div>
                        //             </div>
                        //         ))}
                        //     </div>
                        // )
                    }
                    {/* RENDER ARTICLES */}
                    {tabActive === 'Articles' &&
                        data.length > 0 &&
                        searchValue !== '' && (
                            <PostsSection
                                id={`search-${searchValue}`}
                                posts={data}
                            />
                        )}
                    {tabActive === 'Topics' && topics.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-8 mt-8 lg:mt-10">
                            {topics.map((cat, id) => (
                                <CardTopic2 key={id} topic={cat} />
                            ))}
                        </div>
                    )}
                    {tabActive === 'Authors' && authors.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-8 mt-8 lg:mt-10">
                            {authors.map((author, key) => (
                                <CardAuthorBox key={key} author={author} />
                            ))}
                        </div>
                    )}
                    {/* RENDER NO RESULTS COMPONENT */}
                    {tabActive === 'Articles' &&
                        data.length === 0 &&
                        !loading && (
                            <Empty
                                mainText="No Posts Found"
                                subText="We couldn’t find any results. Try for something else."
                            />
                        )}
                    {tabActive === 'Topics' && topics.length === 0 && (
                        <Empty
                            mainText="No Topics Found"
                            subText="We couldn’t find any results. Try for something else."
                        />
                    )}
                    {tabActive === 'Authors' && authors.length === 0 && (
                        <Empty
                            mainText="No Authors Found"
                            subText="We couldn’t find any results. Try for something else."
                        />
                    )}
                </main>
            </div>
        </div>
    )
}

export default PageSearchV2
