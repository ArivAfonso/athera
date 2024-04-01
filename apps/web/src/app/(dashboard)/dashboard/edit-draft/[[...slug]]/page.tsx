'use client'

import React, { useEffect, useState } from 'react'
import Input from '@/components/Input/Input'
import NextImage from 'next/image'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Textarea from '@/components/Textarea/Textarea'
import Label from '@/components/Label/Label'
import { createClient } from '@/utils/supabase/client'
import { Controller, useForm } from 'react-hook-form'
import Alert from '@/components/Alert/Alert'
import { useRouter } from 'next/navigation'
import stringToSlug from '@/utils/stringToSlug'
import DraftType from '@/types/DraftType'
import { TrashIcon } from '@heroicons/react/24/solid'
import Heading2 from '@/components/Heading/Heading2'
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
    let [htmlText, setHtmlText] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    let [title, setTitle] = useState('' as any)
    const [uploading, setUploading] = useState(false)
    const [bigTag, setBigTag] = useState(false)
    const [imgChanged, setImgChanged] = useState(false)
    const [json, setJson] = useState('' as any)

    const isMobile = window.innerWidth < 700

    let [tags, setTags] = useState([''])
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        async function getData() {
            const { data: session } = await supabase.auth.getSession()

            if (!session.session) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('drafts')
                .select(
                    'title, id, created_at, json, description, image, author(name, id), draft_categories(category:categories(id,name,color))'
                )
                .eq('id', context.params.slug[0])
                .single()

            const draftData: DraftType | null = data as unknown as DraftType

            if (session.session.user.id !== draftData?.author?.id) {
                router.push('/')
            }

            if (draftData) {
                // rteObj.value = draftData.rawText
                setEditDraft(draftData)
                if (draftData.draft_categories) {
                    setTags(
                        draftData.draft_categories.map(
                            (category) => category.category.name
                        )
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
                }
            }
        }
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleKeyDown(e: any) {
        setBigTag(false)
        setErrorMsg('')
        // If user did not press enter key, return
        if (e.key !== 'Enter') return
        // Get the value of the input
        e.preventDefault()
        const value = e.target.value
        // If the value is empty or longer than 20 characters, show an error message and return
        if (!value.trim()) {
            // Show error message for empty input
            console.error('Input is empty')
            return
        } else if (value.length > 20) {
            // Show error message for tag length more than 20 characters
            setBigTag(true)
            return
        }
        // Check if the tag already exists in the tags array
        if (tags.includes(value)) {
            setErrorMsg('Category already added')
            return
        }
        // Add the value to the tags array
        setTags([...tags, value])
        // Clear the input
        e.target.value = ''
    }

    function removeTag(index: number) {
        setTags(tags.filter((_, i) => i !== index))
    }

    async function sendDraft(formData: any) {
        setUploading(true)
        setErrorMsg('')
        setProgress(10)

        // Get the authenticated user
        const {
            data: { user },
        } = await supabase.auth.getUser()

        //@ts-ignore
        let newDraft: DraftType[] = [
            {
                //@ts-ignore
                title: editDraft?.title,
                //@ts-ignore
                description: editDraft?.description,
                //@ts-ignore
                json: editDraft?.json,
            },
        ]

        if (formData.draftTitle !== editDraft?.title) {
            newDraft[0]['title'] = formData.draftTitle
            // // Generate the embedding from text
            // const output = await pipe(
            //     formData.draftTitle + formData.draftExcerpt,
            //     {
            //         pooling: 'mean',
            //         normalize: true,
            //     }
            // )
        }
        if (formData.draftExcerpt !== editDraft?.description) {
            newDraft[0]['description'] = formData.draftExcerpt
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
                'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/' +
                imagePath?.path

            // Update the inserted post with the image URL
            console.log(uploadedImageUrl)
            console.log(context.params.slug[0])
            const { data, error } = await supabase
                .from('drafts')
                .update({
                    image: uploadedImageUrl,
                })
                .eq('id', context.params.slug[0])
            console.log(data)
            console.log(error)
        }
        setProgress(30)

        tags.filter((tag) => tag && tag.length > 0).map((tag: string) => {
            if (tag.length > 20) {
                setUploading(false)
                setErrorMsg('Categories must be between 1 and 20 characters')
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
        const { data, error } = await supabase
            .from('drafts')
            .update(newDraft[0])
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
                            draft: context.params.slug[0],
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
                                draft: context.params.slug[0],
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

        if (tagsArray !== editDraft?.draft_categories) {
            await supabase
                .from('draft_categories')
                .delete()
                .eq('draft', editDraft?.id)
            const { data, error } = await supabase
                .from('draft_categories')
                .insert(tagsArray)
                .select('*')
            console.log(error)
        }
        setProgress(100)
        setUploading(false)
    }

    async function postDraft(formData: any) {
        setUploading(true)
        setErrorMsg('')
        setProgress(10)

        if (!formData.draftTitle) {
            formData.draftTitle = editDraft?.title
        }

        console.log(formData.draftTitle)
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
                        message="Categories must be between 1 and 20 characters"
                    />
                ))
                return
            }
        })

        // Get the authenticated user
        const { data: session } = await supabase.auth.getSession()

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

        // Create a new post in the database
        const { data, error } = await supabase.from('post').insert([
            {
                title: formData.draftTitle,
                description: formData.draftExcerpt,
                author: session?.session?.user?.id,
                json: outputJson,
                // embedding: embedding,
                estimatedReadingTime: Math.round(strWords(text) / 200),
                text: text,
            },
        ])

        if (error) {
            toast.custom((t) => <Alert type="danger" message={error.message} />)
            console.log(error)
            console.log(data)
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
                `${session?.session?.user?.id}/${postId}/main-image`,
                //@ts-ignore
                selectedImage
            )

        await supabase.storage
            .from('images')
            .remove([
                `${session?.session?.user?.id}/drafts/${context.params.slug[0]}/main-image`,
            ])

        if (uploadError) {
            console.error('Error uploading image:', uploadError)
            return
        }

        // Create a URL for the uploaded image
        const uploadedImageUrl =
            'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/' +
            imagePath?.path

        // Update the inserted post with the image URL

        const { data: post, error: postError } = await supabase
            .from('post')
            .update({
                image: uploadedImageUrl,
            })
            .eq('id', postId)

        if (postError) {
            console.error('Error updating post:', postError)
            return
        }

        setProgress(50)

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
                            colors[Math.floor(Math.random() * colors.length)]
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
                            setUploading(false)
                            return null // or any other suitable value
                        }
                    }
                })
        )

        setProgress(70)

        // Insert the tags into the database
        const { data: tagData, error: tagError } = await supabase
            .from('post_categories')
            .insert(tagsArray)
            .select('*')

        if (tagError) {
            setUploading(false)
            console.error('Error inserting tags:', tagError)
            return
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
                                                            Upload a file
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
                                        editDraft?.json ? editDraft?.json : json
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
                                            style={{ width: `${progress}%` }}
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

export default EditDraft
