import React from 'react'
import SectionLargeSlider from './SectionLargeSlider'
import BackgroundSection from '@/components/BackgroundSection/BackgroundSection'
import SectionSliderNewTopics from '@/components/SectionSliderNewTopics/SectionSliderNewTopics'
import SectionMagazine1 from '@/components/Sections/SectionMagazine1'
import SectionSliderPosts from '@/components/Sections/SectionSliderPosts'
import SectionSliderSources from '@/components/SectionSliderSources/SectionSliderSources'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import PostType from '@/types/PostType'
import TopicType from '@/types/TopicType'
import NewsType from '@/types/NewsType'
import SourceType from '@/types/SourceType'
import Particles from '@/components/Particles/Particles'
import SectionImport from '@/components/SectionImport/SectionImport'
import SectionNewPosts from '@/components/SectionNewPosts/SectionNewPosts'
import { Metadata } from 'next'
import MySlider from '@/components/MySlider'
import NewsCardLong from '@/components/NewsCardLong/NewsCardLong'

async function getData() {
    const supabase = createClient(cookies())
    const { data: news, error: newsError } = await supabase
        .from('news')
        .select(
            `
            id, 
            title, 
            description, 
            summary, 
            image, 
            author, 
            link, 
            created_at,
            source(
                id,
                name,
                image,
                description,
                url
            ),
            likeCount:likes(count),
            commentCount:comments(count),
            news_topics(topic:topics(id,name,color))
        `
        )
        .order('created_at', { ascending: false })
        .limit(20)

    console.log('news', news)

    const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('id, name, image, color, postCount:post_topics(count)')
        .ilike('image', '%https://%')
        .limit(20)

    const { data: sources, error: sourcesError } = await supabase
        .from('sources')
        .select('id, name, url, background, image, newsCount:news(count)')
        .limit(20)

    console.log('error', newsError, topicsError, sourcesError)

    return {
        popular_news: news,
        topics,
        sources,
    }
}

export const metadata: Metadata = {
    title: 'Athera',
    description:
        'Athera is a platform for creators to share their knowledge and grow their audience.',
    keywords: ['athera', 'blog', 'platform', 'knowledge'],
    openGraph: {
        title: 'Athera',
        description:
            'Athera is a platform for creators to share their knowledge and grow their audience.',
        url: `https://www.athera.blog`,
        type: 'website',
        images: [
            {
                url: 'https://www.athera.blog/og-image.jpg',
                width: 800,
                height: 480,
                alt: 'Main Image',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@athera_blog',
        title: 'Athera',
        description:
            'Athera is a platform for creators to share their knowledge and grow their audience.',
        images: {
            url: 'https://www.athera.blog/twitter-og.jpg',
            alt: 'Main Image',
        },
    },
}

interface HomeProps {
    popular_news: NewsType[]
    topics: TopicType[]
    sources: SourceType[]
}

const PageHome = async ({}) => {
    const data = (await getData()) as unknown as HomeProps
    async function handleHideAuthorNews(newsId: string): Promise<void> {
        const supabase = createClient(cookies())
        const { error } = await supabase
            .from('hidden_news')
            .insert({ news_id: newsId })

        if (error) {
            console.error('Error hiding news:', error)
        } else {
            console.log('News hidden successfully')
        }
    }

    return (
        <div className="PageHome relative overflow-x-hidden">
            <div className="container relative">
                <div className="absolute inset-0 h-[100vh]">
                    <Particles
                        className="pointer-events-none w-full md:h-full"
                        quantity={200}
                    />
                </div>
                <div className="absolute inset-x-0 mt-72 m-auto h-80 max-w-lg bg-gradient-to-tr dark:from-indigo-400 dark:via-blue-800 dark:to-blue-200 blur-[118px] from-blue-200 via-blue-300 to-blue-400"></div>
                <SectionLargeSlider
                    className="md:py-16 lg:pb-28 pt-4"
                    news={data.popular_news.filter((_, i) => i < 3)}
                />

                <div className="relative py-16">
                    <SectionImport />
                </div>

                <SectionSliderNewTopics
                    className="py-16 lg:py-28"
                    heading="Top trending topics"
                    subHeading="Discover 233 topics"
                    topics={data.topics.filter((_, i) => i < 12)}
                    topicCardType="card4"
                />

                <SectionMagazine1
                    className="py-16 lg:py-28"
                    news={data.popular_news.filter((_, i) => i > 3)}
                />

                {/* <SectionNewPosts posts={data.popular_news} /> */}

                <SectionSliderSources
                    className="py-16 lg:py-28"
                    heading="Featured Sources"
                    subHeading="Discover top sources"
                    sources={data.sources.filter((_, i) => i < 10)}
                />

                {/* <div className="relative py-16">
                    <BackgroundSection />
                    <MySlider
                        data={data.popular_news}
                        renderItem={(item, indx) => (
                            <NewsCardLong
                                key={indx}
                                news={item}
                                onHideNews={handleHideAuthorNews}
                            />
                        )}
                        itemPerRow={4}
                    />
                </div> */}
                <div className="relative py-16 lg:py-28">
                    <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center bg-blue-50/30 dark:bg-blue-900/30 backdrop-blur-md py-1 px-3 rounded-full mb-6 border border-blue-100/30 dark:border-blue-800/30">
                            <svg
                                className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                    fill="currentColor"
                                />
                            </svg>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                OPEN SOURCE
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">
                            Built in the Open,{' '}
                            <span className="text-blue-600 dark:text-blue-400">
                                For Everyone
                            </span>
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
                            Athera is proudly open source. We believe in
                            transparency and community-driven development. Check
                            out our code, contribute, report issues, or fork for
                            your own projects.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://github.com/ArivAfonso/athera"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 rounded-lg bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white font-medium transition-all duration-200 backdrop-blur-sm shadow-lg border border-gray-800/30 hover:shadow-blue-500/10 hover:translate-y-[-2px]"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                        fill="currentColor"
                                    />
                                </svg>
                                View GitHub Repository
                            </a>

                            <a
                                href="https://github.com/ArivAfonso/athera/stargazers"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 rounded-lg bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-neutral-700 text-gray-900 dark:text-white font-medium transition-all duration-200 shadow-md border border-white/20 dark:border-gray-700/30 hover:shadow-xl hover:translate-y-[-2px]"
                            >
                                <svg
                                    className="w-5 h-5 mr-2 text-yellow-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Star the Project
                            </a>
                        </div>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-lg p-4 border border-white/20 dark:border-gray-700/30 text-center">
                                <div className="font-bold text-xl md:text-2xl text-blue-600 dark:text-blue-400">
                                    React
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Frontend
                                </div>
                            </div>
                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-lg p-4 border border-white/20 dark:border-gray-700/30 text-center">
                                <div className="font-bold text-xl md:text-2xl text-blue-600 dark:text-blue-400">
                                    Next.js
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Framework
                                </div>
                            </div>
                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-lg p-4 border border-white/20 dark:border-gray-700/30 text-center">
                                <div className="font-bold text-xl md:text-2xl text-blue-600 dark:text-blue-400">
                                    Supabase
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Backend
                                </div>
                            </div>
                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-lg p-4 border border-white/20 dark:border-gray-700/30 text-center">
                                <div className="font-bold text-xl md:text-2xl text-blue-600 dark:text-blue-400">
                                    Tailwind
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Styling
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageHome
