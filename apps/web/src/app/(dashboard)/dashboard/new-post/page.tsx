'use client'

import React, { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { Alert, Button, Textarea, Label, ButtonPrimary } from 'ui'
import { createClient } from '@/utils/supabase/client'
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import stringToSlug from '@/utils/stringToSlug'
import TiptapEditor from '@/components/PostSubmissionEditor/TiptapEditor'
import toast from 'react-hot-toast'
import TitleEditor from '@/components/PostSubmissionEditor/TitleEditor'
import PostOptionsBtn, {
    PostOptionsData,
} from '@/components/PostSubmissionEditor/PostOptionsBtn'
import TagsInput from '@/components/PostSubmissionEditor/TagsInput'
import { TrashIcon } from 'lucide-react'
import { useStore } from '@/stores/newPost'
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

function findImageUrls(json: ImageObject[]): string[] {
    const urls: string[] = []

    function traverse(
        obj: ImageObject | TextObject | (ImageObject | TextObject)[]
    ): void {
        if (Array.isArray(obj)) {
            obj.forEach((item) => traverse(item))
        } else if (typeof obj === 'object' && obj !== null) {
            //@ts-ignore
            if (obj.type === 'image' && obj.attrs && obj.attrs.src) {
                //@ts-ignore
                urls.push(obj.attrs.src)
            } else {
                Object.values(obj).forEach((value) => traverse(value))
            }
        }
    }

    traverse(json)
    return urls
}

function modifyString(str: string) {
    //Capitalize every word of the string and replace spaces with -
    return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-')
}

const DashboardSubmitPost = () => {
    const router = useRouter()

    const supabase = createClient()

    const [errorMsg, setErrorMsg] = useState('')
    const [text, setText] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    let [json, setJson] = useState('' as any)
    const [progress, setProgress] = useState(0)
    const { newPostImgs, setNewPost } = useStore()
    const [toxicity, setToxicity] = useState([{ label: 'toxic', score: 0 }])
    const defaultPostOptionsData = {
        excerptText: '',
        isAllowComments: true,
        license: '--------------',
        timeSchedulePublication: undefined,
    }
    const [postOptionsData, setPostOptionsData] = useState<PostOptionsData>(
        defaultPostOptionsData
    )

    let [tags, setTags] = useState<string[]>([])
    const [title, setTitle] = useState('')

    async function sendPost(formData: any) {
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
            setErrorMsg('Post title is required')
            return
        }

        const imageUrls: string[] = findImageUrls(json.content)
        imageUrls.map((url) => {
            //Check if the image is in the newPostImgs array and get its mod score
            const img = newPostImgs?.images.find((img: any) => img.url === url)
            if (img?.rating && img.rating) {
                setUploading(false)
                setErrorMsg('NSFW images are not allowed')
                return
            }
        })

        setProgress(20)
        try {
            if (selectedImage) {
                // Get the authenticated user
                const {
                    data: { user },
                } = await supabase.auth.getUser()

                let scheduled_at = null

                if (postOptionsData.timeSchedulePublication) {
                    const now = new Date()
                    const timeSchedulePublicationDate = new Date(
                        postOptionsData.timeSchedulePublication
                    )

                    scheduled_at =
                        timeSchedulePublicationDate >= now
                            ? postOptionsData.timeSchedulePublication
                            : null
                }

                if (!user) {
                    toast.custom((t) => (
                        <Alert
                            type="danger"
                            message="You need to be logged in to submit a post"
                        />
                    ))
                    return
                }

                // Insert the post without the image URL
                const { data, error: postInsertError } = await supabase
                    .from('posts')
                    .insert([
                        {
                            title: title,
                            author: user?.id,
                            description: postOptionsData.excerptText,
                            license: postOptionsData.license,
                            text: text,
                            estimatedReadingTime: Math.round(
                                strWords(text) / 200
                            ),
                            scheduled_at: scheduled_at
                                ? scheduled_at.toISOString()
                                : null,
                        },
                    ])
                    .select()

                // Retrieve the generated post ID
                const postId: string = data ? data[0]?.id : ''
                setProgress(30)
                console.log(json.content)

                console.log(imageUrls)

                // Upload the images to Supabase storage and rename the link in the json to the new link
                for (let i = 0; i < imageUrls.length; i++) {
                    if (imageUrls[i].includes('blob:')) {
                        const response = await fetch(imageUrls[i])
                        const blob = await response.blob()

                        const { data: imagePath } = await supabase.storage
                            .from('images')
                            .upload(
                                `${user?.id}/${data ? data[0]?.id : ''}/${
                                    //Get the last part of the url
                                    imageUrls[i].split('/').pop()
                                }`,
                                blob
                            )

                        json.content[i].attrs.src =
                            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/` +
                            imagePath?.path

                        const text = JSON.stringify(json)
                        json = JSON.parse(
                            text.replace(
                                imageUrls[i],
                                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/` +
                                    imagePath?.path
                            )
                        )
                    }
                }

                if (postInsertError) {
                    throw new Error(
                        `Post insertion failed: ${postInsertError.message}`
                    )
                }

                setProgress(50)

                // Upload the selected image to Supabase storage with the post's ID as the name
                const { data: imagePath } = await supabase.storage
                    .from('images')
                    .upload(`${user?.id}/${postId}/main-image`, selectedImage)

                tags = tags.map((tag) => {
                    return modifyString(tag)
                })

                setProgress(70)

                if (tags.length > 0) {
                    const { data: tagsArray, error } = await supabase.rpc(
                        'manage_topics',
                        {
                            topics: tags,
                        }
                    )
                    const finalTags = tagsArray?.map((tag: any) => {
                        return {
                            post: postId,
                            topic: tag.top_id,
                        }
                    })

                    if (finalTags) {
                        await supabase
                            .from('post_topics')
                            .insert(finalTags)
                            .select('*')
                    }
                }

                setProgress(90)

                // Update the inserted post with the image URL
                await supabase
                    .from('posts')
                    .update({
                        image:
                            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/` +
                            imagePath?.path,
                        json: addIdsToHeadings(json),
                    })
                    .eq('id', postId)

                setProgress(100)

                router.push(`/post/${stringToSlug(title)}/${postId}`)
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
                <Alert type="danger" message={`Post submission failed`} />
            ))

            setUploading(false)
        }
    }

    async function sendDraft(formData: any) {
        setUploading(true)
        setErrorMsg('')

        tags.filter((tag) => tag && tag.length > 0).map((tag: string) => {
            if (tag.length > 20) {
                setUploading(false)
                toast.custom((t) => (
                    <Alert
                        type="danger"
                        message="Topics must be between 1 and 20 characters"
                    />
                ))
                return
            }
        })

        console.log(tags)

        if (!title) {
            toast.custom((t) => (
                <Alert type="danger" message="Post title is required" />
            ))
            setUploading(false)
            return
        }

        // Get the authenticated user
        const { data: session } = await supabase.auth.getUser()

        // Insert the draft without the image URL
        const { data, error: draftInsertError } = await supabase
            .from('drafts')
            .insert([
                {
                    title: title,
                    author: session.user?.id,
                    description: postOptionsData.excerptText,
                    license: postOptionsData.license,
                    text: text,
                    json: addIdsToHeadings(json),
                    estimatedReadingTime: Math.round(strWords(text) / 200),
                },
            ])
            .select()

        console.log(draftInsertError)

        // Retrieve the generated draft ID
        const draftId: string = data ? data[0]?.id : ''

        // Upload the selected image to Supabase storage with the post's ID as the name
        if (selectedImage) {
            const { data: imagePath } = await supabase.storage
                .from('images')
                .upload(
                    `${session.user?.id}/drafts/${draftId}/main-image`,
                    selectedImage
                )

            // Update the inserted draft with the image URL
            await supabase
                .from('drafts')
                .update({
                    image:
                        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/` +
                        imagePath?.path,
                })
                .eq('id', draftId)
        }

        const { data: tagsArray, error } = await supabase.rpc('manage_topics', {
            topics: tags,
        })

        tagsArray?.map((tag: any) => {
            tag.post = draftId
            tag.topic = tag.top_id
        })

        if (tagsArray && tagsArray.length > 0)
            await supabase.from('draft_topics').insert(tagsArray)

        setUploading(false)
        toast.custom((t) => (
            <Alert
                type="success"
                message="Draft saved successfully. You can access it from your dashboard"
            />
        ))
    }

    const handleImageSelect = (event: { target: { files: any[] } }) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedImage(file)
        }
    }

    const handleApplyPostOptions = (data: PostOptionsData) => {
        setPostOptionsData(data)
    }

    useEffect(() => {
        // Worker initialization
        const worker = new Worker(new URL('./langWorker.ts', import.meta.url), {
            type: 'module',
        })

        worker.onmessage = (event: MessageEvent) => {
            const results = event.data
            setToxicity(results)
        }

        // Debounced function to post message to worker
        const debouncedPostMessage = debounce((text: string) => {
            worker.postMessage(text)
        }, 5000)

        // Call the debounced function
        debouncedPostMessage(text)

        // Cleanup function to terminate the worker
        return () => {
            worker.terminate()
        }
    }, [json])

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
            <title>New Post - Athera</title>
            <div className="max-w-4xl mx-auto lg:pt-5 pt-10 sm:pt-26 pb-24 lg:pb-32">
                <div className="rounded-xl md:p-6">
                    <form
                        className="grid md:grid-cols-2 gap-y-6"
                        action="#"
                        onSubmit={handleSubmit(async (data) => {
                            await sendPost(data)
                        })}
                        method="post"
                    >
                        <Label className="block sm:col-span-1 md:col-span-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
                            <TitleEditor
                                onUpdate={(editor) => {
                                    setTitle(editor.getText())
                                }}
                            />
                            {errors.postTitle && (
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
                                            >
                                                {/* Your SVG path here */}
                                            </svg>
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

                        <div className="flex-1 relative pb-[700px] md:hidden">
                            <div className="absolute inset-0 flex flex-col">
                                <div className="rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 border-dashed">
                                    <TiptapEditor
                                        onUpdate={(editor) => {
                                            const text = editor.getText()
                                            setText(text)
                                            setJson(editor.getJSON())
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block md:col-span-2">
                            <div className="rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 border-dashed">
                                <TiptapEditor
                                    onUpdate={(editor) => {
                                        const text = editor.getText()
                                        setText(text)
                                        setJson(editor.getJSON())
                                    }}
                                />
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
                                        Submit Post
                                    </ButtonPrimary>
                                    <ButtonPrimary
                                        type="button"
                                        onClick={handleSubmit(
                                            async (data, event) => {
                                                await sendDraft(data)
                                            }
                                        )}
                                        className="text-white px-2 py-1 rounded-lg ml-2"
                                    >
                                        Save Draft
                                    </ButtonPrimary>
                                    <PostOptionsBtn
                                        defaultData={postOptionsData}
                                        onSubmit={handleApplyPostOptions}
                                    />
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

export default DashboardSubmitPost
