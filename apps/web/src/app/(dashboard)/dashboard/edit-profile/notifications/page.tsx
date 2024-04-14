'use client'

import { useEffect, useState } from 'react'
import HorizontalFormBlockWrapper from './FormWrapper'
import { RadioGroup, Switch } from '@headlessui/react'
import MySwitch from '@/components/MySwitch/MySwitch'
import Radio from '@/components/Radio/Radio'
import Checkbox from '@/components/Checkbox/Checkbox'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface NotificationSettings {
    comments: ('None' | 'In App' | 'Email')[]
    likes: ('None' | 'In App' | 'Email')[]
    new_follower: ('None' | 'In App' | 'Email')[]
    following_post: ('None' | 'In App' | 'Email')[]
    scheduled_post: ('None' | 'In App' | 'Email')[]
    likes_milestones: ('None' | 'In App' | 'Email')[]
    comments_milestones: ('None' | 'In App' | 'Email')[]
    followers_milestones: ('None' | 'In App' | 'Email')[]
    published_posts_milestones: ('None' | 'In App' | 'Email')[]
}

const generalOptions = [
    {
        title: 'My scheduled post is published',
    },
    {
        title: 'Someone comments on my post',
    },
    {
        title: 'Someone likes my post',
    },
    {
        title: 'Someone follows me',
    },
]

async function getSettings(): Promise<NotificationSettings> {
    const supabase = createClient()
    const { data: session } = await supabase.auth.getSession()

    if (!session.session) {
        //@ts-ignore
        return null
    }

    const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', session.session.user.id)
        .single()

    return data
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
            <HorizontalFormBlockWrapper
                title="General notifications"
                description="Select when you’ll be notified when the following changes occur."
                descriptionClassName="max-w-[344px]"
            >
                <div className="col-span-2">
                    {generalOptions.map((opt, index) => (
                        <div
                            key={`generalopt-${index}`}
                            className="flex items-center justify-between border-b border-muted border-gray-300 dark:border-neutral-700 py-6 last:border-none last:pb-0"
                        >
                            <h3 className="text-sm font-medium dark:text-gray-300 text-gray-900">
                                {opt.title}
                            </h3>
                            <ButtonGroup
                                onChange={(option) =>
                                    handleSettingChange(opt.title, option)
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
                <div className="w-[25%] space-y-2">
                    <MySwitch label="Do not notify me" />
                    <MySwitch label="Mentions only" />
                    <MySwitch label="All comments" />
                </div>
            </HorizontalFormBlockWrapper>
            <HorizontalFormBlockWrapper
                title="Milestones"
                description="These are notifications for when you reach a milestone."
                descriptionClassName="max-w-[344px]"
            >
                <div className="col-span-2">
                    <Checkbox
                        name="app_notification"
                        label="Likes"
                        className="mb-5"
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
        </div>
    )
}

const options = ['None', 'In App', 'Email']

function ButtonGroup({ onChange }: { onChange: (option: string) => void }) {
    const [selected, setSelected] = useState<string>()
    function handleOnClick(option: string) {
        setSelected(option)
        onChange && onChange(option)
    }

    return (
        <div className="inline-flex gap-1">
            {options.map((option) => (
                <button
                    key={option}
                    className="rounded-md bg-transparent border border-gray-300 dark:border-neutral-700 py-3 px-4 sm:py-3.5 sm:px-6 hover:bg-neutral-100 hover:dark:bg-neutral-700"
                    onClick={() => handleOnClick(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    )
}
