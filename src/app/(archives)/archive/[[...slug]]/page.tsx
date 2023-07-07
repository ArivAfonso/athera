import React, { FC } from 'react'
import ModalCategories from '../../ModalCategories'
import { DEMO_CATEGORIES } from '@/data/taxonomies'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import ArchiveFilterListBox from '@/components/ArchiveFilterListBox/ArchiveFilterListBox'
import Card11 from '@/components/Card11/Card11'
import Image from 'next/image'
import { sanityClient } from '@/lib/sanityClient'
import groq from 'groq'
import imageUrlBuilder from '@sanity/image-url'
import PostType from '@/types/PostType'
import CategoryType from '@/types/CategoryType'
import { Metadata } from 'next'

function urlFor(source: any) {
    return imageUrlBuilder(sanityClient).image(source)
}

async function getData(context: { params: { slug: any } }) {
    const slug = context.params.slug[0]
    const query = groq`*[_type == "category" && slug.current == $slug][0]{
        title,
        image,
        description,
        slug,
        color,
        "posts": *[_type == "post" && references(^._id)]{
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
    const category = await sanityClient.fetch(query, { slug })
    return category
}

export async function generateMetadata(
    props: any,
    searchParams: any
): Promise<Metadata> {
    const data: CategoryType = await getData(props)
    const imageUrl = data.image?.asset._ref
        ? urlFor(data.image.asset._ref).url()
        : ''

    return {
        title: data.title,
        description: `News articles and other content about ${data.title}`,
        openGraph: {
            title: data.title,
            url: `https://www.example.com/${data.slug.current}`,
            type: 'article',
            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 480,
                    alt: data.title,
                },
            ],
        },
    }
}

const PageArchive = async (context: any) => {
    const data: CategoryType = await getData(context)
    const imageUrl = data.image && urlFor(data.image.asset._ref).url()

    return (
        <div className={`nc-PageArchive`}>
            {/* HEADER */}
            <div className="w-full px-2 xl:max-w-screen-2xl mx-auto">
                <div className="relative aspect-w-16 aspect-h-13 sm:aspect-h-9 lg:aspect-h-8 xl:aspect-h-5 rounded-3xl md:rounded-[40px] overflow-hidden z-0">
                    <Image
                        alt="Category header image"
                        fill
                        src={imageUrl || ''}
                        className="object-cover w-full h-full rounded-3xl md:rounded-[40px]"
                        sizes="(max-width: 1280px) 100vw, 1536px"
                    />
                    <div className="absolute inset-0 bg-black text-white bg-opacity-30 flex flex-col items-center justify-center">
                        <h2 className="inline-block align-middle text-5xl font-semibold md:text-7xl ">
                            {data.title}
                        </h2>
                        <span className="block mt-4 text-neutral-300">
                            {data.posts && data.posts.length} Articles
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
                        </div>
                    </div>

                    {/* LOOP ITEMS */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
                        {data.posts &&
                            data.posts.map((post, id) => (
                                <Card11 key={id} post={post} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageArchive
