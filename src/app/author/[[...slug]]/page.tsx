'use client'

import React from 'react'
import SocialsList from '@/components/SocialsList/SocialsList'
import Card11 from '@/components/Card11/Card11'
import NcImage from '@/components/NcImage/NcImage'
import { GlobeAltIcon, ShareIcon } from '@heroicons/react/24/outline'
import VerifyIcon from '@/components/VerifyIcon'
import FollowButton from '@/components/FollowButton'
import NcDropDown from '@/components/NcDropDown/NcDropDown'
import { SOCIALS_DATA } from '@/components/SocialsShare/SocialsShare'
import AccountActionDropdown from '@/components/AccountActionDropdown/AccountActionDropdown'
import Image from 'next/image'
import { sanityClient } from '@/lib/sanityClient'
import groq from 'groq'
import { useState, useEffect } from 'react'

async function getData(context: { params: { slug: any } }) {
    const slug = context.params.slug
    const authorQuery = groq`*[_type == "author" && slug.current == $slug][0]{
      name,
      slug,
      image,
      bio,
      website,
    }`

    const author = await sanityClient.fetch(authorQuery, { slug })

    const postsQuery = groq`*[_type == "post" && author._ref == ^._id]`
    const posts = await sanityClient.fetch(postsQuery, { author })

    author.posts = posts

    return author
}

interface Author {
    name: string
    slug: {
            _type: string
            current: string
        }
    image: string
    bio: string
    website: string
    posts: any[]
}

const PageAuthor = (context: any) => {
    const [data, setData] = useState<Author>({
        name: '',
        slug: { _type: '', current: '' },
        image: '',
        bio: '',
        website: '',
        posts: [],
      })
    
    useEffect( () => { 
        async function fetchData() {
            try {
                const res:Author = await getData(context);
                setData(res);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);
    return (
        <div className={`nc-PageAuthor `}>
            {/* HEADER */}
            <div className="w-full">
                <div className="relative w-full h-40 md:h-60 2xl:h-72">
                    <NcImage
                        alt=""
                        containerClassName="absolute inset-0"
                        sizes="(max-width: 1280px) 100vw, 1536px"
                        src="https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                        className="object-cover w-full h-full"
                        fill
                        priority
                    />
                </div>
                <div className="container -mt-10 lg:-mt-16">
                    <div className="relative bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 p-5 lg:p-8 rounded-3xl md:rounded-[40px] shadow-xl flex flex-col md:flex-row">
                        <div className="w-32 lg:w-40 flex-shrink-0 mt-12 sm:mt-0">
                            <div className="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center overflow-hidden text-neutral-100 uppercase font-semibold rounded-full w-20 h-20 text-xl lg:text-2xl lg:w-36 lg:h-36 ring-4 ring-white dark:ring-0 shadow-2xl z-0">
                                <Image
                                    alt="Avatar"
                                    src={data.image}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/*  */}
                        <div className="pt-5 md:pt-1 lg:ml-6 xl:ml-12 flex-grow">
                            <div className="max-w-screen-sm space-y-3.5 ">
                                <h2 className="inline-flex items-center text-2xl sm:text-3xl lg:text-4xl font-semibold">
                                    <span>{data.name}</span>
                                    <VerifyIcon
                                        className="ml-2"
                                        iconClass="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8"
                                    />
                                </h2>
                                <span className="block text-sm text-neutral-500 dark:text-neutral-400">
                                    {data.bio}
                                </span>
                                <a
                                    href={data.website}
                                    className="flex items-center text-xs font-medium space-x-2.5 cursor-pointer text-neutral-500 dark:text-neutral-400 truncate"
                                >
                                    <GlobeAltIcon className="flex-shrink-0 w-4 h-4" />
                                    <span className="text-neutral-700 dark:text-neutral-300 truncate">
                                        {data.website}
                                    </span>
                                </a>
                                <SocialsList itemClass="block w-7 h-7" />
                            </div>
                        </div>

                        {/*  */}
                        <div className="absolute md:static left-5 right-5 top-4 sm:left-auto sm:top-5 sm:right-5 flex justify-end">
                            <FollowButton
                                isFollowing={false}
                                fontSize="text-sm md:text-base font-medium"
                                sizeClass="px-4 py-1 md:py-2.5 h-8 md:!h-10 sm:px-6 lg:px-8"
                            />

                            <div className="mx-2">
                                <NcDropDown
                                    className="flex-shrink-0 flex items-center justify-center focus:outline-none h-10 w-10 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-full"
                                    renderTrigger={() => (
                                        <ShareIcon className="h-5 w-5" />
                                    )}
                                    onClick={() => {}}
                                    data={SOCIALS_DATA}
                                />
                            </div>

                            <AccountActionDropdown containerClassName="h-10 w-10 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700" />
                        </div>
                    </div>
                </div>
            </div>
            {/* ====================== END HEADER ====================== */}

            <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
                <main>
                    {/* LOOP ITEMS */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
                        {data.posts.map((post) => (
                            <Card11 key={post.id} post={post} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default PageAuthor
