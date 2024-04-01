'use client'

import React, { useEffect, useMemo, useState } from 'react'
import NextImage from 'next/image'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Label from '@/components/Label/Label'
import { createClient } from '@/utils/supabase/client'
import { Controller, useForm } from 'react-hook-form'
import Alert from '@/components/Alert/Alert'
import { useRouter } from 'next/navigation'
import { pipeline } from '@xenova/transformers'
import stringToSlug from '@/utils/stringToSlug'
import { useStore } from '@/stores/editPost'
import PostType from '@/types/PostType'
import { TrashIcon } from '@heroicons/react/24/solid'
import Heading2 from '@/components/Heading/Heading2'
import TiptapEditor from '@/components/PostSubmissionEditor/TiptapEditor'
import TitleEditor from '@/components/PostSubmissionEditor/TitleEditor'
import TagsInput from '@/components/PostSubmissionEditor/TagsInput'
import PostOptionsBtn, {
    PostOptionsData,
} from '@/components/PostSubmissionEditor/PostOptionsBtn'
import Loading from './loading'

function modifyString(str: string) {
    //Capitalize every word of the string and replace spaces with -
    return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-')
}

const EditPost = (context: { params: { slug: any } }) => {
    const router = useRouter()
    // Inside your component
    const { post, setPost } = useStore()
    const [loading, setLoading] = useState(true)
    const [editPost, setEditPost] = useState<PostType>()

    const supabase = createClient()

    const [errorMsg, setErrorMsg] = useState('')
    const [text, setText] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [imgChanged, setImgChanged] = useState(false)
    let [title, setTitle] = useState('' as any)
    const [json, setJson] = useState('' as any)
    const defaultPostOptionsData = {
        excerptText: '',
        isAllowComments: true,
        license: '--------------',
        timeSchedulePublication: undefined,
    }
    const [postOptionsData, setPostOptionsData] = useState<PostOptionsData>(
        defaultPostOptionsData
    )

    let [tags, setTags] = useState([''])
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        async function getData() {
            // Get the authenticated user
            const { data: session } = await supabase.auth.getSession()
            if (!session.session) {
                router.push('/login')
                return
            }
            if (post) {
                // rteObj.value = post.rawText
                setEditPost(post)
                setTags(
                    post.post_categories.map(
                        (category) => category.category.name
                    )
                )
            } else {
                const { data, error } = await supabase
                    .from('posts')
                    .select(
                        'title, id, created_at, json, description, image, author(name, id, username, avatar), post_categories(category:categories(id,name,color))'
                    )
                    .eq('id', context.params.slug[0])
                    .single()

                const postData: PostType | null = data as unknown as PostType

                if (session.session.user.id !== postData?.author?.id) {
                    router.push('/')
                }

                if (postData) {
                    // rteObj.value = postData.rawText
                    setEditPost(postData)
                    setTags(
                        postData.post_categories.map(
                            (category) => category.category.name
                        )
                    )
                    // Get the file data from the image url
                    const res = await fetch(postData.image)
                    const blob = await res.blob()
                    const file = new File([blob], 'image', {
                        type: blob.type,
                    })
                    //@ts-ignore
                    setSelectedImage(file)
                }
                setLoading(false)
            }
        }
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function sendPost(formData: any) {
        setUploading(true)
        setErrorMsg('')
        setProgress(10)

        if (title == null || title.length == 0) {
            title = editPost?.title
        }

        // Get the authenticated user
        const {
            data: { user },
        } = await supabase.auth.getUser()

        const pipe = await pipeline('feature-extraction', 'Supabase/gte-small')
        //@ts-ignore
        let newPost: PostType[] = [
            {
                title: editPost ? editPost.title : 'No Title',
                description: editPost ? editPost?.description : '',
                //@ts-ignore
                json: editPost ? editPost?.json : '',
            },
        ]

        if (title !== editPost?.title) {
            newPost[0]['title'] = title
            // // Generate the embedding from text
            // const output = await pipe(
            //     title + formData.postExcerpt,
            //     {
            //         pooling: 'mean',
            //         normalize: true,
            //     }
            // )
        }
        if (formData.postExcerpt !== editPost?.description) {
            newPost[0]['description'] = formData.postExcerpt
        }
        setProgress(20)
        if (imgChanged) {
            // Update the selected image to Supabase storage with the post's ID as the name
            const { data: imagePath, error: uploadError } =
                await supabase.storage.from('images').update(
                    `${user?.id}/${context.params.slug[0]}/main-image`,
                    //@ts-ignore
                    selectedImage
                )

            if (uploadError) {
                console.error('Error uploading image:', uploadError)
                return
            }

            // Create a URL for the uploaded image
            const uploadedImageUrl =
                'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/' +
                imagePath?.path

            // Update the inserted post with the image URL
            const { data, error } = await supabase
                .from('posts')
                .update({
                    image: uploadedImageUrl,
                })
                .eq('id', context.params.slug[0])
        }
        setProgress(30)

        if (json !== editPost?.json) {
            newPost[0]['json'] = json
        }

        tags.filter((tag) => tag && tag.length > 0).map((tag: string) => {
            if (tag.length == 0 || tag == null || tag.length > 20) {
                setUploading(false)
                setErrorMsg('Categories must be between 1 and 20 characters')
                return
            }
        })
        setProgress(40)

        const { data, error } = await supabase
            .from('posts')
            .update(newPost[0])
            .eq('id', context.params.slug[0])
        console.log(error)
        setProgress(70)

        const tagsArray = await Promise.all(
            tags
                .filter((tag) => tag && tag.length > 0)
                .map(async (tag: string) => {
                    tag = modifyString(tag)

                    const { data: isCategory } = await supabase
                        .from('categories')
                        .select('id')
                        .eq('name', tag)

                    if (isCategory && isCategory.length > 0) {
                        return {
                            post: context.params.slug[0],
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
                                post: context.params.slug[0],
                                category: newCategory[0].id,
                            }
                        } else {
                            // Handle the case where the category couldn't be created
                            return null // or any other suitable value
                        }
                    }
                })
        )
        setProgress(90)

        if (tagsArray !== editPost?.post_categories) {
            await supabase
                .from('post_categories')
                .delete()
                .eq('post', editPost?.id)
            await supabase.from('post_categories').insert(tagsArray).select('*')
        }
        setProgress(100)

        router.push(`/post/${stringToSlug(title)}/${context.params.slug[0]}`)
    }

    const handleImageSelect = (event: { target: { files: any[] } }) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = function () {
                //@ts-ignore
                setShowImg(reader.result as string)
            }
            reader.readAsDataURL(file)
            setImgChanged(true)
        }
    }

    const [isDragging, setIsDragging] = useState(false)
    const [showImg, setShowImg] = useState(null)

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
                const reader = new FileReader()
                reader.onloadend = function () {
                    //@ts-ignore
                    setShowImg(reader.result as string)
                }
                reader.readAsDataURL(file)
                setImgChanged(true)
            } else {
                // Handle the case when the file type is not supported
                setErrorMsg(
                    'Unsupported file type. Please use PNG, JPG, or JPEG.'
                )
            }
        }
        setIsDragging(false)
    }

    const handleChangeTags = (tags: any) => {
        setTags(tags)
    }

    const handleApplyPostOptions = (data: PostOptionsData) => {
        setPostOptionsData(data)
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

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm() // Initialize the hook

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <Loading />
                </div>
            ) : (
                <>
                    <title>Edit Post - Athera</title>
                    <div className="max-w-4xl mx-auto lg:pt-5 pt-10 sm:pt-26 pb-24 lg:pb-32">
                        <div className="rounded-xl md:p-6">
                            <form
                                className="grid md:grid-cols-2 gap-6"
                                onSubmit={handleSubmit(async (data, event) => {
                                    event?.preventDefault() // Prevent default form submission
                                    await sendPost(data)
                                })}
                                method="post"
                            >
                                <Label className="block sm:col-span-1 md:col-span-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                    <TitleEditor
                                        onUpdate={(editor) => {
                                            setTitle(editor.getText())
                                        }}
                                        defaultTitle={editPost?.title}
                                    />
                                    {errors.postTitle && (
                                        <Alert
                                            type="danger"
                                            message="Required"
                                        />
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
                                                        src={
                                                            imgChanged
                                                                ? showImg
                                                                    ? showImg
                                                                    : ''
                                                                : editPost?.image
                                                                  ? editPost?.image
                                                                  : '/images/placeholder.png'
                                                        }
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
                                                                setSelectedImage(
                                                                    null
                                                                )
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
                                                                <span>
                                                                    Drop here
                                                                </span>
                                                            ) : (
                                                                <span>
                                                                    Upload a
                                                                    file
                                                                </span>
                                                            )}
                                                            <input
                                                                id="file-upload"
                                                                name="file-upload"
                                                                type="file"
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
                                                        PNG, JPG up to 10MB
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
                                                    const text =
                                                        editor.getText()
                                                    setText(text)
                                                    setJson(editor.getJSON())
                                                }}
                                                defaultContent={editPost?.json}
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
                                            defaultContent={editPost?.json}
                                        />
                                    </div>
                                </div>
                                <div className="pt-2 md:col-span-2 flex space-x-12 justify-center flex-wrap">
                                    {!uploading ? (
                                        <>
                                            <ButtonPrimary
                                                type="submit"
                                                className="text-white md:col-span-2 rounded-lg"
                                            >
                                                Update Post
                                            </ButtonPrimary>
                                            <PostOptionsBtn
                                                defaultData={postOptionsData}
                                                onSubmit={
                                                    handleApplyPostOptions
                                                }
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <ButtonPrimary
                                                className="text-white md:col-span-2 rounded-lg"
                                                loading
                                            >
                                                Updating...
                                            </ButtonPrimary>
                                            <div className="md:col-span-2 h-2 relative overflow-hidden rounded-lg w-full mt-4">
                                                <div className="w-full h-full bg-gray-200 absolute"></div>
                                                <div
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                    className="h-full bg-blue-500 absolute rounded-lg transition-all duration-500 ease-in-out"
                                                ></div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {errorMsg && (
                                    <Alert type="danger" message={errorMsg} />
                                )}
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default EditPost
