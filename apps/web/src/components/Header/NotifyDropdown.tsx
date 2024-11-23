'use client'

import { Popover, Transition } from '@/app/headlessui'
import NotificationType from '@/types/NotificationType'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { FC, Fragment, useEffect, useState } from 'react'
import Empty from '../Empty'
import stringToSlug from '@/utils/stringToSlug'

interface Props {
    className?: string
}

const NotifyDropdown: FC<Props> = ({ className = 'hidden sm:block' }) => {
    const [notifications, setNotifications] = useState<NotificationType[]>([])
    const [newNots, setNewNots] = useState<string[]>([])
    useEffect(() => {
        const fetchData = async () => {
            const cachedNotifications = localStorage.getItem('notifications')
            const cacheTime = localStorage.getItem('cacheTime')
            try {
                if (
                    cachedNotifications &&
                    cacheTime &&
                    Date.now() - Number(cacheTime) < 5 * 60 * 1000
                ) {
                    setNotifications(JSON.parse(cachedNotifications))
                    return
                } else {
                    const supabase = createClient()
                    const { data: session } = await supabase.auth.getUser()
                    let { data, error } = await supabase
                        .from('notifications')
                        .select(
                            `
                        type,
                        id,
                        notifier(name, id, username, avatar),
                        post(id, title),
                        created_at,
                        read_at
                        `
                        )
                        .eq('user_id', session.user ? session.user.id : '')
                        .order('read_at', { ascending: true })
                        .order('created_at', { ascending: false })
                        .limit(4)

                    const notData: NotificationType[] | null =
                        data as unknown as NotificationType[]

                    notData?.forEach((item) => {
                        if (item.type === 'follow') {
                            item.description = `${item.notifier.name} followed you!!`
                            item.href = `/author/${item.notifier.username}`
                        } else if (item.type === 'comment') {
                            item.description = `${item.notifier.name} commented on your post`
                            item.href = `/post/${stringToSlug(
                                item.post.title
                            )}/${item.post.id}`
                        }
                        new Date(
                            item.created_at ? item.created_at : ''
                        ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })
                        if (item.read_at == null && item.id)
                            setNewNots((prevNots) => [...prevNots, item.id])
                    })
                    if (notData) {
                        localStorage.setItem(
                            'notifications',
                            JSON.stringify(notData)
                        )
                        localStorage.setItem('cacheTime', Date.now().toString())
                    }
                    setNotifications(notData || [])
                }
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function markAllasRead() {
        // All ids in the newNots array are marked as read
        const supabase = createClient()
        const { data: session } = await supabase.auth.getUser()
        if (!session.user) return
        const { data, error } = await supabase
            .from('notifications')
            .update({ read_at: new Date().toISOString() })
            .eq('user_id', session.user.id)
            .in('id', newNots)
        if (error) {
            console.error(error)
        }
        setNewNots([])
    }

    useEffect(() => {
        markAllasRead()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={className}>
            <Popover className="relative">
                {({ open }) => {
                    return (
                        <>
                            <Popover.Button
                                className={`
                ${open ? '' : 'text-opacity-90'}
                 group  p-3 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full inline-flex items-center text-base font-medium hover:text-opacity-100
                  focus:outline-none relative`}
                            >
                                {newNots[0] && (
                                    <span className="w-2 h-2 bg-blue-500 absolute top-2 right-2 rounded-full"></span>
                                )}
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M12 6.43994V9.76994"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeMiterlimit="10"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M12.02 2C8.34002 2 5.36002 4.98 5.36002 8.66V10.76C5.36002 11.44 5.08002 12.46 4.73002 13.04L3.46002 15.16C2.68002 16.47 3.22002 17.93 4.66002 18.41C9.44002 20 14.61 20 19.39 18.41C20.74 17.96 21.32 16.38 20.59 15.16L19.32 13.04C18.97 12.46 18.69 11.43 18.69 10.76V8.66C18.68 5 15.68 2 12.02 2Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeMiterlimit="10"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M15.33 18.8201C15.33 20.6501 13.83 22.1501 12 22.1501C11.09 22.1501 10.25 21.7701 9.65004 21.1701C9.05004 20.5701 8.67004 19.7301 8.67004 18.8201"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeMiterlimit="10"
                                    />
                                </svg>
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute z-10 w-screen max-w-xs sm:max-w-sm px-4 mt-3 -right-28 sm:right-0 sm:px-0">
                                    <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
                                        <div className="relative grid gap-8 bg-white dark:bg-neutral-800 p-7">
                                            {!notifications[0] ? (
                                                <Empty
                                                    mainText="No Notifications Found"
                                                    subText="You haven't got any notifications yet"
                                                    className="text-center p-4"
                                                />
                                            ) : (
                                                <>
                                                    <a
                                                        href="/notifications"
                                                        className="text-xl font-semibold underline"
                                                    >
                                                        Notifications
                                                    </a>
                                                    {notifications.map(
                                                        (item, index) => (
                                                            <a
                                                                key={index}
                                                                href={item.href}
                                                                className="flex p-2 pr-8 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 relative"
                                                            >
                                                                <Image
                                                                    className="rounded-full w-8 h-8 sm:w-12 sm:h-12"
                                                                    src={
                                                                        item
                                                                            .notifier
                                                                            .avatar
                                                                    }
                                                                    alt="avatar"
                                                                    // layout="fixed"
                                                                    width={120}
                                                                    height={120}
                                                                />
                                                                <div className="ml-3 sm:ml-4 space-y-1">
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                                        {
                                                                            item
                                                                                .notifier
                                                                                .name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                                                        {
                                                                            item.description
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 dark:text-gray-400">
                                                                        {new Date(
                                                                            item.created_at
                                                                                ? item.created_at
                                                                                : ''
                                                                        ).toLocaleDateString(
                                                                            'en-US',
                                                                            {
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                                day: 'numeric',
                                                                            }
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                {item.read_at ==
                                                                    null && (
                                                                    <span className="absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></span>
                                                                )}
                                                            </a>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )
                }}
            </Popover>
        </div>
    )
}

export default NotifyDropdown
