'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import SourceType from '@/types/SourceType'
import { Search, Globe, Users, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import stringToSlug from '@/utils/stringToSlug'

const SourcesListPage = () => {
    const [sources, setSources] = useState<SourceType[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredSources = searchTerm
        ? sources.filter(
              (source) =>
                  source.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  (source.description &&
                      source.description
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()))
          )
        : sources

    useEffect(() => {
        const fetchSources = async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('sources')
                .select('*, newsCount:news(count)')
            if (error) {
                console.error('Error fetching sources:', error)
            } else if (data) {
                setSources(data as SourceType[])
            }
            setLoading(false)
        }
        fetchSources()
    }, [])

    return (
        <>
            <div className="relative">
                <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                <div className="absolute inset-0 backdrop-blur-[2px]"></div>
                <div className="container mx-auto py-16 px-4 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-center drop-shadow-md">
                        Discover News Sources
                    </h1>
                    <p className="text-xl  text-center mt-4 max-w-2xl mx-auto backdrop-blur-sm">
                        Browse our curated collection of trusted news sources
                        from around the world
                    </p>

                    <div className="max-w-md mx-auto mt-8 relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                        <input
                            type="text"
                            placeholder="Search sources..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/20 dark:border-gray-700/30 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white shadow-lg transition-all"
                        />
                    </div>
                </div>
            </div>

            <main className="container mx-auto p-4 py-12">
                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm rounded-xl p-6 shadow-lg animate-pulse border border-gray-200/50 dark:border-gray-800/50"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="h-16 w-16 bg-gray-300/70 dark:bg-gray-700/70 rounded-full"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-300/70 dark:bg-gray-700/70 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200/70 dark:bg-gray-800/70 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="h-3 bg-gray-200/70 dark:bg-gray-800/70 rounded w-full"></div>
                                    <div className="h-3 bg-gray-200/70 dark:bg-gray-800/70 rounded w-5/6"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredSources.length === 0 ? (
                    <div className="text-center py-12 max-w-md mx-auto backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 rounded-xl shadow-lg border border-white/20 dark:border-gray-800/30 p-8">
                        <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            No sources found
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            {searchTerm
                                ? `No sources matching "${searchTerm}"`
                                : "We couldn't find any sources to display."}
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
                            Showing {filteredSources.length}{' '}
                            {filteredSources.length === 1
                                ? 'source'
                                : 'sources'}
                            {searchTerm && ` for "${searchTerm}"`}
                        </p>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredSources.map((source) => (
                                <Link
                                    href={`/source/${source.id}`}
                                    key={source.id}
                                    className="group bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-white/20 dark:border-gray-800/30 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:translate-y-[-4px]"
                                >
                                    <div className="h-24 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 dark:from-blue-700/80 dark:to-indigo-800/80 relative overflow-hidden">
                                        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
                                        {source.background ? (
                                            <img
                                                src={source.background}
                                                alt=""
                                                className="w-full h-full object-cover opacity-50"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 dark:from-black/10 to-transparent"></div>
                                    </div>

                                    <div className="p-6 pt-0 -mt-10 relative">
                                        <div className="flex flex-col items-center mb-4">
                                            <div className="flex-shrink-0 rounded-full p-0.5 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md shadow-lg mb-3 border border-white/50 dark:border-gray-700/50 ring-2 ring-white/20 dark:ring-black/20">
                                                <img
                                                    src={
                                                        source.image ||
                                                        'https://placehold.co/100x100?text=' +
                                                            source.name.charAt(
                                                                0
                                                            )
                                                    }
                                                    alt={source.name}
                                                    className="h-16 w-16 object-cover bg-gray-100 rounded-full"
                                                    onError={(e) => {
                                                        ;(
                                                            e.target as HTMLImageElement
                                                        ).onerror = null
                                                        ;(
                                                            e.target as HTMLImageElement
                                                        ).src =
                                                            'https://placehold.co/100x100?text=' +
                                                            source.name.charAt(
                                                                0
                                                            )
                                                    }}
                                                />
                                            </div>
                                            <div className="text-center">
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {source.name}
                                                </h2>
                                            </div>
                                        </div>

                                        {source.description && (
                                            <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
                                                {source.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 mr-1" />
                                                <span>
                                                    {source.followerCount || 0}{' '}
                                                    followers
                                                </span>
                                            </div>

                                            {source.newsCount &&
                                                source.newsCount.length > 0 && (
                                                    <div>
                                                        {source.newsCount[0]
                                                            ?.count || 0}{' '}
                                                        articles
                                                    </div>
                                                )}
                                        </div>

                                        {source.url && (
                                            <div className="flex items-center mt-4 text-blue-600 dark:text-blue-400 font-medium p-2 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-100/30 dark:border-blue-800/30">
                                                <Globe className="h-4 w-4 mr-1" />
                                                <span className="mr-1">
                                                    Visit website
                                                </span>
                                                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </>
    )
}

export default SourcesListPage
