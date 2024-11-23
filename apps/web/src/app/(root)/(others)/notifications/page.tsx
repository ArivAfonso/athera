'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Empty from '@/components/Empty'
import NotificationType from '@/types/NotificationType'
import stringToSlug from '@/utils/stringToSlug'
import { Heading2 } from 'ui'
import { TrashIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const NotificationsPage = ({}) => {
    const supabase = createClient()

    let [notifications, setNotifications] = useState<NotificationType[] | null>(
        null
    )

    const router = useRouter()

    useEffect(() => {
        const fetchNotifications = async () => {
            // Check for local notifications
            const localNotifications = JSON.parse(
                localStorage.getItem('notifications') || '[]'
            )
            if (localNotifications) {
                setNotifications(localNotifications)
            } else {
                const { data: session } = await supabase.auth.getUser()

                if (!session.user) {
                    router.push('/login')
                    return
                }

                const { data } = await supabase
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

                //@ts-ignore
                setNotifications(data || [])
            }
        }

        fetchNotifications()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    notifications?.forEach((item) => {
        if (item.type === 'follow') {
            item.description = `${item.notifier.name} Followed you!!`
            item.href = `/author/${item.notifier.username}`
        } else if (item.type === 'comment') {
            item.description = `${item.notifier.name} Commented on your post`
            item.href = `/post/${stringToSlug(item.post.title)}/${item.post.id}`
        }
        new Date(item.created_at ? item.created_at : '').toLocaleDateString(
            'en-US',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }
        )
        // if (item.read_at == null && item.id)
        //     setNewNots((prevNots) => [...prevNots, item.id])
    })

    async function deleteNotification(event: React.MouseEvent, id: string) {
        // Prevent the event from propagating to the parent
        event.stopPropagation()

        // Delete local notification
        const localNotifications = JSON.parse(
            localStorage.getItem('notifications') || '[]'
        )
        if (localNotifications) {
            localStorage.setItem(
                'notifications',
                JSON.stringify(
                    localNotifications.filter(
                        (notification: NotificationType) =>
                            notification.id !== id
                    )
                )
            )
        }

        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting notification: ', error)
        } else {
            // Remove the notification from the UI
            setNotifications(
                notifications?.filter(
                    (notification) => notification.id !== id
                ) || null
            )
        }
    }

    return (
        <>
            <title>Your Notifications - Athera</title>
            <div className="p-4">
                <div>
                    {notifications?.length === 0 ? (
                        <Empty
                            mainText="No Notifications Found"
                            subText="You haven't got any notifications yet"
                            className="text-center p-4"
                        />
                    ) : (
                        <>
                            <header className="text-center max-w-2xl mx-auto mb-7 sm:mb-8 lg:mb-10">
                                <Heading2>Notifications</Heading2>
                                <span className="block text-sm mt-2 text-neutral-700 sm:text-base dark:text-neutral-200">
                                    Here are some things you might want to know
                                    about
                                </span>
                            </header>
                            <div className="space-y-4 sm:mx-4 lg:mx-64">
                                {notifications?.map((notification, index) => (
                                    <a
                                        key={index}
                                        href={notification.href}
                                        className="flex items-center p-2 pr-8 sm:p-4 sm:pr-8 -m-3 transition duration-150 ease-in-out rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 relative"
                                    >
                                        <Image
                                            className="rounded-full w-8 h-8 sm:w-16 sm:h-16"
                                            src={notification.notifier.avatar}
                                            alt="avatar"
                                            width={120}
                                            height={120}
                                            layout="fixed"
                                        />
                                        <div className="ml-1 sm:ml-4 lg:space-y-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                {notification.notifier.name}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                                {notification.description}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-400">
                                                {new Date(
                                                    notification.created_at
                                                        ? notification.created_at
                                                        : ''
                                                ).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(event) =>
                                                deleteNotification(
                                                    event,
                                                    notification.id
                                                )
                                            }
                                            className="ml-auto p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <TrashIcon className="w-5 h-5 text-red-500" />
                                        </button>
                                        {notification.read_at == null && (
                                            <span className="absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></span>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>{' '}
        </>
    )
}

export default NotificationsPage
