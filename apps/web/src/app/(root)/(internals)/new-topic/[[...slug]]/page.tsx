'use client'

import TopicType from '@/types/TopicType'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import NextImage from 'next/image'
import { Input, Alert, Label, Select, ButtonPrimary } from 'ui'
import toast from 'react-hot-toast'

async function getData(context: { params: { slug: any } }) {
    const slug = context.params.slug[0]
    const supabase = createClient()

    const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('name', slug)
        .single()
    return data
}

function modifyString(str: string) {
    //Capitalize every word of the string and replace spaces with -
    return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-')
}

const NewTopicPage = (context: { params: { slug: any } }) => {
    let s = context.params.slug[0]
    s = modifyString(decodeURIComponent(s))
    const [data, setData] = useState<TopicType>()
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [success, setSuccess] = useState(false)
    const [exists, setExists] = useState(false)
    const router = useRouter()
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getData(context)
                const supabase = createClient()
                const { data: session } = await supabase.auth.getUser()
                //Search the admins table for the user's email

                if (!session.user) {
                    router.push('/')
                    return
                }

                const { data: admin, error } = await supabase
                    .from('admins')
                    .select('*')
                    .eq('user_id', session.user?.id)
                if (!admin) {
                    router.push('/')
                }
                const data = res ? res : { name: { s }, color: '', image: '' }
                if (data.color) {
                    setExists(true)
                }
                if (res) {
                    //@ts-ignore
                    setData(res)
                }
                setTags([s])
                if (data.image) {
                    //@ts-ignore
                    setSelectedImage(data.image)
                }
                setLoading(false)
            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const [searchValue, setSearchValue] = useState('')

    const handleImageSelect = (event: { target: { files: any[] } }) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedImage(file)
        }
    }

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (searchValue === '') return
        else if (setSearchValue === s) return
        router.push(`/new-topic/${searchValue}`)
    }

    const [tags, setTags] = useState([''])

    function handleKeyDown(e: any) {
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
            toast.error('Topics must be between 1 and 20 characters')
            return
        }
        // Add the value to the tags array
        setTags([...tags, modifyString(value)])
        // Clear the input
        e.target.value = ''
    }

    function removeTag(index: number) {
        setTags(tags.filter((el, i) => i !== index))
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
                file.type === 'image/svg' ||
                file.type === 'image/webp' ||
                file.type === 'image/avif'
            ) {
                setSelectedImage(file)
            } else {
                // Handle the case when the file type is not supported
                setErrorMsg(
                    'Unsupported file type. Please use PNG, JPG, or JPEG.'
                )
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

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm() // Initialize the hook

    const sendTopic = async (data: any) => {
        setUploading(true)
        if (data.color === '') {
            data.color = 'Red'
        }
        setErrorMsg('')
        try {
            const supabase = createClient()

            if (selectedImage === null) {
                toast.error('Please select an image')
                return
            }

            const { data: path, error } = await supabase.storage
                .from('categories')
                .upload(`${s}/${s}`, selectedImage)
            //@ts-ignore

            tags.forEach(async (tag) => {
                const { data: topic, error } = await supabase
                    .from('topics')
                    .select('*')
                    .eq('name', tag)
                    .single()

                if (topic) {
                    await supabase
                        .from('topics')
                        .update({
                            color: data.color,
                            image:
                                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/categories/` +
                                path?.path,
                        })
                        .eq('name', tag)
                    return
                } else {
                    await supabase.from('topics').insert([
                        {
                            name: tag,
                            color: data.color,
                            image:
                                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/categories/` +
                                path?.path,
                        },
                    ])
                }
            })
            setUploading(false)
            setSuccess(true)
        } catch (error: any) {
            setErrorMsg(error.message)
            setUploading(false)
        }
    }

    return (
        <div className={`NewTopic`}>
            <div
                className={`h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-100/50 dark:bg-neutral-900`}
            />
            <div className="container">
                <header className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7">
                    <form
                        className="relative"
                        action=""
                        method="post"
                        onSubmit={handleSearchSubmit}
                    >
                        <label
                            htmlFor="search-input"
                            className="text-neutral-500 dark:text-neutral-300"
                        >
                            <span className="sr-only">Search all icons</span>
                            <Input
                                id="search-input"
                                type="search"
                                placeholder="Type and press enter"
                                className="shadow-lg rounded-xl border-opacity-0"
                                sizeClass="pl-14 py-5 pr-5 md:pl-16"
                                defaultValue={s}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
                                <svg
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M19.25 19.25L15.5 15.5M4.75 11C4.75 7.54822 7.54822 4.75 11 4.75C14.4518 4.75 17.25 7.54822 17.25 11C17.25 14.4518 14.4518 17.25 11 17.25C7.54822 17.25 4.75 14.4518 4.75 11Z"
                                    ></path>
                                </svg>
                            </span>
                        </label>
                    </form>
                </header>
            </div>
            <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
                <div className="rounded-xl md:border md:border-neutral-100 dark:border-neutral-800 md:p-6">
                    <form
                        className="grid md:grid-cols-2 gap-6"
                        action="#"
                        onSubmit={handleSubmit(
                            async (data) => await sendTopic(data)
                        )}
                        method="post"
                    >
                        <Label className="block sm:col-span-1 md:col-span-2">
                            <Label>Topics</Label>
                            <Controller
                                name="tags"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <div className="rounded-l w-full sm:w-min-80vw sm:w-600px mt-4 flex flex-wrap items-center gap-2 bg-transparent">
                                            {tags.map((tag, index) =>
                                                tag ? (
                                                    <div
                                                        className="bg-gray-200 dark:bg-neutral-900 flex items-center rounded-full px-3 py-1"
                                                        key={index}
                                                    >
                                                        <span className="text-black dark:text-gray-400 mr-2">
                                                            {tag}
                                                        </span>
                                                        <span
                                                            className="h-5 w-5 bg-gray-800 text-white rounded-full flex items-center justify-center text-lg cursor-pointer"
                                                            onClick={() =>
                                                                removeTag(index)
                                                            }
                                                        >
                                                            &times;
                                                        </span>
                                                    </div>
                                                ) : null
                                            )}
                                            <input
                                                onKeyDown={handleKeyDown}
                                                type="text"
                                                className="flex-grow py-2 rounded-md border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200/50 bg-white dark:border-neutral-500 dark:focus:ring-primary-500/30 dark:bg-neutral-900"
                                                placeholder="Type something"
                                            />
                                        </div>
                                    </>
                                )}
                            />
                        </Label>
                        <label className="block">
                            <label>Color</label>
                            <Controller
                                name="color"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        defaultValue={
                                            data ? data.color : 'Choose'
                                        }
                                        className="mt-1"
                                        {...field}
                                    >
                                        <option value="Choose" disabled>
                                            Choose
                                        </option>
                                        <option value="Red">Red</option>
                                        <option value="Blue">Blue</option>
                                        <option value="Yellow">Yellow</option>
                                        <option value="Green">Green</option>
                                        <option value="Purple">Purple</option>
                                        <option value="Orange">Orange</option>
                                        <option value="Pink">Pink</option>
                                        <option value="Brown">Brown</option>
                                        <option value="Gray">Gray</option>
                                    </Select>
                                )}
                            />
                        </label>

                        <div className="block md:col-span-2">
                            <Label>Featured Image</Label>

                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-md"
                            >
                                <div className="space-y-1 text-center">
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
                                                    className={`relative cursor-pointer rounded-md font-medium text-blue-700 hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 ${
                                                        isDragging
                                                            ? 'border-2 border-blue-700'
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
                                            <p className="text-xs text-neutral-500">
                                                PNG, JPG, up to 10MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-center">
                            {uploading ? (
                                <ButtonPrimary loading>
                                    Submitting...
                                </ButtonPrimary>
                            ) : (
                                <ButtonPrimary
                                    type="submit"
                                    className="text-white px-2 py-1 rounded-lg"
                                >
                                    Submit Topic
                                </ButtonPrimary>
                            )}
                        </div>
                        {errorMsg && <Alert type="danger" message={errorMsg} />}
                        {success && (
                            <Alert type="success" message="Topic uploaded" />
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewTopicPage
