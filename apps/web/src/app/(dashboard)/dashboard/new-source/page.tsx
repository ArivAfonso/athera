'use client'

import React, { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { Alert, Label, ButtonPrimary, Textarea, Input } from 'ui'
import { createClient } from '@/utils/supabase/client'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import TitleEditor, {
    DescriptionEditor,
} from '@/components/PostSubmissionEditor/TitleEditor'
import { TrashIcon } from 'lucide-react'

function strWords(str: string) {
    return str.split(/\s+/).length
}

interface ImageObject {
    type: string
    attrs?: {
        src?: string
        alt?: string
        name?: string | null
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

// Define the source suggestion interface
interface SourceSuggestion {
    id: number
    name: string
    description: string
    url: string
    sitemap: string
    logo?: string | null
    banner?: string | null
}

const DashboardSubmitSource = () => {
    const supabase = createClient()

    const [errorMsg, setErrorMsg] = useState('')
    const [selectedLogo, setSelectedLogo] = useState(null)
    const [selectedBanner, setSelectedBanner] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [description, setDescription] = useState('')

    const [name, setname] = useState('')

    async function sendSource(formData: any) {
        setUploading(true)
        setErrorMsg('')
        setProgress(10)

        const { data: user } = await supabase.auth.getUser()

        const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/
        const sitemapRegex = /^(https?:\/\/[^\s$.?#].[^\s]*\/sitemap\.xml)$/
        if (!urlRegex.test(formData.source_url)) {
            toast.custom((_) => (
                <Alert type="danger" message="Invalid source URL" />
            ))
            setUploading(false)
            return
        }
        if (!sitemapRegex.test(formData.source_sitemap)) {
            toast.custom((_) => (
                <Alert
                    type="danger"
                    message="Invalid source sitemap URL. It must end with /sitemap.xml"
                />
            ))
            setUploading(false)
            return
        }

        setProgress(70)
        const { data, error: insertError } = await supabase
            .from('source_suggestions')
            .insert([
                {
                    name: name,
                    description: description,
                    url: formData.source_url,
                    sitemap: formData.source_sitemap,
                    user_id: user.user?.id,
                },
            ])
            .select() // Add this to ensure data is returned

        if (insertError) {
            toast.custom((_) => (
                <Alert type="danger" message="Source submission failed" />
            ))
            setUploading(false)
            return
        }

        // Type guard check - data is an array of source suggestions or null
        if (!data || data.length === 0) {
            toast.custom((_) => (
                <Alert type="danger" message="Source submission failed" />
            ))
            setUploading(false)
            return
        }

        // Now TypeScript knows data is an array with at least one item
        const sourceId = (data[0] as SourceSuggestion).id

        let logoUrl = null,
            bannerUrl = null
        if (selectedLogo) {
            const { data, error } = await supabase.storage
                .from('source-suggestions')
                .upload(`${sourceId}/logo`, selectedLogo)
            if (error) {
                toast.custom((_) => (
                    <Alert type="danger" message="Logo upload failed" />
                ))
                setUploading(false)
                return
            }
            const { data: logo } = supabase.storage
                .from('source-suggestions')
                .getPublicUrl(`${sourceId}/logo`)
            logoUrl = logo.publicUrl
        }
        setProgress(50)
        if (selectedBanner) {
            const bannerPath = `${sourceId}/banner`
            const { data, error } = await supabase.storage
                .from('source-suggestions')
                .upload(bannerPath, selectedBanner)
            if (error) {
                toast.custom((_) => (
                    <Alert type="danger" message="Banner upload failed" />
                ))
                setUploading(false)
                return
            }
            const { data: banner } = supabase.storage
                .from('source-suggestions')
                .getPublicUrl(bannerPath)
            bannerUrl = banner.publicUrl
        }
        setProgress(100)

        //Update the source suggestion with the logo and banner URLs
        const { error: updateError } = await supabase
            .from('source_suggestions')
            .update({
                logo: logoUrl,
                banner: bannerUrl,
            })
            .eq('id', sourceId)

        if (updateError) {
            toast.custom((_) => (
                <Alert type="danger" message="Source submission failed" />
            ))
            setUploading(false)
            return
        }

        toast.success('Source submitted successfully!')
        setUploading(false)
    }

    const handleLogoSelect = (event: { target: { files: any[] } }) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedLogo(file)
        }
    }

    const handleBannerSelect = (event: { target: { files: any[] } }) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedBanner(file)
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
                setSelectedLogo(file)
            } else {
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

    const {
        handleSubmit,
        control,
        formState: { errors },
        register,
    } = useForm()

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
                                    setname(editor.getText())
                                }}
                            />
                        </Label>
                        <Label className="block sm:col-span-1 md:col-span-2 ml-0.5">
                            <DescriptionEditor
                                onUpdate={(editor) => {
                                    setDescription(editor.getText())
                                }}
                            />
                        </Label>
                        <Label>Source Logo</Label>
                        <div className="group block md:col-span-2 -mt-4">
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                className="relative mt-1 flex justify-center px-6 pt-3 pb-3 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-2xl"
                            >
                                <div className="space-y-1 text-center">
                                    {selectedLogo ? (
                                        <>
                                            <div className="relative w-48 h-48 mx-auto">
                                                <NextImage
                                                    src={URL.createObjectURL(
                                                        selectedLogo
                                                    )}
                                                    alt="Selected Image"
                                                    fill
                                                    className="object-cover rounded-md"
                                                />
                                            </div>

                                            <div className="opacity-0 group-hover:opacity-100 absolute z-20 end-2.5 top-2.5 flex gap-1">
                                                <div
                                                    className="p-1.5 bg-black dark:bg-neutral-700 text-white rounded-md cursor-pointer transition-opacity duration-300"
                                                    title="Delete image"
                                                    onClick={() => {
                                                        setSelectedLogo(null)
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
                                                    htmlFor="logo-upload"
                                                    className={`relative cursor-pointer rounded-md font-medium text-primary-6000 hover:text-primary-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 ${isDragging ? 'border-2 border-primary-500' : ''}`}
                                                >
                                                    {isDragging ? (
                                                        <span>Drop here</span>
                                                    ) : (
                                                        <span>
                                                            Upload an image
                                                        </span>
                                                    )}
                                                    <input
                                                        id="logo-upload"
                                                        name="logo-upload"
                                                        type="file"
                                                        accept="image/png, image/jpeg, image/jpg"
                                                        className="sr-only"
                                                        //@ts-ignore
                                                        onChange={
                                                            handleLogoSelect
                                                        }
                                                    />
                                                </label>
                                                <p className="pl-1">
                                                    or drag and drop
                                                </p>
                                            </div>
                                            <p className="text-xs text-neutral-500 pb-4">
                                                PNG, JPG up to 1MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Label>Source Banner Image</Label>
                        <div className="group block md:col-span-2 -mt-4">
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                className="relative mt-1 flex justify-center px-6 pt-3 pb-3 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-2xl"
                            >
                                <div className="space-y-1 text-center">
                                    {selectedBanner ? (
                                        <>
                                            <NextImage
                                                src={URL.createObjectURL(
                                                    selectedBanner
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
                                                        setSelectedBanner(null)
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
                                                    htmlFor="banner-upload"
                                                    className={`relative cursor-pointer rounded-md font-medium text-primary-6000 hover:text-primary-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 ${isDragging ? 'border-2 border-primary-500' : ''}`}
                                                >
                                                    {isDragging ? (
                                                        <span>Drop here</span>
                                                    ) : (
                                                        <span>
                                                            Upload an image
                                                        </span>
                                                    )}
                                                    <input
                                                        id="banner-upload"
                                                        name="banner-upload"
                                                        type="file"
                                                        accept="image/png, image/jpeg, image/jpg"
                                                        className="sr-only"
                                                        //@ts-ignore
                                                        onChange={
                                                            handleBannerSelect
                                                        }
                                                    />
                                                </label>
                                                <p className="pl-1">
                                                    or drag and drop
                                                </p>
                                            </div>
                                            <p className="text-xs text-neutral-500 pb-4">
                                                PNG, JPG up to 1MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Label className="block">Source URL</Label>
                        <div className="md:col-span-2 -mt-4">
                            <Input
                                type="text"
                                placeholder="https://example.com"
                                {...register('source_url', {
                                    required: 'Source URL is required',
                                })}
                                className="w-full mt-1"
                            />
                            {errors.source_url && (
                                <span className="text-red-500 text-sm mt-1 block">
                                    {errors.source_url.message as string}
                                </span>
                            )}
                        </div>

                        <Label className="block">Source Sitemap</Label>
                        <div className="md:col-span-2 -mt-4">
                            <Input
                                type="text"
                                placeholder="https://example.com/sitemap.xml"
                                {...register('source_sitemap', {
                                    required: 'Source Sitemap is required',
                                })}
                                className="w-full mt-1"
                            />
                            {errors.source_sitemap && (
                                <span className="text-red-500 text-sm mt-1 block">
                                    {errors.source_sitemap.message as string}
                                </span>
                            )}
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
