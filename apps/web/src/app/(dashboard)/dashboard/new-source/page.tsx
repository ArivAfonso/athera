'use client'

import React, { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { Alert, Button, Textarea, Label, ButtonPrimary } from 'ui'
import { createClient } from '@/utils/supabase/client'
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import stringToSlug from '@/utils/stringToSlug'
import toast from 'react-hot-toast'
import TitleEditor from '@/components/PostSubmissionEditor/TitleEditor'
import TagsInput from '@/components/PostSubmissionEditor/TagsInput'
import { TrashIcon } from 'lucide-react'
import { addIdsToHeadings } from '@/utils/addIdsToHeadings'
import { debounce } from 'lodash'

function strWords(str: string) {
    return str.split(/\s+/).length
}

interface ImageObject {
    type: string
    attrs?: {
        src?: string
        alt?: string
        title?: string | null
    }
    content?: (TextObject | ImageObject)[]
}

interface TextObject {
    type: string
    text: string
    attrs?: {
        href?: string
        target?: string
    }
}

const DashboardSubmitSource = () => {
    const router = useRouter()

    const supabase = createClient()

    const [errorMsg, setErrorMsg] = useState('')
    const [text, setText] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    let [json, setJson] = useState('' as any)
    const [progress, setProgress] = useState(0)

    let [tags, setTags] = useState<string[]>([])
    const [title, setTitle] = useState('')

    async function sendSource(formData: any) {
        setUploading(true)
        setErrorMsg('')
        setProgress(10)

        tags.filter((tag) => tag && tag.length > 0).map((tag: string) => {
            if (tag.length == 0 || tag == null || tag.length > 20) {
                setUploading(false)
                setErrorMsg('Topics must be between 1 and 20 characters')
                return
            }
        })

        if (!title) {
            setUploading(false)
            setErrorMsg('Source title is required')
            return
        }

        setProgress(20)
        try {
            if (selectedImage) {
                // Get the authenticated user
                const {
                    data: { user },
                } = await supabase.auth.getUser()

                let scheduled_at = null

                if (!user) {
                    toast.custom((t) => (
                        <Alert
                            type="danger"
                            message="You need to be logged in to submit a source"
                        />
                    ))
                    return
                }

                // Insert the source without the image URL
                const { data, error: sourceInsertError } = await supabase
                    .from('sources')
                    .insert([
                        {
                            title: title,
                            author: user?.id,
                            text: text,
                            estimatedReadingTime: Math.round(
                                strWords(text) / 200
                            ),
                        },
                    ])
                    .select()

                setProgress(30)

                if (sourceInsertError) {
                    throw new Error(
                        `Source insertion failed: ${sourceInsertError.message}`
                    )
                }

                setProgress(50)

                // Upload the selected image to Supabase storage with the source's ID as the name
                // const { data: imagePath } = await supabase.storage
                //     .from('images')
                //     .upload(`${user?.id}/${sourceId}/main-image`, selectedImage)

                setProgress(90)

                // Update the inserted source with the image URL
                // await supabase
                //     .from('sources')
                //     .update({
                //         image:
                //             `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/` +
                //             imagePath?.path,
                //         json: addIdsToHeadings(json),
                //     })
                //     .eq('id', sourceId)

                // setProgress(100)

                // router.push(`/source/${stringToSlug(title)}/${sourceId}`)
            } else {
                toast.custom((t) => (
                    <Alert
                        type="danger"
                        message="Please upload a featured image"
                    />
                ))
                setUploading(false)
            }
        } catch (error) {
            toast.custom((t) => (
                <Alert type="danger" message={`Source submission failed`} />
            ))

            setUploading(false)
        }
    }

    const handleImageSelect = (event: { target: { files: any[] } }) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedImage(file)
        }
    }

    const [isDragging, setIsDragging] = useState(false)

    const handleDrop = (event: any) => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        if (file) {
            if (
                file.type === 'image/png' ||
                file.type === 'image/jpeg' ||
                file.type === 'image/jpg' ||
                file.type === 'image/webp' ||
                file.type === 'image/svg+xml' ||
                file.type === 'image/avif'
            ) {
                setSelectedImage(file)
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

    const handleChangeTags = (tags: any) => {
        setTags(tags)
    }

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm() // Initialize the hook

    return (
        <>
            <title>New Source - Athera</title>
            <div className="max-w-4xl mx-auto lg:pt-5 pt-10 sm:pt-26 pb-24 lg:pb-32">
                <div className="rounded-xl md:p-6">
                    <form
                        className="grid md:grid-cols-2 gap-y-6"
                        action="#"
                        onSubmit={handleSubmit(async (data) => {
                            await sendSource(data)
                        })}
                        method="source"
                    >
                        <Label className="block sm:col-span-1 md:col-span-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
                            <TitleEditor
                                onUpdate={(editor) => {
                                    setTitle(editor.getText())
                                }}
                            />
                            {errors.sourceTitle && (
                                <Alert type="danger" message="Required" />
                            )}
                        </Label>

                        <Label className="flex justify-top sm:col-span-1 md:col-span-2">
                            <TagsInput
                                onChange={handleChangeTags}
                                defaultValue={tags}
                            />
                        </Label>
                        <div className="group block md:col-span-2">
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                className="relative mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-2xl"
                            >
                                <div className="space-y-1 text-center">
                                    {selectedImage ? (
                                        <>
                                            <NextImage
                                                src={URL.createObjectURL(
                                                    selectedImage
                                                )}
                                                alt="Selected Image"
                                                width={800} // Adjust the desired width
                                                height={480} // Adjust the desired height
                                                className="rounded-md"
                                            />

                                            <div className="opacity-0 group-hover:opacity-100 absolute z-20 end-2.5 top-2.5 flex gap-1">
                                                <div
                                                    className=" p-1.5 bg-black dark:bg-neutral-700 text-white rounded-md cursor-pointer transition-opacity duration-300"
                                                    title="Delete image"
                                                    onClick={() => {
                                                        setSelectedImage(null)
                                                    }}
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </>
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
                                                        <span>Drop here</span>
                                                    ) : (
                                                        <span>
                                                            Upload an image
                                                        </span>
                                                    )}
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        accept="image/png, image/jpeg, image/jpg"
                                                        className="sr-only"
                                                        //@ts-ignore
                                                        onChange={
                                                            handleImageSelect
                                                        }
                                                    />
                                                </label>
                                                <p className="pl-1">
                                                    or drag and drop
                                                </p>
                                            </div>
                                            <p className="text-xs text-neutral-500 pb-8">
                                                PNG, JPG up to 1MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 md:col-span-2 flex space-x-12 justify-center ">
                            {uploading ? (
                                <>
                                    <ButtonPrimary
                                        className="text-white md:col-span-2 rounded-lg"
                                        loading
                                    >
                                        Submitting...
                                    </ButtonPrimary>
                                    <div className="md:col-span-2 h-2 relative overflow-hidden rounded-lg w-full mt-4">
                                        <div className="w-full h-full bg-gray-200 absolute"></div>
                                        <div
                                            style={{ width: `${progress}%` }}
                                            className="h-full absolute rounded-lg transition-all duration-500 ease-in-out"
                                        ></div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ButtonPrimary
                                        type="submit"
                                        className="text-white  px-2 py-1 rounded-lg"
                                    >
                                        Submit Source
                                    </ButtonPrimary>
                                </>
                            )}
                        </div>
                        {errorMsg && <Alert type="danger" message={errorMsg} />}
                    </form>
                </div>
            </div>
        </>
    )
}

export default DashboardSubmitSource
