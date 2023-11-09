'use client'

import React, { Suspense } from 'react'
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
import { useState, useEffect } from 'react'
import AuthorType from '@/types/AuthorType'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Card6 from '@/components/Card6/Card6'
import Empty from '@/components/Empty'

export const runtime = 'edge'

async function getData(context: { params: { slug: any } }) {
    const supabase = createClientComponentClient()
    //TODO: check if user is current user then add edit button to SOCIALS_DATA

    const username = context.params.slug[0]
    const { data, error } = await supabase
        .from('users')
        .select(
            `
            id,
            name,
            verified,
            username,
            avatar,
            twitter,
            facebook,
            instagram,
            youtube,
            tiktok,
            twitch,
            pinterest,
            linkedin,
            github,
            posts (
                id,
              title,
              created_at,
              description,
              likeCount:likes(count),
              commentCount:comments(count),
              likes(
                liker(
                    id
                )
              ),
              bookmarks(user(id)),
              image,
              author(
                verified,
                id,
                name,
                username,
                avatar
              ),
              post_categories(category:categories(name,color,id))
            )
            `
        )
        .eq('username', username)
        .single()
    const userData: AuthorType | null = data as unknown as AuthorType

    const { data: session } = await supabase.auth.getSession()

    userData?.posts?.map((post) => {
        post.likes.map((like) => {
            if (like.liker.id === session?.session?.user.id) post.isLiked = true
            else post.isLiked = false
        })
        post.bookmarks.map((bookmark) => {
            if (bookmark.user.id === session?.session?.user.id)
                post.isBookmarked = true
            else post.isBookmarked = false
        })
    })
    console.log(error)
    return userData
}

const PageAuthor = (context: any) => {
    const [data, setData] = useState<AuthorType>({
        id: '',
        name: '',
        followerCount: 0,
        username: '',
        avatar: '',
        bio: '',
        website: '',
        posts: [],
        verified: false,
        twitter: '',
        facebook: '',
        instagram: '',
        youtube: '',
        tiktok: '',
        twitch: '',
        pinterest: '',
        linkedin: '',
        github: '',
    })

    useEffect(() => {
        async function fetchData() {
            try {
                const res: AuthorType = await getData(context)
                setData(res)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className={`nc-PageAuthor `}>
            <title>{data.name} - Athera</title>
            {/* HEADER */}
            <div className="w-full">
                <div className="container mt-10 lg:mt-16">
                    <div className="relative bg-white dark:bg-neutral-900 p-5 lg:p-8 rounded-3xl md:rounded-[40px] shadow-xl flex flex-col md:flex-row">
                        <div className="w-32 lg:w-40 flex-shrink-0 mt-12 sm:mt-0">
                            <Suspense
                                fallback={
                                    <div className="wil-avatar animate-pulse w-20 h-20 dark:bg-gray-700 bg-gray-300 rounded-full"></div>
                                }
                            >
                                <div className="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center overflow-hidden text-neutral-100 uppercase font-semibold rounded-full w-20 h-20 text-xl lg:text-2xl lg:w-36 lg:h-36 ring-4 ring-white dark:ring-0 shadow-2xl z-0">
                                    <Image
                                        alt="Avatar"
                                        src={data.avatar}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </Suspense>
                        </div>

                        {/*  */}
                        <div className="pt-5 md:pt-1 lg:ml-6 xl:ml-12 flex-grow">
                            <Suspense
                                fallback={
                                    <div className="max-w-screen-sm space-y-3.5">
                                        <div className="animate-pulse h-8 w-1/2 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                                        <div className="animate-pulse h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                                        <div className="animate-pulse h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                                        <div className="animate-pulse h-4 w-4/5 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                                    </div>
                                }
                            >
                                <div className="max-w-screen-sm space-y-3.5 ">
                                    <h2 className="inline-flex items-center text-2xl sm:text-3xl lg:text-4xl font-semibold">
                                        <span>{data.name}</span>
                                        {data.verified ? (
                                            <VerifyIcon
                                                className="ml-2"
                                                iconClass="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8"
                                            />
                                        ) : (
                                            <></>
                                        )}
                                    </h2>
                                    <span className="block text-sm text-neutral-500 dark:text-neutral-400">
                                        {data.bio}
                                    </span>
                                    {data.website && (
                                        <a
                                            href={data.website}
                                            className="flex items-center text-xs font-medium space-x-2.5 cursor-pointer text-neutral-500 dark:text-neutral-400 truncate"
                                        >
                                            <GlobeAltIcon className="flex-shrink-0 w-4 h-4" />
                                            <span className="text-neutral-700 dark:text-neutral-300 truncate">
                                                {data.website}
                                            </span>
                                        </a>
                                    )}
                                    <SocialsList
                                        //@ts-ignore
                                        github={data.github}
                                        //@ts-ignore
                                        twitter={data.twitter}
                                        //@ts-ignore
                                        facebook={data.facebook}
                                        //@ts-ignore
                                        instagram={data.instagram}
                                        //@ts-ignore
                                        youtube={data.youtube}
                                        //@ts-ignore
                                        tiktok={data.tiktok}
                                        //@ts-ignore
                                        twitch={data.twitch}
                                        //@ts-ignore
                                        pinterest={data.pinterest}
                                        //@ts-ignore
                                        linkedin={data.linkedin}
                                        itemClass="block w-7 h-7"
                                    />
                                </div>
                            </Suspense>
                        </div>

                        {/*  */}
                        <div className="absolute md:static left-5 right-5 top-4 sm:left-auto sm:top-5 sm:right-5 flex justify-end">
                            <Suspense
                                fallback={
                                    <div className="animate-pulse h-8 w-24 dark:bg-gray-700 bg-gray-300 rounded-full"></div>
                                }
                            >
                                <FollowButton
                                    authorId={data.id}
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
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
            {/* ====================== END HEADER ====================== */}

            <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
                <main>
                    {/* LOOP ITEMS */}
                    <Suspense
                        fallback={Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse bg-gray-300 dark:bg-gray-600 rounded-lg p-4"
                            >
                                <div className="nc-Card11 relative flex flex-col group rounded-3xl overflow-hidden bg-gray-300">
                                    <div className="block flex-shrink-0 relative w-full rounded-t-3xl overflow-hidden">
                                        <div className="h-40 bg-gray-400 dark:bg-gray-700 animate-pulse"></div>
                                    </div>
                                    <div className="p-4 flex flex-col space-y-3">
                                        <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded-md animate-pulse"></div>
                                        <div className="h-6 bg-gray-400 dark:bg-gray-700 rounded-md animate-pulse"></div>
                                        <h3 className="nc-card-title block h-8 bg-gray-400 dark:bg-gray-700 rounded-md animate-pulse"></h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    >
                        {/* LOOP ITEMS */}
                        {data.posts ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
                                {data.posts.map((post, id) => (
                                    <div key={id}>
                                        <div className="hidden sm:block">
                                            {/* Render Card11 on larger screens */}
                                            <Card11 post={post} />
                                        </div>
                                        <div className="sm:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {/* Render Card5 on smaller screens */}
                                            <Card6 post={post} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Empty
                                mainText="No Posts Found"
                                subText="This user hasn't posted anything!"
                                className="text-center p-4"
                            />
                        )}
                    </Suspense>
                </main>
            </div>
        </div>
    )
}

export default PageAuthor
