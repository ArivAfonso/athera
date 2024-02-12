'use client'

import React, { useState } from 'react'
import Input from '@/components/Input/Input'
import NextImage from 'next/image'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Textarea from '@/components/Textarea/Textarea'
import Label from '@/components/Label/Label'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Controller, useForm } from 'react-hook-form'
import Alert from '@/components/Alert/Alert'
import { useRouter } from 'next/navigation'
import { pipeline } from '@xenova/transformers'
import stringToSlug from '@/utils/stringToSlug'
import TiptapEditor from '@/components/PostSubmissionEditor/TiptapEditor'
import toast from 'react-hot-toast'
import TitleEditor from './TitleEditor'
import TagsInput from './TagsInput'
import PostOptionsBtn, { PostOptionsData } from './PostOptionsBtn'

function strWords(str: string) {
    return str.split(/\s+/).length
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

    const supabase = createClientComponentClient()

    const [errorMsg, setErrorMsg] = useState('')
    const [text, setText] = useState('')
    let [htmlText, setHtmlText] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [bigTag, setBigTag] = useState(false)
    const [json, setJson] = useState('' as any)
    const [progress, setProgress] = useState(0)
    const defaultPostOptionsData = {
        excerptText: '',
        isAllowComments: true,
        timeSchedulePublication: undefined,
    }
    const [postOptionsData, setPostOptionsData] = useState<PostOptionsData>(
        defaultPostOptionsData
    )

    const isMobile = window.innerWidth < 700

    const [tags, setTags] = useState([''])
    const [title, setTitle] = useState('')

    async function sendPost(formData: any) {
        setUploading(true)
        console.log(tags)
        setErrorMsg('')
        const pipe = await pipeline('feature-extraction', 'Supabase/gte-small')
        setProgress(10)

        tags.filter((tag) => tag && tag.length > 0).map((tag: string) => {
            if (tag.length == 0 || tag == null || tag.length > 20) {
                setUploading(false)
                setErrorMsg('Categories must be between 1 and 20 characters')
                return
            }
        })

        if (!title) {
            setUploading(false)
            setErrorMsg('Post title is required')
            return
        }

        // Generate the embedding from text
        const output = await pipe(title + postOptionsData.excerptText, {
            pooling: 'mean',
            normalize: true,
        })

        // Extract the embedding output
        const embedding = Array.from(output.data)
        setProgress(20)
        try {
            if (selectedImage) {
                // Get the authenticated user
                const {
                    data: { user },
                } = await supabase.auth.getUser()

                // Insert the post without the image URL
                const { data, error: postInsertError } = await supabase
                    .from('posts')
                    .insert([
                        {
                            title: title,
                            author: user?.id,
                            description: postOptionsData.excerptText,
                            text: text,
                            estimatedReadingTime: Math.round(
                                strWords(text) / 200
                            ),
                            embeddings: embedding,
                        },
                    ])
                    .select()

                // Retrieve the generated post ID
                const postId: string = data ? data[0]?.id : null
                setProgress(30)
                console.log(json.content)

                // Get all the image blob urls from the editor json
                const imageUrls = json.content
                    .filter((block: any) => block.type === 'image')
                    .map((block: any) => block.attrs.src)

                // Upload the images to Supabase storage and rename the link in the json to the new link
                for (let i = 0; i < imageUrls.length; i++) {
                    const { data: imagePath } = await supabase.storage
                        .from('images')
                        .upload(
                            `${user?.id}/${data ? data[0]?.id : ''}/${
                                imageUrls[i].split(',')[1]
                            }`,
                            imageUrls[i].split(',')[1]
                        )

                    json.content[i].attrs.src =
                        'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/' +
                        imagePath?.path
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

                setProgress(70)

                const tagsArray: any[] = await Promise.all(
                    tags
                        .filter((tag) => tag && tag.length > 0)
                        .map(async (tag: string) => {
                            tag = modifyString(tag)
                            console.log(tag)

                            const { data: isCategory } = await supabase
                                .from('categories')
                                .select('id')
                                .eq('name', tag)

                            if (isCategory && isCategory.length > 0) {
                                return {
                                    post: postId,
                                    category: isCategory[0].id,
                                }
                            } else {
                                // Choose a random element from an array of words
                                const colors = [
                                    'Red',
                                    'Green',
                                    'Blue',
                                    'Yellow',
                                    'Purple',
                                    'Pink',
                                    'Orange',
                                    'Grey',
                                ]
                                const color =
                                    colors[
                                        Math.floor(
                                            Math.random() * colors.length
                                        )
                                    ]
                                const { data: newCategory } = await supabase
                                    .from('categories')
                                    .insert({ name: tag, color: color })
                                    .select('*')

                                if (newCategory && newCategory.length > 0) {
                                    return {
                                        post: postId,
                                        category: newCategory[0].id,
                                    }
                                } else {
                                    // Handle the case where the category couldn't be created
                                    return null // or any other suitable value
                                }
                            }
                        })
                )

                await supabase
                    .from('post_categories')
                    .insert(tagsArray)
                    .select('*')

                setProgress(90)

                // Update the inserted post with the image URL
                await supabase
                    .from('posts')
                    .update({
                        image:
                            'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/' +
                            imagePath?.path,
                        json: json,
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
            console.log(error)
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
                        message="Categories must be between 1 and 20 characters"
                    />
                ))
                return
            }
        })

        if (!title) {
            toast.custom((t) => (
                <Alert type="danger" message="Post title is required" />
            ))
            setUploading(false)
            return
        }

        // Get the authenticated user
        const { data: session } = await supabase.auth.getSession()

        // Insert the draft without the image URL
        const { data, error: draftInsertError } = await supabase
            .from('drafts')
            .insert([
                {
                    title: title,
                    author: session.session?.user?.id,
                    description: postOptionsData.excerptText,
                    text: text,
                    json: json,
                    estimatedReadingTime: Math.round(strWords(text) / 200),
                },
            ])
            .select()

        // Retrieve the generated draft ID
        const draftId: string = data ? data[0]?.id : null

        // Upload the selected image to Supabase storage with the post's ID as the name
        if (selectedImage) {
            const { data: imagePath } = await supabase.storage
                .from('images')
                .upload(
                    `${session.session?.user?.id}/drafts/${draftId}/main-image`,
                    selectedImage
                )

            // Update the inserted draft with the image URL
            await supabase
                .from('drafts')
                .update({
                    image:
                        'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/' +
                        imagePath?.path,
                })
                .eq('id', draftId)
        }

        const tagsArray: any[] = await Promise.all(
            tags
                .filter((tag) => tag && tag.length > 0)
                .map(async (tag: string) => {
                    tag = modifyString(tag)
                    console.log(tag)

                    const { data: isCategory } = await supabase
                        .from('categories')
                        .select('id')
                        .eq('name', tag)
                    console.log(isCategory)

                    if (isCategory && isCategory.length > 0) {
                        return {
                            post: draftId,
                            category: isCategory[0].id,
                        }
                    } else {
                        // Choose a random element from an array of words
                        const colors = [
                            'Red',
                            'Green',
                            'Blue',
                            'Yellow',
                            'Purple',
                            'Pink',
                            'Orange',
                            'Grey',
                        ]
                        const color =
                            colors[Math.floor(Math.random() * colors.length)]
                        const { data: newCategory } = await supabase
                            .from('categories')
                            .insert({ name: tag, color: color })
                            .select('*')

                        if (newCategory && newCategory.length > 0) {
                            return {
                                post: draftId,
                                category: newCategory[0].id,
                            }
                        } else {
                            // Handle the case where the category couldn't be created
                            return null // or any other suitable value
                        }
                    }
                })
        )

        if (tagsArray.length > 0)
            await supabase.from('draft_categories').insert(tagsArray)

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

    const [isDragging, setIsDragging] = useState(false)

    const handleDrop = (event: any) => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        if (file) {
            if (
                file.type === 'image/png' ||
                file.type === 'image/jpeg' ||
                file.type === 'image/jpg'
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
                <div className="rounded-xl md:border md:border-neutral-100 dark:border-neutral-800 md:p-6">
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
                            <TagsInput onChange={handleChangeTags} />
                        </Label>

                        <div className="block md:col-span-2">
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-2xl"
                            >
                                <div className="space-y-1 text-center pb-8">
                                    {selectedImage ? (
                                        <NextImage
                                            src={URL.createObjectURL(
                                                selectedImage
                                            )}
                                            alt="Selected Image"
                                            width={800} // Adjust the desired width
                                            height={480} // Adjust the desired height
                                        />
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
                                            <p className="text-xs text-neutral-500">
                                                PNG, JPG up to 1MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isMobile ? (
                            <div className="flex-1 relative pb-[700px]">
                                {/* <div className="absolute inset-0 flex flex-col"> */}
                                <div className="rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 border-dashed">
                                    <TiptapEditor
                                        onUpdate={(editor) => {
                                            const text = editor.getText()
                                            setText(text)
                                            setJson(editor.getJSON())
                                        }}
                                    />
                                </div>
                                {/* </div> */}
                            </div>
                        ) : (
                            <div className="block md:col-span-2">
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
                        )}

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
                                            className="h-full bg-blue-700 absolute rounded-lg transition-all duration-500 ease-in-out"
                                        ></div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ButtonPrimary
                                        type="submit"
                                        className="text-white bg-blue-700 px-2 py-1 rounded-lg"
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
