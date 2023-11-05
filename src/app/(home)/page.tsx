import React from 'react'
import SectionLargeSlider from '@/app/(home)/SectionLargeSlider'
import BackgroundSection from '@/components/BackgroundSection/BackgroundSection'
import SectionSliderNewAuthors from '@/components/SectionSliderNewAthors/SectionSliderNewAuthors'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories/SectionSliderNewCategories'
import SectionMagazine1 from '@/components/Sections/SectionMagazine1'
import SectionSliderPosts from '@/components/Sections/SectionSliderPosts'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import PostType from '@/types/PostType'
import CategoryType from '@/types/CategoryType'
import AuthorType from '@/types/AuthorType'

async function getData() {
    const supabase = createServerComponentClient({ cookies })
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
        post_categories(category:categories(id,name,color)),
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
        .limit(20)

    const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, color, postCount:post_categories(count)')
        .limit(20)

    const { data: authors, error: authorsError } = await supabase
        .from('users')
        .select('id, name, username, verified, postCount:posts(count), avatar')
        .limit(20)
    return {
        popular_posts: posts,
        categories: categories,
        authors: authors,
    }
}

interface HomeProps {
    popular_posts: PostType[]
    categories: CategoryType[]
    authors: AuthorType[]
}

const PageHome = async ({}) => {
    //@ts-ignore
    const data: HomeProps = await getData()
    console.log(data.authors)
    return (
        <div className="nc-PageHome relative overflow-x-hidden">
            <div className="container relative">
                <SectionLargeSlider
                    className="pt-10 pb-16 md:py-16 lg:pb-28 lg:pt-20"
                    posts={data.popular_posts.filter((_, i) => i < 3)}
                />

                <div className="relative py-16">
                    <BackgroundSection />
                    <SectionSliderNewAuthors
                        heading="All of our authors"
                        subHeading=""
                        authors={data.authors.filter((_, i) => i < 10)}
                    />
                </div>

                <SectionSliderNewCategories
                    className="py-16 lg:py-28"
                    heading="Top trending topics"
                    subHeading="Discover 233 topics"
                    categories={data.categories.filter((_, i) => i < 10)}
                    categoryCardType="card4"
                />

                <SectionMagazine1
                    className="py-16 lg:py-28"
                    posts={data.popular_posts.filter((_, i) => i < 6)}
                />
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
