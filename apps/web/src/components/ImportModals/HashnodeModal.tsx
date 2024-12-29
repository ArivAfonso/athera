'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'
import { Input, Modal, Label, ButtonPrimary, Checkbox, AccordionInfo } from 'ui'

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

        const response = await fetch(
            'http://127.0.0.1:8787/api/hashnode/posts?host=' +
                encodeURIComponent(host),
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        const json = await response.json()
        console.log(json)
        setLoading(false)

        return json.postData
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

        await fetch('http://127.0.0.1:8787/api/hashnode/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedPosts }),
        })
        setTotal(selectedPosts?.length ? selectedPosts.length : 0)
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
