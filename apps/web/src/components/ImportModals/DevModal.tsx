'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import {
    Input,
    Label,
    ButtonPrimary,
    Checkbox,
    Modal,
    AccordionInfo,
    Alert,
} from 'ui'
import { Controller, useForm } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'
import { generateJSON } from '@tiptap/core'
import Paragraph from '@tiptap/extension-paragraph'
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
import { generateText } from '@tiptap/react'
import toast from 'react-hot-toast'

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
                <li>You can find your Dev.to username in your profile URL.</li>
                <li>
                    You can import a certain number of posts at once and/or
                    draft them all in the next section
                </li>
            </ul>
        ),
    },
]

interface DevPostType {
    id: number
    title: string
    cover_image: string
    published_at: string
    url: string
    slug: string
    tags: string
    description: string
    tag_list: string[]
    canonical_url: string
    comments_count: number
    positive_reactions_count: number
    public_reactions_count: number
    page_views_count: number
    published_timestamp: string
    body_markdown: string
    user: {
        name: string
        username: string
        twitter_username: string
        github_username: string
        website_url: string
        profile_image: string
    }
}

function strWords(str: string) {
    return str.split(/\s+/).length
}

async function getPosts(username: string) {
    const res = await fetch(`https://dev.to/api/articles?username=${username}`)
    const data = await res.json()
    return data
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

const DevModal: FC<ModalDeletePostProps> = ({ show, onCloseModal }) => {
    const { handleSubmit, register, control, watch, setValue } = useForm()
    const textareaRef = useRef(null)
    const [part2, setPart2] = useState(false)
    const [posts, setPosts] = useState<DevPostType[]>()
    const [progress, setProgress] = useState(0)
    const [total, setTotal] = useState(0)
    const [username, setUsername] = useState('')

    const supabase = createClient()

    const watchedValues = watch()

    const uploadPosts = async (selectedPosts: DevPostType[]) => {
        const { data: session } = await supabase.auth.getUser()
        const user = session.user?.id

        if (!user) {
            toast.custom((t) => (
                <Alert
                    type="danger"
                    message="You need to be logged in to perform this action"
                />
            ))
            return
        }

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
            const res = await fetch(`https://dev.to/api/articles/${post.id}`)
            const article_json = await res.json()

            const body_html = article_json.body_html

            const output = generateJSON(body_html, [
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

            const text = generateText(output, [
                Paragraph,
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

            if (post.cover_image === null) {
                const { data, error } = await supabase
                    .from('drafts')
                    .insert({
                        title: post.title,
                        description: post.description,
                        author: user,
                        json: output,
                        text: text,
                        estimated_reading_time: strWords(text),
                    })
                    .select('id')

                const draftId: string = data ? data[0]?.id : ''

                setProgress((prev) => prev + 0.2)

                let tagsArray = []

                //Create tagsArray if there are any
                if (post.tag_list.length > 0) {
                    tagsArray = post.tag_list.map((tag) => ({
                        post: draftId,
                        topic:
                            topics
                                ?.find(
                                    (topic: any) =>
                                        topic.top_name.toLowerCase() ===
                                        modifyString(tag).toLowerCase()
                                )
                                ?.top_id?.toString() ?? null,
                    }))

                    await supabase.from('draft_topics').insert(tagsArray)
                }

                setProgress((prev) => prev + 0.2)

                //Upload post.cover_image to storage
                if (post.cover_image !== null) {
                    const blob = await fetch(post.cover_image).then((r) =>
                        r.blob()
                    )

                    const { data: imagePath, error: imageErr } =
                        await supabase.storage
                            .from('images')
                            .upload(
                                `${user}/drafts/${draftId}/main-image`,
                                blob
                            )

                    //Update the post
                    await supabase
                        .from('drafts')
                        .update({
                            image:
                                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/` +
                                imagePath?.path,
                        })
                        .eq('id', draftId)
                }

                setProgress((prev) => prev + 0.4)
            } else {
                const { data, error } = await supabase
                    .from('posts')
                    .insert({
                        title: post.title ? post.title : 'No title',
                        description: post.description,
                        text: text,
                        json: output,
                        author: user,
                    })
                    .select('id')

                const postId: string = data ? data[0]?.id : ''
                setProgress((prev) => prev + 0.2)

                //Create tagsArray
                if (post.tag_list.length > 0) {
                    const tagsArray = post.tag_list.map((tag) => {
                        const topic = topics?.find(
                            (topic: any) =>
                                topic.top_name.toLowerCase() ===
                                modifyString(tag).toLowerCase()
                        )?.top_id
                        return {
                            post: postId,
                            topic: topic as string,
                        }
                    })

                    if (!tagsArray.length) return

                    await supabase.from('post_topics').insert(tagsArray)
                }

                setProgress((prev) => prev + 0.2)

                //Upload post.cover_image to storage
                const blob = await fetch(post.cover_image).then((r) => r.blob())

                const { data: imagePath, error: imageErr } =
                    await supabase.storage
                        .from('images')
                        .upload(`${user}/${postId}/main-image`, blob)

                //Update the post
                await supabase
                    .from('posts')
                    .update({
                        image:
                            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/` +
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
        setPosts(await getPosts(data.username))
        setUsername(data.username)
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
                            <Label>Your Dev.to Username</Label>
                            <Input
                                {...register('username')}
                                className="mt-1.5"
                                maxLength={50}
                                placeholder="username"
                            />
                            <div className="mt-4">
                                <AccordionInfo
                                    panelClassName="text-sm"
                                    data={accData}
                                />
                            </div>
                            <div className="mt-4 flex justify-center">
                                <ButtonPrimary sizeClass="p-3" type="submit">
                                    Continue
                                </ButtonPrimary>
                            </div>
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
            modalTitle="Dev.to Importer"
        />
    )
}

export default DevModal
