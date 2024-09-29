'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Input, Modal, Label, Checkbox, ButtonPrimary, AccordionInfo } from 'ui'
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
import { generateText } from '@tiptap/react'

function extractContent(html: string) {
    return new DOMParser().parseFromString(html, 'text/html').documentElement
        .textContent
}

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
                <li>You can find your Dev.to website in your profile URL.</li>
                <li>
                    You can import a certain number of posts at once and/or
                    draft them all in the next section
                </li>
            </ul>
        ),
    },
]

interface WordPressPostType {
    date: string
    link: string
    id: number
    text: string
    json: JSON
    description: string | null
    modified: string
    slug: string
    status: string
    type: string
    title: {
        rendered: string
    }
    content: {
        rendered: string
    }
    excerpt: {
        rendered: string
    }
    featured_media: string | null
    format: string
    topics: number[]
    tags: string[]
}

async function getPosts(website: string) {
    const res = await fetch(`${website}/wp-json/wp/v2/posts?per_page=100`)
    const data = await res.json()

    return data
}

export interface ModalDeletePostProps {
    show: boolean
    onCloseModal: () => void
}

const DevModal: FC<ModalDeletePostProps> = ({ show, onCloseModal }) => {
    const { handleSubmit, register, control, watch, setValue } = useForm()
    const textareaRef = useRef(null)
    const [part2, setPart2] = useState(false)
    const [posts, setPosts] = useState<WordPressPostType[]>()
    const [uploading, setUploading] = useState(false)
    const [website, setWebsite] = useState('')

    const watchedValues = watch()

    const uploadPosts = async (selectedPosts: WordPressPostType[]) => {
        setUploading(true)

        selectedPosts.forEach(async (post) => {
            const output = generateJSON(post.content.rendered, [
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

            post.description = extractContent(post.excerpt.rendered)
            //@ts-ignore
            post.json = output
            post.text = text
        })

        //Upload posts via api
        try {
            await fetch(`${window.location.origin}/api/import/wordpress`, {
                method: 'POST',
                body: JSON.stringify({ selectedPosts, website }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        } catch (error) {
            console.error('Failed to upload posts:', error)
        }

        setUploading(false)
    }

    const handleCloseModal = () => {
        onCloseModal()
        //wait for 1 sec
        setTimeout(() => {
            setPart2(false)
        }, 1000)
        setUploading(false)
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
        setPosts(await getPosts(data.website))
        setWebsite(data.website)
        setPart2(true)
    }
    const onPostSubmit = async (data: any) => {
        const selectedPosts = posts?.filter(
            (post) => watchedValues[post.id.toString()]
        )
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
                                                //@ts-ignore
                                                label={
                                                    extractContent(
                                                        post.title.rendered
                                                    )
                                                        ? extractContent(
                                                              post.title
                                                                  .rendered
                                                          )
                                                        : 'No title'
                                                }
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
                        {uploading ? (
                            <div className="mt-3 flex justify-center">
                                <ButtonPrimary loading>
                                    Submitting
                                </ButtonPrimary>
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
                            <Label>Your Wordpress Website</Label>
                            <div className="mt-1.5 flex">
                                <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                    https://
                                </span>
                                <Controller
                                    name="website"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            className="!rounded-l-none"
                                            placeholder={'example.com'}
                                        />
                                    )}
                                />
                            </div>
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
            modalTitle="WordPress Importer"
        />
    )
}

export default DevModal
