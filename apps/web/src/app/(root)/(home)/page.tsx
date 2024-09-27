import React from 'react'
import SectionLargeSlider from './SectionLargeSlider'
import BackgroundSection from '@/components/BackgroundSection/BackgroundSection'
import SectionSliderNewAuthors from '@/components/SectionSliderNewAthors/SectionSliderNewAuthors'
import SectionSliderNewTopics from '@/components/SectionSliderNewTopics/SectionSliderNewTopics'
import SectionMagazine1 from '@/components/Sections/SectionMagazine1'
import SectionSliderPosts from '@/components/Sections/SectionSliderPosts'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import PostType from '@/types/PostType'
import TopicType from '@/types/TopicType'
import AuthorType from '@/types/AuthorType'
import Particles from '@/components/Particles/Particles'
import SectionImport from '@/components/SectionImport/SectionImport'
import SectionNewPosts from '@/components/SectionNewPosts/SectionNewPosts'
import { Metadata } from 'next'

async function getData() {
    const supabase = createClient(cookies())
    const { data: posts, error } = await supabase
        .from('posts')
        .select(
            `id,
        title,
        created_at,
        description,
        image,
        likeCount:likes(count),
        commentCount:comments(count),
        post_topics(topic:topics(id,name,color)),
        bookmarks(user(id)),
        likes(
            liker(
                id
            )
        ),
        author(
            id,
            verified,
            name,
            username,
            avatar
        )`
        )
        .order('created_at', { ascending: false })
        .is('featured', true)
        .is('scheduled_at', null)
        .limit(20)

    const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('id, name, image, color, postCount:post_topics(count)')
        .ilike('image', '%https://%')
        .limit(20)

    const { data: authors, error: authorsError } = await supabase
        .from('users')
        .select('id, name, username, verified, postCount:posts(count), avatar')
        .limit(20)
    return {
        popular_posts: posts,
        topics: topics,
        authors: authors,
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
    popular_posts: PostType[]
    topics: TopicType[]
    authors: AuthorType[]
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
                    posts={data.popular_posts.filter((_, i) => i < 3)}
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
                    posts={data.popular_posts.filter((_, i) => i > 3)}
                />

                {/* <SectionNewPosts posts={data.popular_posts} /> */}

                <div className="relative py-16">
                    <BackgroundSection />
                    <SectionSliderPosts
                        postCardName="card9"
                        heading="Interesting Content"
                        subHeading="Over 69420 articles till date"
                        posts={data.popular_posts}
                    />
                </div>
            </div>
        </div>
    )
}

export default PageHome
