'use client'

import { useEffect, useState } from 'react'
import HorizontalFormBlockWrapper from './FormWrapper'
import { Checkbox, MySwitch } from 'ui'
import { createClient } from '@/utils/supabase/client'
import { redirect, useRouter } from 'next/navigation'

interface NotificationSettings {
    comments: ('None' | 'In App' | 'Email')[]
    likes: ('None' | 'In App' | 'Email')[]
    new_follower: ('None' | 'In App' | 'Email')[]
    following_post: ('None' | 'In App' | 'Email')[]
}

const generalOptions = [
    {
        title: 'My scheduled post is published',
        id: 'scheduled_posts',
    },
    {
        title: 'Someone comments on my post',
        id: 'comments',
    },
    {
        title: 'Someone likes my post',
        id: 'likes',
    },
    {
        title: 'Someone follows me',
        id: 'new_follower',
    },
]

async function getSettings(): Promise<NotificationSettings> {
    const supabase = createClient()
    const { data: session } = await supabase.auth.getUser()

    if (!session.user) {
        redirect('/login')
    }

    const { data } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

    if (data) {
        return {
            comments: data.comments as ('None' | 'In App' | 'Email')[],
            likes: data.likes as ('None' | 'In App' | 'Email')[],
            new_follower: data.new_follower as ('None' | 'In App' | 'Email')[],
            following_post: data.following_post as (
                | 'None'
                | 'In App'
                | 'Email'
            )[],
        }
    } else {
        return {
            comments: ['None'],
            likes: ['None'],
            new_follower: ['None'],
            following_post: ['None'],
        }
    }
}

export default function NotificationSettingsView() {
    const [settings, setSettings] = useState<NotificationSettings>()
    const router = useRouter()

    function handleSettingChange(setting: string, newValue: string) {
        console.log(setting, newValue)
    }

    useEffect(() => {
        async function fetchSettings() {
            const settings = await getSettings()
            if (!settings) {
                router.push('/login')
                return
            }
            setSettings(settings)
        }

        fetchSettings()
    }, [])

    return (
        <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
            <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row pb-8">
                <h2 className="text-2xl sm:text-3xl font-semibold">
                    Notification Settings
                </h2>
            </div>
            {!settings ? (
                <div className="text-center">
                    <p>You need to be logged in to access this page.</p>
                    <p>
                        <a href="/login" className="text-blue-500">
                            Login
                        </a>
                    </p>
                </div>
            ) : (
                <>
                    <HorizontalFormBlockWrapper
                        title="General notifications"
                        description="Select when you’ll be notified when the following changes occur."
                        descriptionClassName="max-w-[344px]"
                    >
                        <div className="col-span-2">
                            {generalOptions.map((opt, index) => (
                                <div
                                    key={`generalopt-${index}`}
                                    className="md:flex md:items-center justify-between border-b border-muted border-gray-300 dark:border-neutral-700 py-6 last:border-none last:pb-0"
                                >
                                    <h3 className="text-sm font-medium pb-3 md:pb-0 dark:text-gray-300 text-gray-900">
                                        {opt.title}
                                    </h3>
                                    <ButtonGroup
                                        setting={
                                            settings
                                                ? //@ts-ignore
                                                  settings[opt.id]
                                                : undefined
                                        }
                                        id={opt.id}
                                        onChange={(option) =>
                                            handleSettingChange(
                                                opt.title,
                                                option
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </HorizontalFormBlockWrapper>
                    <HorizontalFormBlockWrapper
                        title="Comments"
                        description="These are notifications for comments on your posts and replies to your comments."
                        descriptionClassName="max-w-[344px]"
                    >
                        <div className="md:w-[25%] w-full space-y-2">
                            <MySwitch label="Do not notify me" />
                            <MySwitch label="Mentions only" />
                            <MySwitch label="All comments" />
                        </div>
                    </HorizontalFormBlockWrapper>
                    {/* <HorizontalFormBlockWrapper
                        title="Milestones"
                        description="These are notifications for when you reach a milestone."
                        descriptionClassName="max-w-[344px]"
                    >
                        <div className="col-span-2">
                            <Checkbox
                                name="app_notification"
                                label="Likes"
                                className="mb-5"
                                onChange={(e) => {
                                    console.log(e)
                                }}
                            />
                            <Checkbox
                                name="app_notification"
                                label="Comments"
                                className="mb-5"
                            />
                            <Checkbox
                                name="app_notification"
                                label="Followers"
                                className="mb-5"
                            />
                            <Checkbox
                                name="app_notification"
                                label="Published Posts"
                                className="mb-5"
                            />
                        </div>
                    </HorizontalFormBlockWrapper>
                    */}
                </>
            )}
        </div>
    )
}

const options = ['None', 'In App', 'Email']

function ButtonGroup({
    onChange,
    setting,
    id,
}: {
    onChange: (option: string) => void
    setting: string
    id: string
}) {
    async function handleOnClick(option: string) {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getUser()

        if (!session.user) {
            return
        }

        await supabase
            .from('notification_settings')
            .update({ [id]: [option] })
            .eq('user_id', session.user.id)
            .select('*')
    }

    const [mySetting, setMySetting] = useState(setting[0])
    return (
        <div className="inline-flex gap-1">
            {options.map((option) => (
                <button
                    key={option}
                    className={`rounded-md border border-gray-300 dark:border-neutral-700 py-3 px-4 sm:py-3.5 sm:px-6 hover:bg-neutral-100 hover:dark:bg-neutral-700 focus:bg-neutral-200 focus:dark:bg-neutral-900 ${mySetting === option ? 'bg-neutral-200 dark:bg-neutral-900' : 'bg-transparent'}`}
                    onClick={() => {
                        handleOnClick(option)
                        setMySetting(option)
                    }}
                >
                    {option}
                </button>
            ))}
        </div>
    )
}
