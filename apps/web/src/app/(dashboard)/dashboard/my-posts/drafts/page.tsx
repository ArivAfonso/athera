'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import ModalDeletePost from '../ModalDeletePost'
import { useRouter } from 'next/navigation'
import DraftType from '@/types/DraftType'
import LoadingDrafts from './loading'
import { SearchIcon } from 'lucide-react'
import { debounce } from 'lodash'
import DraftsTable from '@/components/PostsTable/DraftsTable'

const DashboardDrafts = () => {
    const [drafts, setDrafts] = React.useState<DraftType[]>([])
    const [myDrafts, setMyDrafts] = React.useState<DraftType[]>([])
    const router = useRouter()
    const [draftHasTopic, setDraftHasTopic] = React.useState(false)
    const [loading, setLoading] = React.useState(true)

    const [showDeleteModal, setShowDeleteModal] = React.useState(false)
    const [draftIdToDelete, setDraftIdToDelete] = React.useState('')

    useEffect(() => {
        async function fetchData() {
            try {
                const supabase = createClient()
                const { data: session } = await supabase.auth.getUser()

                // Fetch the drafts
                const { data: draftData, error: draftError } = await supabase
                    .from('drafts')
                    .select(
                        `id, title, created_at, estimatedReadingTime, edited_at, image, draft_topics(topic:topics(id,name,color))`
                    )
                    .eq('author', session.user?.id)

                draftData?.forEach((item) => {
                    item.created_at = new Date(
                        item.created_at ? item.created_at : ''
                    ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                    item.edited_at = new Date(
                        item.edited_at ? item.edited_at : ''
                    ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                    if (item.draft_topics[0]) {
                        setDraftHasTopic(true)
                    }
                })
                //@ts-ignore
                setDrafts(draftData)
                //@ts-ignore
                setMyDrafts(draftData)
                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addPosts = async (pageParam: number) => {
        try {
            const supabase = createClient()
            const { data: session } = await supabase.auth.getUser()

            // Fetch the drafts
            const { data: draftData, error: draftError } = await supabase
                .from('drafts')
                .select(
                    `id, title, created_at, estimatedReadingTime, edited_at, image, draft_topics(topic:topics(id,name,color))`
                )
                .eq('author', session.user?.id)
                .range(pageParam * 24, (pageParam + 1) * 24 - 1)

            draftData?.forEach((item) => {
                item.created_at = new Date(
                    item.created_at ? item.created_at : ''
                ).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
                item.edited_at = new Date(
                    item.edited_at ? item.edited_at : ''
                ).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
                if (item.draft_topics[0]) {
                    setDraftHasTopic(true)
                }
            })
            return draftData as unknown as DraftType[]
        } catch (err) {
            console.log(err)
        }
    }

    const fetchDrafts = debounce(async (inputValue: String) => {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getUser()

        const { data, error } = await supabase
            .from('drafts')
            .select(
                `id, title, created_at, estimatedReadingTime, edited_at, image, draft_topics(topic:topics(id,name,color))`
            )
            .ilike('title', `${inputValue}%`)
            .eq('author', session.user?.id)

        data?.forEach((item) => {
            item.created_at = new Date(
                item.created_at ? item.created_at : ''
            ).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        })

        if (error) {
            return
        }

        //@ts-ignore
        setPosts(data)
    }, 300) // 500ms delay

    const handleDeleteDraft = async (draftId: string) => {
        const supabase = createClient() // Change to server component client
        const { error } = await supabase
            .from('drafts')
            .delete()
            .eq('id', draftId)
        const { data: session } = await supabase.auth.getUser()
        await supabase.storage
            .from('drafts')
            .remove([`${session.user?.id}/${draftId}`])
        if (error) {
            // Handle the error
            console.error('Error deleting draft:', error)
        } else {
            // Remove the deleted draft from the drafts state
            const updatedDrafts = drafts?.filter(
                (draft) => draft.id !== draftId
            )
            setDrafts(updatedDrafts)
        }
    }

    const onDeleteDraft = (draftId: string) => {
        setDraftIdToDelete(draftId)
        setShowDeleteModal(true)
    }

    return (
        <>
            <title>My Drafts</title>
            {loading && <LoadingDrafts />}
            <div className="md:max-w-4xl max-w-full mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
                {/* TABS FILTER */}
                <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row pb-8">
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                        My Drafts
                    </h2>
                </div>
                {drafts && drafts.length > 0 && (
                    <div className="flex flex-col space-y-8">
                        <form
                            action=""
                            method="POST"
                            className="flex-1 text-slate-900 dark:text-slate-200"
                        >
                            <div className="bg-slate-50 dark:bg-neutral-700 flex items-center space-x-1 py-2 px-4 rounded-xl h-full">
                                <SearchIcon strokeWidth={1.5} />
                                <input
                                    type="search"
                                    placeholder="Type and press enter"
                                    className="border-none bg-transparent focus:outline-none focus:ring-0 w-full text-sm "
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            setDrafts(myDrafts)
                                            return
                                        }

                                        fetchDrafts(e.target.value)
                                    }}
                                />
                            </div>
                        </form>
                        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <DraftsTable
                                    drafts={drafts}
                                    draftHasTopic={draftHasTopic}
                                    onDeleteDraft={onDeleteDraft}
                                    //@ts-ignore
                                    draftFn={addPosts}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {showDeleteModal && (
                    <ModalDeletePost
                        show={showDeleteModal}
                        type="draft"
                        id={draftIdToDelete}
                        onCloseModalDeletePost={() => setShowDeleteModal(false)}
                        onDeletePost={handleDeleteDraft} // Pass onDeleteDraft method
                    />
                )}
            </div>
        </>
    )
}

export default DashboardDrafts
