'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'
import { Alert, Label, ButtonPrimary, Checkbox, AccordionInfo, Modal } from 'ui'
import TopicType from '@/types/TopicType'
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
import { TrashIcon } from 'lucide-react'
import FileItem from '../FileItem/FileItem'
import toast from 'react-hot-toast'
import JSZip from 'jszip'

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
                <li>You can find your Medium username in your profile URL.</li>
                <li>
                    You can import a certain number of posts at once and/or
                    draft them all in the next section
                </li>
            </ul>
        ),
    },
]

interface MediumPostType {
    id: number
    title: string
    image: string | null
    description: string
    body: string
    text: string
}

function strWords(str: string) {
    return str.split(/\s+/).length
}

export interface ModalDeletePostProps {
    show: boolean
    onCloseModal: () => void
}

function unescape(str: string) {
    str = str.replaceAll('\n', '')
    str = str.replaceAll('\t', '')
    str = str.replaceAll('\r', '')
    return str
}

const MediumModal: FC<ModalDeletePostProps> = ({ show, onCloseModal }) => {
    const { handleSubmit, register, control, watch, setValue } = useForm()
    const textareaRef = useRef(null)
    const [part2, setPart2] = useState(false)
    const [posts, setPosts] = useState<MediumPostType[]>()
    const [progress, setProgress] = useState(0)
    const [total, setTotal] = useState(0)

    const supabase = createClient()

    const watchedValues = watch()

    const uploadPosts = async (selectedPosts: MediumPostType[]) => {
        const { data: session } = await supabase.auth.getUser()
        const user = session.user?.id

        selectedPosts.forEach(async (post) => {
            const output = generateJSON(post.body, [
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

            const { data, error } = await supabase
                .from('drafts')
                .insert({
                    title: post.title,
                    description: post.description,
                    json: output,
                    author: user,
                    text: post.text,
                    estimatedReadingTime: Math.round(strWords(post.text) / 200),
                })
                .select('id')

            const draftId: string = data ? data[0]?.id : ''

            setProgress((prev) => prev + 0.4)

            //Upload post.image to storage
            if (post.image !== null) {
                const blob = await fetch(post.image).then((r) => r.blob())

                const { data: imagePath, error: imageErr } =
                    await supabase.storage
                        .from('images')
                        .upload(`${user}/drafts/${draftId}/main-image`, blob)

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

    const [isDragging, setIsDragging] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    // ...

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        const file = event.target.files[0]
        const zip = new JSZip()
        const posts: MediumPostType[] = []

        zip.loadAsync(file).then((zipFiles: any) => {
            zipFiles.folder('posts').forEach((_: any, zipEntry: any) => {
                // replace unused 'relativePath' with '_'
                if (!zipEntry.dir) {
                    zipEntry.async('text').then((fileData: string) => {
                        let div = document.createElement('div')
                        div.innerHTML = fileData
                        let title = div.getElementsByTagName('h1')[0].innerText
                        let description =
                            div.getElementsByClassName('p-summary')[0].innerHTML

                        let imgElements = div.getElementsByTagName('img')
                        let image =
                            imgElements.length > 0 ? imgElements[0].src : null

                        let body =
                            div.getElementsByClassName('e-content')[0].innerHTML
                        let text =
                            div.getElementsByClassName('e-content')[0]
                                .textContent

                        console.log({
                            id: posts.length,
                            title: unescape(title),
                            description: unescape(description),
                            image: image,
                            body: body,
                            text: text ? unescape(text) : '',
                        })

                        posts.push({
                            id: posts.length,
                            title: unescape(title),
                            description: unescape(description),
                            image: image,
                            body: fileData,
                            text: text ? unescape(text) : '',
                        })
                    })
                }
            })
        })
        setSelectedFile(file)
        setPosts(posts)
    }

    const handleDrop = (event: any) => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        if (file) {
            if (file.type === 'application/zip') {
                setSelectedFile(file)
            } else {
                // Handle the case when the file type is not supported
                toast.custom((t) => (
                    <Alert
                        type="danger"
                        message="File type not supported. Please upload a PNG or JPG file"
                    />
                ))
            }
        }
        setIsDragging(false)
    }

    const handleDragOver = (event: any) => {
        event.preventDefault()
        setIsDragging(true)
    }

    const handleDragEnter = (event: any) => {
        event.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (event: any) => {
        event.preventDefault()
        setIsDragging(false)
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
                            <Label>Your Medium Username</Label>
                            <div className="group block md:col-span-2">
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    className="relative mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-2xl"
                                >
                                    <div className="space-y-1 text-center">
                                        {selectedFile ? (
                                            <FileItem file={selectedFile}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedFile(null)
                                                    }
                                                    className="absolute top-0 right-0 p-1 -m-2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500"
                                                >
                                                    <TrashIcon className="h-6 w-6" />
                                                </button>
                                            </FileItem>
                                        ) : (
                                            <>
                                                <svg
                                                    className="mx-auto h-12 w-12 text-neutral-400"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                    aria-hidden="true"
                                                ></svg>
                                                <div className="flex flex-col sm:flex-row text-sm text-neutral-6000">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className={`relative cursor-pointer rounded-md font-medium text-primary-6000 hover:text-primary-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 ${
                                                            isDragging
                                                                ? 'border-2 border-primary-500'
                                                                : ''
                                                        }`}
                                                    >
                                                        {isDragging ? (
                                                            <span>
                                                                Drop here
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                Upload zip file
                                                            </span>
                                                        )}
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            accept="application/zip"
                                                            className="sr-only"
                                                            //@ts-ignore
                                                            onChange={
                                                                handleFileSelect
                                                            }
                                                        />
                                                    </label>
                                                    <p className="pl-1">
                                                        or drag and drop
                                                    </p>
                                                </div>
                                                <p className="text-xs text-neutral-500 pb-8">
                                                    Obtained from your Medium
                                                    account
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
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
            modalTitle="Medium Importer"
        />
    )
}

export default MediumModal
