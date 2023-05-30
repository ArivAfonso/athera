import React from 'react'
import SectionLargeSlider from '@/app/(home)/SectionLargeSlider'
import BackgroundSection from '@/components/BackgroundSection/BackgroundSection'
import SectionSliderNewAuthors from '@/components/SectionSliderNewAthors/SectionSliderNewAuthors'
import { DEMO_POSTS } from '@/data/posts'
import { DEMO_CATEGORIES } from '@/data/taxonomies'
import { DEMO_AUTHORS } from '@/data/authors'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories/SectionSliderNewCategories'
import SectionMagazine1 from '@/components/Sections/SectionMagazine1'
import { sanityClient } from '@/lib/sanityClient'
import groq from 'groq'

//
const MAGAZINE1_POSTS = DEMO_POSTS.filter((_, i) => i >= 8 && i < 16)

//

async function getData() {
    const query = groq`{
  "latestPosts": *[_type == "post"] | order(publishedAt desc)[0..9] {
    title,
    publishedAt,
    mainImage,
    slug,
    categories[]->{
      title,
      slug,
      color,
    },
    author->{
      name,
      image,
    }
  },
  "categories": *[_type == "category"] {
    _id,
    title,
    color,
    slug,
    "numPosts": count(*[_type == "post" && references(^._id)])
  },
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
    title: string;
    publishedAt: string;
    slug: {
            _type: string
            current: string
        };
    categories: Category[];
    author: Author;
    mainImage: {
        asset: {
            _ref: string;
            _type: string;
        };
        _type: string;
    };
  }
  
  interface Category {
    _id: string;
    title: string;
    color: string;
    slug: {
            _type: string
            current: string
        };
    numPosts: number;
  }
  
  interface Author {
    name: string;
    slug: {
            _type: string
            current: string
        };
    image: {
        asset: {
            _ref: string;
            _type: string;
        };
        _type: string;
    }
    count: number;
    username: string;
  }
  
  interface HomeProps{
    latestPosts: Post[];
    categories: Category[];
    authors: Author[];
  }



const PageHome = async ({}) => {
    const data:HomeProps= await getData()
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
                    categories={DEMO_CATEGORIES.filter((_, i) => i < 10)}
                    categoryCardType="card4"
                />

                <SectionMagazine1
                    className="py-16 lg:py-28"
                    posts={MAGAZINE1_POSTS}
                />
            </div>
        </div>
    )
}

export default PageHome
