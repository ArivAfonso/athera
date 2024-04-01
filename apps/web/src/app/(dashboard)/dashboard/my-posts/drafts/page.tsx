'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import NcImage from '@/components/NcImage/NcImage'
import { createClient } from '@/utils/supabase/client'
import ModalDeletePost from '../ModalDeletePost'
import stringToSlug from '@/utils/stringToSlug'
import Link from 'next/link'
import Badge from '@/components/Badge/Badge'
import CategoryBadgeList from '@/components/CategoryBadgeList/CategoryBadgeList'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import DraftType from '@/types/DraftType'
import PlaceIcon from '@/components/NcImage/PlaceIcon'

const DashboardDrafts = () => {
    const [drafts, setDrafts] = React.useState<DraftType[]>([])
    const router = useRouter()
    const [draftHasCategory, setDraftHasCategory] = React.useState(false)

    const [showDeleteModal, setShowDeleteModal] = React.useState(false)
    const [draftIdToDelete, setDraftIdToDelete] = React.useState('')

    useEffect(() => {
        async function fetchData() {
            try {
                const supabase = createClient()
                const { data: session } = await supabase.auth.getSession()

                // Fetch the drafts
                const { data: draftData, error: draftError } = await supabase
                    .from('drafts')
                    .select(
                        `id, title, created_at, estimatedReadingTime, edited_at, image, draft_categories(category:categories(id,name,color))`
                    )
                    .eq('author', session.session?.user.id)

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
                    if (item.draft_categories[0]) {
                        setDraftHasCategory(true)
                    }
                })
                //@ts-ignore
                setDrafts(draftData)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDeleteDraft = async (draftId: string) => {
        const supabase = createClient() // Change to server component client
        const { error } = await supabase
            .from('drafts')
            .delete()
            .eq('id', draftId)
        const { data: session } = await supabase.auth.getSession()
        await supabase.storage
            .from('drafts')
            .remove([`${session.session?.user.id}/${draftId}`])
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

    return (
        <>
            <title>My Drafts</title>
            <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
                {/* TABS FILTER */}
                <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row pb-8">
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                        My Drafts
                    </h2>
                </div>
                {drafts && drafts.length > 0 && (
                    <div className="flex flex-col space-y-8">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300 dark:divide-neutral-600">
                                    <thead>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-start text-sm font-normal text-neutral-600 dark:text-neutral-400 sm:pl-0 capitalize"
                                            >
                                                Draft
                                            </th>
                                            {draftHasCategory && (
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                                                >
                                                    Categories
                                                </th>
                                            )}
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                                            >
                                                Edited At
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-center text-sm font-normal text-neutral-600 dark:text-neutral-400"
                                            >
                                                Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-600">
                                        {drafts.map((draft, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className="whitespace-nowrap py-4 sm:py-5 ps-4 pe-3 text-sm sm:ps-0">
                                                        <Link
                                                            href={`/dashboard/edit-draft/${stringToSlug(
                                                                draft.title
                                                            )}/${draft.id}`}
                                                            className="flex items-center"
                                                        >
                                                            <div className="h-12 w-12 sm:h-16 sm:w-16 relative flex-shrink-0">
                                                                {draft.image ? (
                                                                    <>
                                                                        <NcImage
                                                                            src={
                                                                                draft.image
                                                                            }
                                                                            alt={
                                                                                draft.title
                                                                            }
                                                                            className="rounded-md object-cover w-full h-full"
                                                                            fill
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <PlaceIcon />
                                                                )}
                                                            </div>
                                                            <div className="ms-4">
                                                                <div className="font-medium text-gray-900 dark:text-neutral-200 w-84 max-w-sm flex whitespace-normal">
                                                                    <span
                                                                        dangerouslySetInnerHTML={{
                                                                            __html:
                                                                                draft.title ||
                                                                                '',
                                                                        }}
                                                                    ></span>
                                                                </div>
                                                                <div className="mt-1 text-gray-500">
                                                                    {
                                                                        draft.created_at
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </td>

                                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                        {draft.draft_categories && (
                                                            <CategoryBadgeList
                                                                categories={
                                                                    draft.draft_categories
                                                                }
                                                                chars={20}
                                                                className="flex space-x-1 justify-center"
                                                            />
                                                        )}
                                                    </td>

                                                    <td className="whitespace-nowrap text-center px-3 py-5 text-sm text-gray-500">
                                                        {draft.edited_at}
                                                    </td>

                                                    <td className="whitespace-nowrap text-center px-3 py-5 text-sm text-gray-500">
                                                        <Badge
                                                            name={
                                                                draft.estimatedReadingTime +
                                                                ' mins'
                                                            }
                                                            color="blue"
                                                            className="rounded-md"
                                                        />
                                                    </td>

                                                    <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium text-neutral-300">
                                                        <button
                                                            onClick={() => {
                                                                router.push(
                                                                    `/dashboard/edit-draft/${draft.id}`
                                                                )
                                                            }}
                                                            className="text-primary-800 dark:text-primary-500 hover:text-primary-900"
                                                        >
                                                            <PencilSquareIcon className="h-6 w-6" />
                                                        </button>
                                                        {` | `}
                                                        <button
                                                            onClick={() => {
                                                                setShowDeleteModal(
                                                                    true
                                                                )
                                                                setDraftIdToDelete(
                                                                    draft.id
                                                                )
                                                            }}
                                                            className="text-rose-600 hover:text-rose-900"
                                                        >
                                                            <TrashIcon className="h-6 w-6" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {showDeleteModal && (
                    <ModalDeletePost
                        show={showDeleteModal}
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
