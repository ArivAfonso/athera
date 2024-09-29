'use client'

import { useEffect, useState } from 'react'
import { Label } from 'ui'
import { createClient } from '@/utils/supabase/client'
import { update } from 'lodash'

export function CustomizationPage() {
    const [loading, setLoading] = useState(true)
    const [customization, setCustomization] = useState({
        profile_layout: 'grid',
    })

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()
            const { data: session } = await supabase.auth.getUser()

            const { data, error } = await supabase
                .from('customization')
                .select('*')
                .eq('author', session.user?.id)
                .single()

            setCustomization(data)
            setLoading(false)
        }
        fetchData()
    }, [])

    async function updateSettings(type: string, value: string) {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getUser()

        await supabase
            .from('customization')
            .update({ [type]: value })
            .eq('author', session.user?.id)
    }

    return (
        <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
            {loading ? (
                <></>
            ) : (
                <>
                    <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row pb-8">
                        <h2 className="text-2xl sm:text-3xl font-semibold">
                            Customization
                        </h2>
                    </div>
                    <Label>Profile Page Layout</Label>
                    <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-y-8 gap-x-28 lg:gap-x-16">
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
                </>
            )}
        </div>
    )
}

export default CustomizationPage
