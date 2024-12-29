'use client'

import React, { useEffect, useState } from 'react'

import NextImage from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { Controller, useForm } from 'react-hook-form'
import { Input, Alert, Label, ButtonPrimary } from 'ui'
import { useRouter } from 'next/navigation'
import stringToSlug from '@/utils/stringToSlug'
import DraftType from '@/types/DraftType'
import { TrashIcon } from '@heroicons/react/24/solid'
import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
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
import { generateJSON } from '@tiptap/react'
import TiptapEditor from '@/components/PostSubmissionEditor/TiptapEditor'
import toast from 'react-hot-toast'
import TagsInput from '@/components/PostSubmissionEditor/TagsInput'
import TitleEditor from '@/components/PostSubmissionEditor/TitleEditor'
import PostOptionsBtn, {
    PostOptionsData,
} from '@/components/PostSubmissionEditor/PostOptionsBtn'
import Loading from '../../edit-post/[[...slug]]/loading'

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

const EditDraft = (context: { params: { slug: any } }) => {
    const router = useRouter()
    // Inside your component
    const [editDraft, setEditDraft] = useState<DraftType>()

    const supabase = createClient()

    const [errorMsg, setErrorMsg] = useState('')
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(true)
    let [htmlText, setHtmlText] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    let [title, setTitle] = useState('' as any)
    const [uploading, setUploading] = useState(false)
    const [imgChanged, setImgChanged] = useState(false)
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
            const { data: session } = await supabase.auth.getUser()

            if (!session.user) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('drafts')
                .select(
                    'title, id, created_at, json, description, image, author(name, id), draft_topics(topic:topics(id,name,color))'
                )
                .eq('id', context.params.slug[1])
                .single()

            const draftData: DraftType | null = data as unknown as DraftType
            console.log(draftData)

            if (draftData) {
                // rteObj.value = draftData.rawText
                setEditDraft(draftData)
                if (draftData.draft_topics) {
                    setTags(
                        draftData.draft_topics.map((topic) => topic.topic.name)
                    )
                }
                if (draftData.image) {
                    // Get the file data from the image url
                    const res = await fetch(draftData.image)
                    const blob = await res.blob()
                    const file = new File([blob], 'image', {
                        type: blob.type,
                    })
                    //@ts-ignore
                    setSelectedImage(file)
                    setLoading(false)
                }
            }
            setLoading(false)
        }
        getData()
    }, [])

    async function sendDraft(formData: any) {
        setUploading(true)
        setErrorMsg('')
        setProgress(10)

        // Get the authenticated user
        const {
            data: { user },
        } = await supabase.auth.getUser()

        let newDraft: DraftType[] = [
            //@ts-ignore
            {
                title: editDraft?.title as string,
                description: editDraft?.description as string,
                json: editDraft?.json as JSON,
            },
        ]

        if (title !== editDraft?.title) {
            newDraft[0]['title'] = title
            // // Generate the embedding from text
            // const output = await pipe(
            //     formData.draftTitle + formData.draftExcerpt,
            //     {
            //         pooling: 'mean',
            //         normalize: true,
            //     }
            // )
        }
        if (postOptionsData.excerptText !== editDraft?.description) {
            newDraft[0]['description'] = postOptionsData.excerptText
        }
        setProgress(20)
        if (imgChanged) {
            // Update the selected image to Supabase storage with the post's ID as the name
            const { data: imagePath, error: uploadError } =
                await supabase.storage.from('images').update(
                    `${user?.id}/drafts/${context.params.slug[0]}/main-image`,
                    //@ts-ignore
                    selectedImage
                )

            if (uploadError) {
                console.error('Error uploading image:', uploadError)
                return
            }

            // Create a URL for the uploaded image
            const uploadedImageUrl =
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/` +
                imagePath?.path

            // Update the inserted post with the image URL
            await supabase
                .from('drafts')
                .update({
                    image: uploadedImageUrl,
                })
                .eq('id', context.params.slug[0])
        }
        setProgress(30)

        tags.filter((tag) => tag && tag.length > 0).map((tag: string) => {
            if (tag.length > 20) {
                setUploading(false)
                setErrorMsg('Topics must be between 1 and 20 characters')
                return
            }
        })
        setProgress(40)

        if (htmlText !== editDraft?.rawText) {
            // const clean = DOMPurify.sanitize(dirty);
            // TODO: Upload user imgs
            const output = generateJSON(htmlText, [
                Document,
                Paragraph,
                Text,
                Bold,
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
            //@ts-ignore
            newDraft[0]['json'] = output
        }
        await supabase
            .from('drafts')
            //@ts-ignore
            .update(newDraft[0])
            .eq('id', context.params.slug[0])
            .select('*')

        setProgress(70)

        tags = tags.map((tag) => {
            return modifyString(tag)
        })

        const { data: tagsArray } = await supabase.rpc('manage_topics', {
            topics: tags,
        })
        if (tagsArray && editDraft) {
            const finalTags = tagsArray.map((tag: any) => {
                return {
                    post: context.params.slug[0],
                    topic: tag.top_id,
                }
            })
            setProgress(90)

            if (tagsArray !== editDraft?.draft_topics) {
                await supabase
                    .from('draft_topics')
                    .delete()
                    .eq('draft', editDraft?.id)
                const { data, error } = await supabase
                    .from('draft_topics')
                    .insert(finalTags)
                    .select('*')
            }
        }
        setProgress(100)
        setUploading(false)
    }

    async function postDraft(formData: any) {
        setUploading(true)
        setErrorMsg('')
        setProgress(10)

        if (!title) {
            title = editDraft?.title
        }

        if (!selectedImage) {
            setUploading(false)
            toast.custom((t) => (
                <Alert type="danger" message="Featured image is required" />
            ))
        }

        // const pipe = await pipeline('feature-extraction', 'Supabase/gte-small')

        // // Generate the embedding from text
        // const output = await pipe(formData.postTitle + formData.postExcerpt, {
        //     pooling: 'mean',
        //     normalize: true,
        // })

        // const embedding = Array.from(output.data)

        tags.filter((tag) => tag && tag.length > 0).map((tag: string) => {
            if (tag.length == 0 || tag == null || tag.length > 20) {
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

        // Get the authenticated user
        const { data: session } = await supabase.auth.getUser()

        const outputJson = generateJSON(htmlText, [
            Document,
            Paragraph,
            Text,
            Bold,
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

        if (!session.user) {
            toast.custom((t) => (
                <Alert type="danger" message="You must be logged in to post" />
            ))
            return
        }

        // Create a new post in the database
        const { data, error } = await supabase.from('posts').insert([
            {
                title: title,
                description: postOptionsData.excerptText,
                license: postOptionsData.license,
                author: session.user?.id,
                json: outputJson,
                // embedding: embedding,
                estimatedReadingTime: Math.round(strWords(text) / 200),
                text: text,
            },
        ])

        if (error) {
            toast.custom((t) => <Alert type="danger" message={error.message} />)

            return
        }

        // Get the post ID
        //@ts-ignore
        const postId = data[0].id

        setProgress(30)

        //Upload the selected image to Supabase storage with the post's ID as the name
        const { data: imagePath, error: uploadError } = await supabase.storage
            .from('images')
            .upload(
                `${session.user?.id}/${postId}/main-image`,
                //@ts-ignore
                selectedImage
            )

        await supabase.storage
            .from('images')
            .remove([
                `${session.user?.id}/drafts/${context.params.slug[0]}/main-image`,
            ])

        if (uploadError) {
            console.error('Error uploading image:', uploadError)
            return
        }

        // Create a URL for the uploaded image
        const uploadedImageUrl =
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/` +
            imagePath?.path

        // Update the inserted post with the image URL
        const { data: post, error: postError } = await supabase
            .from('posts')
            .update({
                image: uploadedImageUrl,
            })
            .eq('id', postId)

        if (postError) {
            console.error('Error updating post:', postError)
            return
        }

        setProgress(50)

        tags = tags.map((tag) => {
            return modifyString(tag)
        })

        const { data: tagsArray } = await supabase.rpc('manage_topics', {
            topics: tags,
        })
        if (tagsArray) {
            const finalTags = tagsArray.map((tag: any) => {
                return {
                    post: postId,
                    topic: tag.top_id,
                }
            })

            setProgress(70)

            // Insert the tags into the database
            const { data: tagData, error: tagError } = await supabase
                .from('post_topics')
                .insert(finalTags)
                .select('*')

            if (tagError) {
                setUploading(false)
                console.error('Error inserting tags:', tagError)
                return
            }
        }

        setProgress(90)

        // Delete the draft from the database
        await supabase.from('drafts').delete().eq('id', context.params.slug[0])

        setProgress(100)
        router.push(`/post/${postId}`)
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

    const handleApplyPostOptions = (data: PostOptionsData) => {
        setPostOptionsData(data)
    }

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
                                    await sendDraft(data)
                                })}
                                method="post"
                            >
                                <Label className="block sm:col-span-1 md:col-span-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                    <TitleEditor
                                        onUpdate={(editor) => {
                                            setTitle(editor.getText())
                                        }}
                                        defaultTitle={editDraft?.title}
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
                                        defaultValue={editDraft?.draft_topics?.flatMap(
                                            (topic) => topic.topic.name
                                        )}
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
                                                                : editDraft?.image
                                                                  ? editDraft?.image
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
                                                            className={`relative cursor-pointer rounded-md font-medium text-blue-700 hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 ${
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
                                                defaultContent={
                                                    editDraft?.json
                                                        ? editDraft?.json
                                                        : json
                                                }
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
                                            defaultContent={
                                                editDraft?.json
                                                    ? editDraft?.json
                                                    : json
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="pt-2 md:col-span-2 flex space-x-12 justify-center">
                                    {uploading ? (
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
                                    ) : (
                                        <>
                                            <ButtonPrimary
                                                type="submit"
                                                className="text-white px-2 py-1 rounded-lg"
                                            >
                                                Save Draft
                                            </ButtonPrimary>
                                            <ButtonPrimary
                                                type="button"
                                                onClick={handleSubmit(
                                                    async (data, event) => {
                                                        await postDraft(data)
                                                    }
                                                )}
                                                className="text-white px-2 py-1 rounded-lg ml-2"
                                            >
                                                Post Draft
                                            </ButtonPrimary>
                                            <PostOptionsBtn
                                                defaultData={postOptionsData}
                                                onSubmit={
                                                    handleApplyPostOptions
                                                }
                                            />
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

export default EditDraft
