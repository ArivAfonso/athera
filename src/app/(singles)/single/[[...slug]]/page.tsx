import React from 'react'
import NcImage from '@/components/NcImage/NcImage'
import SingleHeader from '@/app/(singles)/SingleHeader'
import { sanityClient } from '@/lib/sanityClient'
import groq from 'groq'
import SingleContent from '../../SingleContent'
import SingleRelatedPosts from '../../SingleRelatedPosts'
import imageUrlBuilder from '@sanity/image-url'
import { RelatedPostsType } from '../../SingleRelatedPosts'
import AuthorType from '@/types/AuthorType'

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
        slug,
        "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
        author->{name, slug, bio, image},
        "latestPostsInCategory": *[_type == "post" && references(categories[]->._id)] | order(publishedAt desc) [0..3] {
          title,
          slug,
          mainImage,
          categories[]->{title, slug, color},
          publishedAt,
          description,
          "author": author->{
            name,
            bio,
            image,
            slug
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
    categories: {
        title: string
        color: string
        slug: {
            _type: string
            current: string
        }
    }[]
    publishedAt: string
    estimatedReadingTime: number
    description: string
    slug: {
        _type: string
        current: string
    }
    body: []
    author: AuthorType
    latestPostsInCategory: RelatedPostsType['latestPostsInCategory']
}

const PageSingle = async (context: any) => {
    const data: BlogPost = await getData(context)
    const imageUrl = urlFor(data.mainImage.asset._ref).url()
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
                            estimatedReadingTime={data.estimatedReadingTime}
                            title={data.title}
                            category={data.categories}
                            author={data.author}
                            publishedAt={data.publishedAt}
                            slug={data.slug}
                        />
                    </div>
                </header>

                <NcImage
                    alt="single"
                    containerClassName="container my-10 sm:my-12 flex justify-center items-center"
                    className="rounded-xl"
                    src={imageUrl}
                    width={800} // Adjust the desired width
                    height={480} // Adjust the desired height
                    sizes="(max-width: 768px) 40vw, 300px" // Adjust the sizes based on your requirements
                />
                {/* SINGLE MAIN CONTENT */}
                <div className="container mt-10">
                    <SingleContent body={data.body} author={data.author} />
                </div>

                {/* RELATED POSTS */}
                <SingleRelatedPosts posts={data} />
            </div>
        </>
    )
}

export default PageSingle
