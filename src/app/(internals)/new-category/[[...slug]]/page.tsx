'use client'

import Alert from '@/components/Alert/Alert'
import Input from '@/components/Input/Input'
import CategoryType from '@/types/CategoryType'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import NextImage from 'next/image'
import Label from '@/components/Label/Label'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Select from '@/components/Select/Select'

async function getData(context: { params: { slug: any } }) {
    const slug = context.params.slug[0]
    const supabase = createClientComponentClient()

    const { data, error } = await supabase
        .from('categories')
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

const NewCategoryPage = (context: { params: { slug: any } }) => {
    let s = context.params.slug[0]
    s = modifyString(decodeURIComponent(s))
    const [data, setData] = useState<CategoryType>()
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
                const supabase = createClientComponentClient()
                const { data: session } = await supabase.auth.getSession()
                if (
                    session.session?.user.id !==
                        'd8101ee4-ae24-4f0f-bf00-0674140b4675' &&
                    session.session?.user.id !==
                        'b0156ec3-2660-421e-8aea-bb704cf67ec4'
                ) {
                    router.push('/')
                }
                const data = res ? res : { name: { s }, color: '', image: '' }
                if (data.color) {
                    setExists(true)
                }
                setData(res)
                if (data.image) {
                    setSelectedImage(data.image)
                }
                setLoading(false)
            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        router.push(`/new-category/${searchValue}`)
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

    const sendCategory = async (data: any) => {
        setUploading(true)
        setErrorMsg('')
        console.log(data.catName)
        try {
            const supabase = createClientComponentClient()

            if (!exists) {
                const { data: newCat, error: catError } = await supabase
                    .from('categories')
                    .insert([
                        {
                            name: data.catName,
                            color: data.color,
                        },
                    ])
                    .select()
                if (selectedImage) {
                    const { data: path, error } = await supabase.storage
                        .from('categories')
                        .upload(`${data.catName}`, selectedImage)

                    console.log('Storage' + error)

                    if (!error) {
                        if (newCat !== null) {
                            const { data: update, error: updateErr } =
                                await supabase
                                    .from('categories')
                                    .update({ image: path?.path })
                                    .eq('id', newCat[0].id)
                            console.log(updateErr)
                        }
                    }
                }
            } else {
                if (selectedImage) {
                    const { data: path, error } = await supabase.storage
                        .from('categories')
                        .upload(
                            `${data.catName}/${data.catName}`,
                            selectedImage
                        )

                    console.log(path)

                    if (!error) {
                        await supabase
                            .from('categories')
                            .update({
                                image:
                                    'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/categories/' +
                                    path?.path,
                                color: data.color,
                            })
                            .eq('name', s)
                    } else {
                        const { data: update, error: updateErr } =
                            await supabase
                                .from('categories')
                                .update({ color: data.color })
                                .eq('name', s)
                        console.log(update, updateErr)
                    }
                } else {
                    await supabase
                        .from('categories')
                        .update({ color: data.color })
                        .eq('name', s)
                }
            }
            setUploading(false)
            setSuccess(true)
        } catch (error: any) {
            setErrorMsg(error.message)
            setUploading(false)
        }
    }

    return (
        <div className={`nc-PageSearchV2`}>
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
                            async (data) => await sendCategory(data)
                        )}
                        method="post"
                    >
                        <label className="block md:col-span-2">
                            <label>Name</label>
                            <Controller
                                name="catName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        className="mt-2"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.catName && (
                                <Alert type="danger" message="Required" />
                            )}
                        </label>
                        <label className="block">
                            <label>Color</label>
                            <Controller
                                name="color"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        defaultValue={data ? data.color : 'Red'}
                                        className="mt-1"
                                        {...field}
                                    >
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
                                            <p className="text-xs text-neutral-500">
                                                PNG, JPG, up to 10MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <ButtonPrimary
                            className="md:col-span-2"
                            type="submit"
                            disabled={uploading}
                        >
                            {uploading ? (
                                <span className="animate-spin">Loading</span>
                            ) : (
                                'Submit Category'
                            )}
                        </ButtonPrimary>
                        {errorMsg && <Alert type="danger" message={errorMsg} />}
                        {success && (
                            <Alert type="success" message="Category uploaded" />
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewCategoryPage
