'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'
import { Input, Modal, Label, ButtonPrimary, Checkbox, AccordionInfo } from 'ui'
import { generateJSON } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'

const accData = [
    {
        name: 'More Info',
        component: (
            <ul className="list-disc list-inside leading-5">
                <li>
                    A post already published with the same name on Athera will
                    be assigned as a draft.
                </li>
                <li>
                    Posts without a cover image or topics will be assigned as
                    drafts.
                </li>
                <li>You can find your Hashnode.to host in your profile URL.</li>
                <li>
                    You can import a certain number of posts at once and/or
                    draft them all in the next section
                </li>
            </ul>
        ),
    },
]

interface HashnodePostType {
    id: number
    title: string
    coverImage: {
        url: string | null
    }
    published_at: string
    url: string
    readTimeInMinutes: number
    slug: string
    tags: { name: string }[]
    tag_list: string[]
    subtitle: string
    content: {
        html: string
        text: string
    }
}

function strWords(str: string) {
    return str.split(/\s+/).length
}

function modifyString(str: string) {
    //Capitalize every word of the string and replace spaces with -
    console.log(str)
    return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-')
}

export interface ModalDeletePostProps {
    show: boolean
    onCloseModal: () => void
}

const HashnodeModal: FC<ModalDeletePostProps> = ({ show, onCloseModal }) => {
    const { handleSubmit, register, control, watch, setValue } = useForm()
    const textareaRef = useRef(null)
    const [part2, setPart2] = useState(false)
    const [posts, setPosts] = useState<HashnodePostType[]>()
    const [progress, setProgress] = useState(0)
    const [total, setTotal] = useState(0)
    const [host, setHost] = useState('')
    const [loading, setLoading] = useState(false)

    const supabase = createClient()

    const watchedValues = watch()

    async function getPosts(host: string) {
        setLoading(true)

        const res = await fetch(
            `${window.location.origin}/api/import/hashnode/posts?host=${host}`
        )

        const json = await res.json()
        console.log(json)
        setLoading(false)

        return json.postData
    }

    const uploadPosts = async (selectedPosts: HashnodePostType[]) => {
        const { data: session } = await supabase.auth.getUser()
        const user = session.user?.id ?? ''

        posts?.forEach((post) => {
            post.tag_list = post.tags.map((tag) => tag.name)
        })

        const tags = Array.from(
            new Set(
                selectedPosts
                    .map((post) => post.tag_list)
                    .flat()
                    .map((tag) => modifyString(tag))
            )
        )

        const { data: topics, error } = await supabase.rpc('manage_topics', {
            topics: tags,
        })

        selectedPosts.forEach(async (post) => {
            let img_blob = null

            if (post.coverImage.url) {
                const blob = await fetch(post.coverImage.url).then((r) =>
                    r.blob()
                )
                if (blob.size > 10000000) {
                    post.coverImage.url = null
                } else {
                    img_blob = blob
                }
            }

            const output = generateJSON(post.content.html, [
                StarterKit,
                Highlight,
                Underline,
                Link,
                Placeholder,
                TextAlign,
                Image,
                Table,
                TableCell,
                TableHeader,
                TableRow,
            ])

            setProgress((prev) => prev + 0.2)

            if (post.coverImage.url === null || img_blob === null) {
                const { data, error } = await supabase
                    .from('drafts')
                    .insert({
                        title: post.title,
                        description: post.subtitle,
                    })
                    .select('id')

                const draftId: string = data ? data[0]?.id : ''

                setProgress((prev) => prev + 0.2)

                let tagsArray = []

                //Create tagsArray if there are any
                if (post.tag_list.length > 0) {
                    tagsArray = post.tag_list.map((tag) => ({
                        post: draftId,
                        topic: (topics ?? []).find(
                            (topic: any) =>
                                topic.top_name.toLowerCase() ===
                                modifyString(tag).toLowerCase()
                        )?.top_id,
                    }))

                    await supabase.from('draft_topics').insert(
                        tagsArray as {
                            post: string
                            topic: string | null | undefined
                        }[]
                    )
                }

                setProgress((prev) => prev + 0.2)

                //Upload post.cover_image to storage
                if (post.coverImage.url !== null && img_blob !== null) {
                    const { data: imagePath, error: imageErr } =
                        await supabase.storage
                            .from('images')
                            .upload(
                                `${user}/drafts/${draftId}/main-image`,
                                img_blob
                            )

                    //Update the post
                    await supabase
                        .from('drafts')
                        .update({
                            image:
                                'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/' +
                                imagePath?.path,
                        })
                        .eq('id', draftId)
                }

                setProgress((prev) => prev + 0.4)
            } else {
                const { data, error } = await supabase
                    .from('posts')
                    .insert({
                        title: post.title,
                        description: post.subtitle,
                        text: post.content.text,
                        estimated_reading_time: Math.round(
                            strWords(post.content.text) / 200
                        ),
                        json: output,
                        author: user,
                    })
                    .select('id')

                const postId: string = data ? data[0]?.id : ''
                setProgress((prev) => prev + 0.2)

                //Create tagsArray
                if (post.tag_list.length > 0) {
                    const tagsArray = post.tag_list.map((tag) => {
                        const topic = (topics ?? []).find(
                            (topic: any) =>
                                topic.top_name.toLowerCase() ===
                                modifyString(tag).toLowerCase()
                        )?.top_id
                        return {
                            post: postId,
                            topic: topic as string,
                        }
                    })
                    await supabase.from('post_topics').insert(tagsArray)
                }

                setProgress((prev) => prev + 0.2)

                const { data: imagePath, error: imageErr } =
                    await supabase.storage
                        .from('images')
                        .upload(`${user}/${postId}/main-image`, img_blob)

                //Update the post
                await supabase
                    .from('posts')
                    .update({
                        image:
                            'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/' +
                            imagePath?.path,
                    })
                    .eq('id', postId)

                setProgress((prev) => prev + 0.4)
            }
        })
    }

    const handleCloseModal = () => {
        onCloseModal()
        //wait for 1 sec
        setTimeout(() => {
            setPart2(false)
        }, 1000)
        setProgress(0)
        setTotal(0)
    }

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                const element: HTMLTextAreaElement | null = textareaRef.current
                if (element) {
                    ;(element as HTMLTextAreaElement).focus()
                }
            }, 400)
        }
    }, [show])

    const onSubmit = async (data: any) => {
        setPosts(await getPosts(data.host))
        setHost(data.host)
        setPart2(true)
    }
    const onPostSubmit = async (data: any) => {
        const selectedPosts = posts?.filter(
            (post) => watchedValues[post.id.toString()] === true
        )
        console.log(selectedPosts)
        setTotal(selectedPosts?.length ? selectedPosts.length : 0)
        await uploadPosts(selectedPosts ? selectedPosts : [])
    }

    const handleCheckboxChange = (post: any, checked: boolean) => {
        setValue(post.id.toString(), checked)
    }

    const renderContent = () => {
        return (
            <>
                {part2 ? (
                    <form
                        onSubmit={handleSubmit(
                            async (data) => await onPostSubmit(data)
                        )}
                    >
                        <div className="">
                            <Label>Choose your posts</Label>
                            {posts?.map((post: any) => (
                                <div key={post.id} className="mt-3">
                                    <Controller
                                        name={post.id.toString()}
                                        control={control}
                                        defaultValue={true}
                                        render={({ field }) => (
                                            <Checkbox
                                                label={post.title}
                                                defaultChecked={true}
                                                // @ts-ignore
                                                onChange={(e) =>
                                                    handleCheckboxChange(
                                                        post,
                                                        e
                                                    )
                                                }
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                        {progress > 0 ? (
                            <div className="md:col-span-2 h-2 relative overflow-hidden rounded-lg w-full mt-3">
                                <div className="w-full h-full bg-gray-200 dark:bg-neutral-700 absolute"></div>
                                <div
                                    style={{
                                        width: `${(progress / total) * 100}%`,
                                    }}
                                    className="h-full bg-blue-500 absolute rounded-lg transition-all duration-500 ease-in-out"
                                ></div>
                            </div>
                        ) : (
                            <div className="mt-3 flex justify-center">
                                <ButtonPrimary type="submit">
                                    Submit
                                </ButtonPrimary>
                            </div>
                        )}
                    </form>
                ) : (
                    <>
                        <form
                            onSubmit={handleSubmit(
                                async (data) => await onSubmit(data)
                            )}
                        >
                            <Label>Your Hashnode.to Host</Label>
                            <Input
                                {...register('host')}
                                className="mt-1.5"
                                maxLength={50}
                                placeholder="host"
                            />
                            <div className="mt-4">
                                <AccordionInfo
                                    panelClassName="text-sm"
                                    data={accData}
                                />
                            </div>
                            {loading ? (
                                <div className="mt-4 flex justify-center">
                                    <ButtonPrimary sizeClass="p-3" loading>
                                        Continue
                                    </ButtonPrimary>
                                </div>
                            ) : (
                                <div className="mt-4 flex justify-center">
                                    <ButtonPrimary
                                        sizeClass="p-3"
                                        type="submit"
                                    >
                                        Continue
                                    </ButtonPrimary>
                                </div>
                            )}
                        </form>
                    </>
                )}
            </>
        )
    }

    const renderTrigger = () => {
        return null
    }

    return (
        <Modal
            isOpenProp={show}
            onCloseModal={handleCloseModal}
            contentExtraClass="max-w-screen-sm"
            renderContent={renderContent}
            renderTrigger={renderTrigger}
            modalTitle="Hashnode Importer"
        />
    )
}

export default HashnodeModal
