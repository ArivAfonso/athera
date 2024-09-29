'use client'

import { Label, MySwitch, AccordionInfo, Checkbox, Alert } from 'ui'
import { createClient } from '@/utils/supabase/client'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { useEffect, useState } from 'react'
import HorizontalFormBlockWrapper from '../edit-profile/notifications/FormWrapper'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher'

interface NotificationSettings {
    comments: string[]
    likes: string[]
    new_follower: string[]
    following_post: string[]
    scheduled_post: string[]
    likes_milestones: string[]
    comments_milestones: string[]
    followers_milestones: string[]
    published_posts_milestones: string[]
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

async function getSettings(): Promise<NotificationSettings | null> {
    const supabase = createClient()
    const { data: session } = await supabase.auth.getUser()

    if (!session.user) {
        return null
    }

    const { data } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

    if (!data) {
        return null
    }

    return {
        comments: data.comments,
        likes: data.likes,
        new_follower: data.new_follower,
        following_post: data.following_post,
        scheduled_post: data.scheduled_posts,
        likes_milestones: data.likes_milestone,
        comments_milestones: data.comments_milestone,
        followers_milestones: data.followers_milestone,
        published_posts_milestones: data.published_posts_milestones,
    }
}

function Settings() {
    const [isParallaxTiltEnabled, setIsParallaxTiltEnabled] = useState(false)

    useEffect(() => {
        const storedParallaxTiltEnabled = getCookie('parallaxTiltEnabled')
        if (storedParallaxTiltEnabled !== null) {
            setIsParallaxTiltEnabled(storedParallaxTiltEnabled === 'true')
        }
    }, []) // Empty dependency array to run the effect only once on mount

    const handleParallaxTiltChange = (enabled: boolean) => {
        setIsParallaxTiltEnabled(enabled)
        // Update the value in localStorage if available
        if (enabled) setCookie('parallaxTiltEnabled', enabled)
        else deleteCookie('parallaxTiltEnabled')
    }

    const [loading, setLoading] = useState(true)
    const [customization, setCustomization] = useState({
        profile_layout: 'grid',
    })

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()
            const { data: session } = await supabase.auth.getUser()

            if (!session.user) {
                toast.custom((t) => (
                    <Alert
                        type="danger"
                        message="You need to be logged in to access this page."
                    />
                ))
                return
            }

            const { data, error } = await supabase
                .from('customization')
                .select('*')
                .eq('author', session.user?.id)
                .single()

            if (data) {
                setCustomization({
                    profile_layout: data.profile_layout || 'grid',
                })
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    async function updateSettings(type: string, value: string) {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getUser()

        if (!session.user) {
            toast.custom((t) => (
                <Alert
                    type="danger"
                    message="You need to be logged in to access this page."
                />
            ))
            return
        }

        await supabase
            .from('customization')
            .update({ [type]: value })
            .eq('author', session.user.id)
    }

    const options = ['None', 'In App']

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

        const [mySetting, setMySetting] = useState(setting)
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

    const myData = [
        {
            name: 'User Interface',
            component: (
                <>
                    <MySwitch
                        enabled={isParallaxTiltEnabled}
                        label="Post Wiggling"
                        desc="All post cards will have a parallax tilt effect on hover"
                        onChange={handleParallaxTiltChange}
                    />
                </>
            ),
        },
        {
            name: 'Customization',
            component: (
                <>
                    <Label>Profile Page Layout</Label>
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-y-8 gap-x-28 lg:gap-x-16 mb-4">
                        <button
                            className={`p-4 rounded-lg focus:border-2 ${customization.profile_layout === 'magazine' ? 'border-2 border-blue-500 dark:border-blue-800' : 'border-[1px] border-gray-300 dark:border-gray-700'} dark:focus:border-blue-500 focus:border-blue-500 `}
                            onClick={() => {
                                setCustomization({
                                    ...customization,
                                    profile_layout: 'magazine',
                                })
                                updateSettings('profile_layout', 'magazine')
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <div>
                                    <div className="w-48 h-20 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800"></div>
                                    <div className="w-32 h-3 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-1"></div>
                                </div>
                                <div className="flex space-x-4">
                                    <div>
                                        <div className="w-[88px] h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                        <div className="w-16 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-1"></div>
                                        <div className="w-8 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-1"></div>
                                    </div>
                                    <div>
                                        <div className="w-[88px] h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                        <div className="w-16 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-1"></div>
                                        <div className="w-8 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-1"></div>
                                    </div>
                                </div>
                            </div>
                        </button>
                        <button
                            className={`p-4 rounded-lg focus:border-2 ${customization.profile_layout === 'grid' ? 'border-2 border-blue-500 dark:border-blue-800' : 'border-[1px] border-gray-300 dark:border-gray-700'} dark:focus:border-blue-500 focus:border-blue-500 `}
                            onClick={() => {
                                setCustomization({
                                    ...customization,
                                    profile_layout: 'grid',
                                })
                                updateSettings('profile_layout', 'grid')
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="w-[88px] h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                        <div className="w-16 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-1"></div>
                                        <div className="w-8 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-1"></div>
                                    </div>
                                    <div>
                                        <div className="w-[88px] h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                        <div className="w-16 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-1"></div>
                                        <div className="w-8 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-1"></div>
                                    </div>
                                    <div>
                                        <div className="w-[88px] h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                        <div className="w-16 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-1"></div>
                                        <div className="w-8 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-1"></div>
                                    </div>
                                    <div>
                                        <div className="w-[88px] h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                        <div className="w-16 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-1"></div>
                                        <div className="w-8 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-1"></div>
                                    </div>
                                </div>
                            </div>
                        </button>
                        <button
                            className={`p-4 rounded-lg focus:border-2 ${customization.profile_layout === 'stacked' ? 'border-2 border-blue-500 dark:border-blue-800' : 'border-[1px] border-gray-300 dark:border-gray-700'} dark:focus:border-blue-500 focus:border-blue-500 `}
                            onClick={() => {
                                setCustomization({
                                    ...customization,
                                    profile_layout: 'stacked',
                                })
                                updateSettings('profile_layout', 'stacked')
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <div className="flex space-x-2">
                                    <div>
                                        <div className="w-24 h-3 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                        <div className="w-16 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                    </div>
                                    <div className="w-20 h-14 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                </div>
                                <div className="flex space-x-2">
                                    <div>
                                        <div className="w-24 h-3 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-3"></div>
                                        <div className="w-16 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                    </div>
                                    <div className="w-20 h-14 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-3"></div>
                                </div>
                                <div className="flex space-x-2">
                                    <div>
                                        <div className="w-24 h-3 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-3"></div>
                                        <div className="w-16 h-2 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                    </div>
                                    <div className="w-20 h-14 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-3"></div>
                                </div>
                            </div>
                        </button>
                        {/* </div>
            <div className="flex justify-center space-x-10"> */}
                        <button
                            className={`p-4 rounded-lg focus:border-2 ${customization.profile_layout === 'modern_magazine' ? 'border-2 border-blue-500 dark:border-blue-800' : 'border-[1px] border-gray-300 dark:border-gray-700'} dark:focus:border-blue-500 focus:border-blue-500  dark:border-gray-700`}
                            onClick={() => {
                                setCustomization({
                                    ...customization,
                                    profile_layout: 'modern_magazine',
                                })
                                updateSettings(
                                    'profile_layout',
                                    'modern_magazine'
                                )
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-48 h-20 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800"></div>
                                <div className="flex space-x-4">
                                    <div>
                                        <div className="w-[88px] h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                    </div>
                                    <div>
                                        <div className="w-[88px] h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <div>
                                        <div className="w-[88px] h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                    </div>
                                    <div>
                                        <div className="w-[88px] h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800 mt-2"></div>
                                    </div>
                                </div>
                            </div>
                        </button>
                        <button
                            className={`p-4 rounded-lg focus:border-2 ${customization.profile_layout === 'modern_grid' ? 'border-2 border-blue-500 dark:border-blue-800' : 'border-[1px] border-gray-300 dark:border-gray-700'} dark:focus:border-blue-500 focus:border-blue-500`}
                            onClick={() => {
                                setCustomization({
                                    ...customization,
                                    profile_layout: 'modern_grid',
                                })
                                updateSettings('profile_layout', 'modern_grid')
                            }}
                        >
                            <div className="flex items-center justify-center h-full">
                                <div className="grid grid-cols-2 gap-3 items-center">
                                    <div className="w-24 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800"></div>
                                    <div className="w-24 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800"></div>
                                    <div className="w-24 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800"></div>
                                    <div className="w-24 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800"></div>
                                    <div className="w-24 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800"></div>
                                    <div className="w-24 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-800"></div>
                                </div>
                            </div>
                        </button>
                    </div>
                    <Label>Profile Page Layout</Label>
                    <div className="mt-4">
                        <ThemeSwitcher />
                    </div>
                </>
            ),
        },
        {
            name: 'Notifications',
            component: (
                <div className="max-w-4xl mx-auto">
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
                            {/* <HorizontalFormBlockWrapper
                                title="Comments"
                                description="These are notifications for comments on your posts and replies to your comments."
                                descriptionClassName="max-w-[344px]"
                            >
                                <div className="md:w-[50%] w-full space-y-2">
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
                            </HorizontalFormBlockWrapper> */}
                        </>
                    )}
                </div>
            ),
        },
    ]

    return (
        <>
            <title>Settings - Athera</title>
            <div className="max-w-4xl mx-auto sm:pt-26 pb-24 lg:pb-32">
                <div className="container">
                    <div className="my-8 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
                        {/* HEADING */}
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="text-3xl sm:text-4xl font-semibold">
                                Settings
                            </h2>
                            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                                You can customize the way Athera looks and
                                behaves here
                            </span>
                        </div>
                    </div>
                    <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
                        {/* ---- */}
                        <AccordionInfo defaultOpen={true} data={myData} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings
