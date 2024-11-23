'use client'

import React from 'react'
import SocialsList from '@/components/SocialsList/SocialsList'
import Card11 from '@/components/Card11/Card11'
import {
    GlobeAltIcon,
    ShareIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline'
import VerifyIcon from '@/components/VerifyIcon'
import FollowButton from '@/components/FollowButton'
import {
    SOCIALS_DATA,
    TSocialShareItem,
} from '@/components/SocialsShare/SocialsShare'
import { DropDownItem } from 'ui'
import AccountActionDropdown from '@/components/AccountActionDropdown/AccountActionDropdown'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import AuthorType from '@/types/AuthorType'
import { createClient } from '@/utils/supabase/client'
import Card6 from '@/components/Card6/Card6'
import Empty from '@/components/Empty'
import { Img, DropDown } from 'ui'
import Loading from './loading'
import FollowModal from './FollowersModal'
import PostsSection from '@/components/PostsSection/PostsSection'
import PostType from '@/types/PostType'
import FollowersModal from './FollowersModal'
import FollowingModal from './FollowingModal'

async function getData(context: { params: { slug: any } }) {
    const supabase = createClient()
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
            bio,
            twitter,
            facebook,
            instagram,
            youtube,
            tiktok,
            twitch,
            linkedin,
            github,
            customization (
                profile_layout
            ),
            posts (
                id,
              title,
              created_at,
                scheduled_at,
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
              post_topics(topic:topics(name,color,id))
            )
            `
        )
        .eq('username', username)
        .is('posts.scheduled_at', null)
        .limit(24, { referencedTable: 'posts' })
        .order('created_at', { referencedTable: 'posts', ascending: false })
        .single()
    const userData: AuthorType | null = data as unknown as AuthorType

    const { count: followerData, error: followerErr } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following', userData?.id)

    const { count: followingData, error: followingErr } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower', userData?.id)

    // @ts-ignore
    userData.followerCount = followerData
    // @ts-ignore
    userData.followingCount = followingData
    return userData
}

const PageAuthor = (context: any) => {
    const [data, setData] = useState<AuthorType>({} as unknown as AuthorType)
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [followModal, setFollowModal] = useState(false)
    const [followType, setFollowType] = useState('')

    const username = context.params.slug[0]

    async function addPosts(pageParam: number) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('posts')
            .select(
                `
                id,
                title,
                created_at,
                  scheduled_at,
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
                post_topics(topic:topics(name,color,id))
            `
            )
            .eq('author.username', username)
            .order('created_at', { ascending: false })
            .range((pageParam - 1) * 24 + 2, pageParam * 24 - 1)

        const newPosts = data as unknown as PostType[]

        return newPosts
    }

    useEffect(() => {
        async function fetchData() {
            const author: AuthorType = await getData(context)
            if (author !== undefined) setData(author)
            setLoading(false)
        }
        fetchData()
    }, [context, data.name])

    useEffect(() => {
        if (data?.name) {
            document.title = `${data.name} - Athera`
        }
    }, [data])

    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleDescriptionClick = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            {loading ? (
                //TODO: add loading spinner
                <Loading />
            ) : (
                <>
                    <div className={`PageAuthor`}>
                        {/* HEADER */}
                        <div className="w-full">
                            {data.background && (
                                <div className="relative w-full pt-16 h-40 md:h-60 2xl:h-72">
                                    <Img
                                        alt=""
                                        containerClassName="absolute inset-0"
                                        sizes="(max-width: 1280px) 100vw, 1536px"
                                        src={
                                            data.background
                                                ? data.background
                                                : ''
                                        }
                                        className="object-cover w-full h-full"
                                        fill
                                        priority
                                    />
                                </div>
                            )}
                            <div className="container mt-10 lg:mt-16">
                                <div className="relative bg-white dark:bg-neutral-900 p-5 lg:p-8 rounded-3xl md:rounded-[40px] shadow-xl flex flex-col md:flex-row">
                                    <div className="w-32 lg:w-40 flex-shrink-0 mt-12 sm:mt-0">
                                        <div className="relative flex-shrink-0 inline-flex items-center justify-center overflow-hidden text-neutral-100 uppercase font-semibold rounded-full w-20 h-20 text-xl lg:text-2xl lg:w-36 lg:h-36 ring-4 ring-white dark:ring-0 shadow-2xl z-0">
                                            <Image
                                                alt="Avatar"
                                                src={data.avatar}
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
                                                {data.verified ? (
                                                    <VerifyIcon
                                                        className="ml-2"
                                                        iconClass="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8"
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </h2>
                                            <span className="block text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                                {data.bio}
                                            </span>

                                            {isModalOpen && (
                                                <div className="fixed inset-0 flex items-center justify-center z-50">
                                                    <div className="bg-white dark:bg-neutral-800 p-4 rounded shadow-lg">
                                                        <h2 className="text-lg font-bold mb-4">
                                                            Description
                                                        </h2>
                                                        <p>{data.bio}</p>
                                                        <button
                                                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                            onClick={closeModal}
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                    <div
                                                        className="fixed inset-0 bg-black opacity-50"
                                                        onClick={closeModal}
                                                    ></div>
                                                </div>
                                            )}

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
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                <div
                                                    className="flex items-center space-x-1 hover:underline cursor-pointer"
                                                    onClick={() => {
                                                        setFollowModal(true)
                                                        setFollowType(
                                                            'followers'
                                                        )
                                                    }}
                                                >
                                                    <UserGroupIcon className="h-5 w-5" />
                                                    <span>
                                                        {data.followerCount
                                                            ? data.followerCount
                                                            : 0}{' '}
                                                        Followers
                                                    </span>
                                                </div>
                                                <div
                                                    className="flex items-center space-x-1 hover:underline cursor-pointer"
                                                    onClick={() => {
                                                        setFollowModal(true)
                                                        setFollowType(
                                                            'following'
                                                        )
                                                    }}
                                                >
                                                    <UserGroupIcon className="h-5 w-5" />
                                                    <span>
                                                        {data.followingCount
                                                            ? data.followingCount
                                                            : 0}{' '}
                                                        Following
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*  */}
                                    <div className="absolute md:static left-5 right-5 top-4 sm:left-auto sm:top-5 sm:right-5 flex justify-end">
                                        <FollowButton
                                            authorId={data.id}
                                            fontSize="text-sm md:text-base font-medium"
                                            sizeClass="px-4 py-1 md:py-2.5 h-8 md:!h-10 sm:px-6 lg:px-8"
                                        />

                                        <div className="mx-2">
                                            <DropDown
                                                className="flex-shrink-0 flex items-center justify-center focus:outline-none h-10 w-10 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-full"
                                                renderTrigger={() => (
                                                    <ShareIcon className="h-5 w-5" />
                                                )}
                                                //@ts-ignore
                                                data={SOCIALS_DATA}
                                                onClick={() => {}}
                                            />
                                        </div>

                                        <AccountActionDropdown
                                            author={data}
                                            containerClassName="h-10 w-10 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ====================== END HEADER ====================== */}
                        <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
                            <main>
                                {/* LOOP ITEMS */}
                                {data.posts ? (
                                    <PostsSection
                                        posts={data.posts}
                                        id={`author-${data.id}`}
                                        type={
                                            data.customization
                                                ? data.customization
                                                      .profile_layout
                                                : 'grid'
                                        }
                                        postFn={addPosts}
                                    />
                                ) : (
                                    <Empty
                                        mainText="No Posts Found"
                                        subText="This user hasn't posted anything!"
                                        className="text-center p-4"
                                    />
                                )}
                            </main>
                        </div>
                    </div>
                    {followModal && followType === 'followers' && (
                        <FollowersModal
                            author={data.id}
                            show={followModal}
                            onCloseModal={() => setFollowModal(false)}
                        />
                    )}
                    {followModal && followType === 'following' && (
                        <div
                            onMouseEnter={(e) => {
                                console.log(followType)
                            }}
                        >
                            <FollowingModal
                                author={data.id}
                                show={followModal}
                                onCloseModal={() => setFollowModal(false)}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    )
}

export default PageAuthor
