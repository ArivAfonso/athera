import React from 'react'
import NcImage from '@/components/NcImage/NcImage'
import SingleHeader from '@/app/(singles)/SingleHeader'
import { sanityClient } from '@/lib/sanityClient'
import groq from 'groq'
import SingleContent from '../../SingleContent'
import SingleRelatedPosts from '../../SingleRelatedPosts'
import imageUrlBuilder from '@sanity/image-url'
import { RelatedPostsType } from '../../SingleRelatedPosts'

function urlFor(source: any) {
    return imageUrlBuilder(sanityClient).image(source)
}

async function getData(context: { params: { slug: any } }) {
    const slug = context.params.slug[0]
    const query = groq`*[_type == "post" && slug.current == $slug][0]{
        title,
        mainImage,
        categories[]->{title, slug, color},
        publishedAt,
        body,
        description,
        author->{name, image},
        "latestPostsInCategory": *[_type == "post" && references(categories[]->._id)] | order(publishedAt desc) [0..3] {
          title,
          mainImage,
          categories[]->{title, slug, color},
          publishedAt,
          description,
          "author": author->{
            name,
            image
          }
        }
      }
      `
    const post = await sanityClient.fetch(query, { slug })
    return post
}

interface BlogPost {
    title: string
    mainImage: {
        asset: {
            _ref: string
            _type: string
        }
        _type: string
    }
    categories: { title: string; color: string; slug: string }[]
    publishedAt: string
    description: string
    body: []
    author: {
        name: string
        image: string
    }
    latestPostsInCategory: RelatedPostsType['latestPostsInCategory']
}

const PageSingle = async (context: any) => {
    const data: BlogPost = await getData(context)
    const imageUrl = urlFor(data.mainImage.asset._ref)
        .width(320)
        .height(240)
        .fit('max')
        .auto('format')
        .url()
    if (!data) {
        // Handle the case where data is undefined
        return <div>Post not found</div>
    }
    return (
        <>
            <div className={`nc-PageSingle pt-8 lg:pt-16`}>
                <header className="container rounded-xl">
                    <div className="max-w-screen-md mx-auto">
                        <SingleHeader
                            description={data.description}
                            title={data.title}
                            category={data.categories[0].title}
                        />
                    </div>
                </header>

                {/* FEATURED IMAGE */}
                <NcImage
                    alt="single"
                    containerClassName="container my-10 sm:my-12"
                    className="w-full rounded-xl"
                    src={imageUrl}
                    width={1260}
                    height={750}
                    sizes="(max-width: 1024px) 100vw, 1280px"
                />
                {/* SINGLE MAIN CONTENT */}
                <div className="container mt-10">
                    <SingleContent body={data.body} />
                </div>

                {/* RELATED POSTS */}
                <SingleRelatedPosts posts={data} />
            </div>
        </>
    )
}

export default PageSingle
