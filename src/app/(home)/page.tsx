import React from 'react'
import SectionLargeSlider from '@/app/(home)/SectionLargeSlider'
import BackgroundSection from '@/components/BackgroundSection/BackgroundSection'
import SectionSliderNewAuthors from '@/components/SectionSliderNewAthors/SectionSliderNewAuthors'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories/SectionSliderNewCategories'
import SectionMagazine1 from '@/components/Sections/SectionMagazine1'
import { sanityClient } from '@/lib/sanityClient'
import groq from 'groq'

async function getData() {
    const query = groq`{
  "latestPosts": *[_type == "post"] | order(publishedAt desc)[0..9] {
    title,
    publishedAt,
    mainImage,
    slug,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
    categories[]->{
      title,
      slug,
      color,
    },
    author->{
      name,
      slug,
      image,
    }
  },
  "categories": *[_type == "category"] {
    _id,
    title,
    color,
    image,
    slug,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
  | order(postCount desc)
  [0..9],
  "authors": *[_type == "author"] {
    name,
    image,
    slug,
    username,
    "count": count(*[_type == "post" && references(^._id)])
  }
}
      `
    const home = await sanityClient.fetch(query)
    return home
}

interface Post {
    title: string
    publishedAt: string
    slug: {
        _type: string
        current: string
    }
    categories: Category[]
    author: Author
    mainImage: {
        asset: {
            _ref: string
            _type: string
        }
        _type: string
    }
}

interface Category {
    _id: string
    title: string
    color: string
    slug: {
        _type: string
        current: string
    }
    numPosts: number
}

interface Author {
    name: string
    slug: {
        _type: string
        current: string
    }
    image: {
        asset: {
            _ref: string
            _type: string
        }
        _type: string
    }
    count: number
    username: string
}

interface HomeProps {
    latestPosts: Post[]
    categories: Category[]
    authors: Author[]
}

const PageHome = async ({}) => {
    const data: HomeProps = await getData()
    return (
        <div className="nc-PageHome relative overflow-x-hidden">
            <div className="container relative">
                <SectionLargeSlider
                    className="pt-10 pb-16 md:py-16 lg:pb-28 lg:pt-20"
                    posts={data.latestPosts.filter((_, i) => i < 3)}
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
                    posts={data.latestPosts.filter((_, i) => i < 6)}
                />
            </div>
        </div>
    )
}

export default PageHome
