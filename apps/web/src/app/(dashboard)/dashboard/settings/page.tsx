'use client'

import { Label, MySwitch, AccordionInfo, Alert } from 'ui'
import { createClient } from '@/utils/supabase/client'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

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
        <>
            <title>Settings - Athera</title>
            <div className="max-w-4xl mx-auto sm:pt-26 pb-24 lg:pb-32">
                <div className="container px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-semibold my-6">
                        Settings
                    </h2>
                    <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
                        <div>
                            <hr className="border-t border-gray-300 dark:border-gray-700 mb-4" />
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
                                            updateSettings(
                                                'profile_layout',
                                                'magazine'
                                            )
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
                                            updateSettings(
                                                'profile_layout',
                                                'grid'
                                            )
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
                                            updateSettings(
                                                'profile_layout',
                                                'stacked'
                                            )
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
                                    <button
                                        className={`p-4 rounded-lg focus:border-2 ${customization.profile_layout === 'modern_magazine' ? 'border-2 border-blue-500 dark:border-blue-800' : 'border-[1px] border-gray-300 dark:border-gray-700'} dark:focus:border-blue-500 focus:border-blue-500  dark:border-gray-700`}
                                        onClick={() => {
                                            setCustomization({
                                                ...customization,
                                                profile_layout:
                                                    'modern_magazine',
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
                                            updateSettings(
                                                'profile_layout',
                                                'modern_grid'
                                            )
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
                                {/* <div className="md:w-[25%] w-full space-y-2">
                                    <MySwitch
                                        label="Sidebar"
                                        onChange={(enabled) => {
                                            handleSidebar(enabled)
                                        }}
                                    />
                                </div> */}
                            </>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings
