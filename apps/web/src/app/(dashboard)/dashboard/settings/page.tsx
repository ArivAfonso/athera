'use client'

import { Label, MySwitch, AccordionInfo, Alert } from 'ui'
import { createClient } from '@/utils/supabase/client'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { useEffect, useState } from 'react'
import HorizontalFormBlockWrapper from '../edit-profile/notifications/FormWrapper'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FontSwitcher from '@/components/FontSwitcher/FontSwitcher'
import { Tab } from '@headlessui/react'

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
    }, [])

    const handleParallaxTiltChange = (enabled: boolean) => {
        setIsParallaxTiltEnabled(enabled)
        // Update the value in localStorage if available
        if (enabled) setCookie('parallaxTiltEnabled', enabled)
        else deleteCookie('parallaxTiltEnabled')
    }

    const [loading, setLoading] = useState(true)
    const [customization, setCustomization] = useState({
        profile_layout: 'grid',
        font_title: 'classic',
        font_body: 'classic',
        color: 'classic',
    })

    async function updateTheme(theme: string) {
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
            .update({ color: theme.toLowerCase() })
            .eq('author', session.user.id)
    }

    async function updateFont(font: string, type: string) {
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
            .update({ [type]: font })
            .eq('author', session.user.id)
    }

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
                    font_title: data.font_title || 'classic',
                    font_body: data.font_body || 'classic',
                    color: data.color || 'classic',
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

    async function handleSidebar(enabled: boolean) {
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
            .update({ sidebar: enabled })
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
                    <Label>Fonts</Label>
                    <div className="my-4 flex space-x-4">
                        <div className="w-1/2">
                            <FontSwitcher
                                label="Title"
                                type="font_title"
                                onFontSelect={updateFont}
                                defaultFont={customization.font_title}
                            />
                        </div>
                        <div className="w-1/2">
                            <FontSwitcher
                                label="Body"
                                type="font_body"
                                onFontSelect={updateFont}
                                defaultFont={customization.font_body}
                            />
                        </div>
                    </div>
                    {/* <Label>Theme Colors</Label>
                    <div className="my-4">
                        <ThemeSwitcher
                            defaultTheme={customization.color}
                            onFontUpdate={updateTheme}
                        />
                    </div> */}
                    <div className="md:w-[25%] w-full space-y-2">
                        <MySwitch
                            label="Sidebar"
                            onChange={(enabled) => {
                                handleSidebar(enabled)
                            }}
                        />
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
                <div className="container px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                        Settings
                    </h2>
                    <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
                        {/* Render all content directly on mobile */}
                        <div className="block lg:hidden">
                            {myData.map((tab) => (
                                <div key={tab.name} className="mb-8">
                                    <h3 className="text-2xl font-semibold mb-4">
                                        {tab.name}
                                    </h3>
                                    <hr className="border-t border-gray-300 dark:border-gray-700 mb-4" />
                                    {tab.component}
                                </div>
                            ))}
                        </div>
                        {/* Render tabs on larger screens */}
                        <div className="hidden lg:block">
                            <Tab.Group>
                                <Tab.List className="flex space-x-1 overflow-x-auto p-1">
                                    <Tab
                                        className={({ selected }) =>
                                            `w-12 py-2 text-sm leading-5 font-medium rounded-lg transition
                                            ${
                                                selected
                                                    ? 'bg-neutral-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300'
                                                    : 'text-gray-500 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300'
                                            }`
                                        }
                                    >
                                        All
                                    </Tab>
                                    {myData.map((tab) => (
                                        <Tab
                                            key={tab.name}
                                            className={({ selected }) =>
                                                `w-36 py-2 text-sm leading-5 font-medium rounded-lg transition
                                                ${
                                                    selected
                                                        ? 'bg-neutral-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300'
                                                        : 'text-gray-500 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300'
                                                }`
                                            }
                                        >
                                            {tab.name}
                                        </Tab>
                                    ))}
                                </Tab.List>
                                <Tab.Panels className="mt-2">
                                    <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 pt-6">
                                        {myData.map((tab) => (
                                            <div
                                                key={tab.name}
                                                className="mb-8"
                                            >
                                                <h3 className="text-2xl font-semibold mb-4">
                                                    {tab.name}
                                                </h3>
                                                <hr className="border-t border-gray-300 dark:border-gray-700 mb-4" />
                                                {tab.component}
                                            </div>
                                        ))}
                                    </Tab.Panel>
                                    {myData.map((tab) => (
                                        <Tab.Panel
                                            key={tab.name}
                                            className="rounded-xl bg-white dark:bg-gray-800 pt-6"
                                        >
                                            {tab.component}
                                        </Tab.Panel>
                                    ))}
                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings
