'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface SourceSuggestion {
    id: number
    name: string
    description: string
    url: string
    sitemap: string
    logo?: string | null
    banner?: string | null
}

export default function DashboardMySources() {
    const [sources, setSources] = useState<SourceSuggestion[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchSources() {
            const supabase = createClient()
            // Fetch current user
            const { data: userData, error: userError } =
                await supabase.auth.getUser()
            if (userError || !userData.user) {
                setError('User not logged in')
                setLoading(false)
                return
            }
            const userId = userData.user.id

            // Fetch sources filtered by user_id
            const { data, error } = await supabase
                .from('source_suggestions')
                .select('*')
                .eq('user_id', userId)
            if (error) {
                setError('Failed to fetch sources')
            } else {
                setSources(data)
            }
            setLoading(false)
        }
        fetchSources()
    }, [])

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Suggested Sources</h1>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Logo</th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">
                                    Description
                                </th>
                                <th className="py-2 px-4 border-b">URL</th>
                                <th className="py-2 px-4 border-b">Sitemap</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sources.map((source) => (
                                <tr
                                    key={source.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <td className="py-2 px-4 border-b">
                                        {source.logo ? (
                                            <img
                                                src={source.logo}
                                                alt={`${source.name} logo`}
                                                className="h-10 w-10 object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-gray-400">
                                                N/A
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {source.name}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {source.description}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <a
                                            href={source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {source.url}
                                        </a>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <a
                                            href={source.sitemap}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {source.sitemap}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            {sources.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center py-4"
                                    >
                                        No sources found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
