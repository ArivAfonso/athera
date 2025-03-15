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
    //@ts-ignore
    const data: HomeProps = await getData()
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

                <div className="relative py-16">
                    <BackgroundSection />
                    {/* <SectionSliderPosts
                        postCardName="card9"
                        heading="Interesting Content"
                        subHeading="Over 69420 articles till date"
                        posts={data.popular_news}
                    /> */}
                </div>
            </div>
        </div>
    )
}

export default PageHome
