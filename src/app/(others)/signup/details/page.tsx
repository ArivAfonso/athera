'use client'

import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Heading2 from '@/components/Heading/Heading2'
import Input from '@/components/Input/Input'
import NcLink from '@/components/NcLink/NcLink'
import Textarea from '@/components/Textarea/Textarea'
import { Controller, useForm } from 'react-hook-form'
import Image from 'next/image'
import Label from '@/components/Label/Label'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

const DetailsPage = ({}) => {
    const supabase = createClientComponentClient()

    const [selectedImage, setSelectedImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const handleImageSelect = (event: { target: { files: any[] } }) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedImage(file)
        }
    }

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm() // Initialize the hook

    async function sendDetails(formData: any) {
        const { data: session } = await supabase.auth.getSession()
        try {
            if (selectedImage) {
                setUploading(true)

                // Upload the image to Supabase Storage

                const { data: imagePath, error: imageUploadError } =
                    await supabase.storage
                        .from('images')
                        .upload(
                            `${session.session?.user?.id}/avatar`,
                            selectedImage
                        )

                const { data, error } = await supabase.from('users').update([
                    {
                        id: session.session?.user?.id,
                        username: formData.username,
                        bio: formData.bio,
                        avatar: imagePath,
                    },
                ])
            } else {
                const { data, error } = await supabase
                    .from('users')
                    .update([
                        {
                            id: session.session?.user?.id,
                            username: formData.username,
                            bio: formData.bio,
                        },
                    ])
                    .eq('id', session.session?.user?.id)
            }
        } catch (error) {
            setErrorMsg('Profile could not be updated')
        }
    }

    return (
        <>
            <header className="text-center max-w-2xl mx-auto - mb-14 sm:mb-16 lg:mb-20">
                <Heading2>Forgot password</Heading2>
                <span className="block text-sm mt-2 text-neutral-700 sm:text-base dark:text-neutral-200">
                    Welcome to our blog magazine Community
                </span>
            </header>

            <div className="max-w-md mx-auto space-y-6">
                {/* FORM */}
                <form
                    className="grid grid-cols-1 gap-6"
                    action="#"
                    method="post"
                    onSubmit={handleSubmit(
                        async (data) => await sendDetails(data)
                    )} // Handle form submission
                >
                    <label className="block">
                        <span className="text-neutral-800 dark:text-neutral-200">
                            Username
                        </span>
                        <Controller
                            name="username" // Field name
                            control={control} // Control prop
                            defaultValue="" // Default value
                            rules={{ required: true }} // Validation rules
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder="Thomas Pablo Vaz"
                                    className="mt-1"
                                />
                            )}
                        />
                    </label>
                    <label className="block md:col-span-2">
                        <label>Bio</label>
                        <Controller
                            name="bio" // Field name
                            control={control} // Control prop
                            defaultValue="" // Default value
                            render={({ field }) => (
                                <>
                                    <Textarea rows={4} {...field} />
                                    <p className="mt-1 text-sm text-neutral-500">
                                        Brief description of yourself
                                    </p>
                                </>
                            )}
                        />
                    </label>
                    <div className="block md:col-span-2">
                        <Label>Featured Image</Label>

                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {selectedImage ? (
                                    <Image
                                        src={URL.createObjectURL(selectedImage)}
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
                                                className="relative cursor-pointer rounded-md font-medium text-primary-6000 hover:text-primary-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    //@ts-ignore
                                                    onChange={handleImageSelect}
                                                />
                                            </label>
                                            <p className="pl-1">
                                                or drag and drop
                                            </p>
                                        </div>
                                        <p className="text-xs text-neutral-500">
                                            PNG, JPG, GIF up to 2MB
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <ButtonPrimary type="submit">Continue</ButtonPrimary>
                </form>
            </div>
        </>
    )
}
