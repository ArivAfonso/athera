'use client'

import React, { FC, useEffect, useState } from 'react'
import { Input, Image, Alert, Button, Textarea, Label, ButtonPrimary } from 'ui'
import { createClient } from '@/utils/supabase/client'
import { useForm, Controller } from 'react-hook-form'
import ModalEditUsername from './ModalEditUsername'
import { MailIcon, PhoneIcon } from 'lucide-react'

function isValidHttpUrl(string: string) {
    let url

    try {
        url = new URL(string)
    } catch (_) {
        return false
    }

    return url.protocol === 'http:' || url.protocol === 'https:'
}

function AccountPage() {
    const { handleSubmit, register } = useForm()
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const supabase = createClient()
    const [session, setSession] = useState<any>(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [imgChanged, setImgChanged] = useState(false)

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        website: '',
        bio: '',
        avatar: '',
        background: '',
        phone: '',
        tiktok: '',
        twitter: '',
        facebook: '',
        youtube: '',
        github: '',
        instagram: '',
        linkedin: '',
        pinterest: '',
        twitch: '',
    })

    async function updateProfile(formData: any) {
        setLoading(true)
        setError('')
        try {
            if (formData.website && !isValidHttpUrl(formData.website)) {
                setError('Invalid website url')
                setLoading(false)
                return
            } else if (formData.website == '')
                formData.website = profile.website
            if (formData.phone == '') formData.phone = profile.phone
            if (formData.about == '') formData.about = profile.bio
            if (formData.avatar == '') formData.avatar = profile.avatar
            let imgUrl
            if (imageFile) {
                // Upload the image file to Supabase Storage
                const random = Math.floor(10000 + Math.random() * 90000)

                await supabase.storage
                    .from('avatars')
                    .remove([`${session.user?.id}`])

                await supabase.storage
                    .from('avatars')
                    .upload(`${session.user?.id}/avatar${random}`, imageFile)
                imgUrl = `https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/avatars/${session.user?.id}/avatar${random}`
                await supabase.auth.updateUser({
                    data: {
                        avatar_url: imgUrl,
                    },
                })
            }

            if (
                formData.fullName !== session.user?.user_metadata.full_name &&
                formData.fullName !== ''
            ) {
                await supabase.auth.updateUser({
                    data: {
                        full_name: formData.fullName,
                    },
                })
            }

            if (imgChanged) {
                const { data: imgPath, error: imgError } =
                    await supabase.storage.from('avatars').upload(
                        `${session.user?.id}/bg`,
                        //@ts-ignore
                        selectedImage
                    )
                if (imgError) {
                    setError('Error uploading image')
                    setLoading(false)
                    return
                }
                formData.background =
                    'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/avatars/' +
                    imgPath.path
            }

            await supabase
                .from('users')
                .update([
                    {
                        id: session.user?.id,
                        name:
                            formData.fullName == ''
                                ? profile.name
                                : formData.fullName,
                        // email: formData.email,
                        website: formData.website,
                        background: formData.background
                            ? formData.background
                            : profile.background,
                        bio: formData.about,
                        avatar: imgUrl ? imgUrl : profile.avatar,
                        phone: formData.phone,
                    },
                ])
                .eq('id', session.user?.id)
            setSuccess('Profile updated successfully')
            setLoading(false)
        } catch (error) {}
    }

    useEffect(() => {
        async function checkLikedStatus() {
            const supabase = createClient()
            const { data: session } = await supabase.auth.getUser()
            setSession(session)
            const userId = session.user?.id
            // Check if the post is liked by the user
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()
            setProfile(data)
        }
        checkLikedStatus()
    }, [])

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
                setError('Unsupported file type. Please use PNG, JPG, or JPEG.')
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

    const handleImageSelect = (event: { target: { files: any[] } }) => {
        const file = event.target.files[0]
        if (file) {
            setImageFile(file)
        }
    }

    return (
        <>
            <title>Edit Profile - Athera</title>
            <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
                <form
                    onSubmit={handleSubmit(async (data) => {
                        if (Object.keys(data).length > 0) {
                            await updateProfile(data)
                        }
                    })}
                    className={`AccountPage`}
                >
                    <div className="space-y-10 sm:space-y-12">
                        {/* HEADING */}
                        <h2 className="text-2xl sm:text-3xl font-semibold">
                            Account information
                        </h2>
                        <div className="flex flex-col md:flex-row">
                            <div className="flex-shrink-0 flex flex-col items-center">
                                {/* AVATAR */}
                                <div className="relative rounded-full overflow-hidden flex">
                                    <Image
                                        src={
                                            imageFile
                                                ? URL.createObjectURL(imageFile)
                                                : profile.avatar
                                        }
                                        alt="avatar"
                                        width={128}
                                        height={128}
                                        className="w-32 h-32 rounded-full object-cover cursor-pointer z-0"
                                        onClick={() =>
                                            //@ts-ignore
                                            document
                                                .getElementById('fileInput')
                                                .click()
                                        }
                                    />
                                    <div
                                        onClick={() =>
                                            //@ts-ignore
                                            document
                                                .getElementById('fileInput')
                                                .click()
                                        }
                                        className="absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center text-neutral-50 cursor-pointer"
                                    >
                                        <svg
                                            width="30"
                                            height="30"
                                            viewBox="0 0 30 30"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>

                                        <span className="mt-1 text-xs">
                                            Change Image
                                        </span>
                                    </div>
                                    <Input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        id="fileInput"
                                        //@ts-ignore
                                        onChange={handleImageSelect}
                                    />
                                </div>
                                <Button
                                    pattern="white"
                                    className="mt-2"
                                    onClick={() => {
                                        setShowModal(true)
                                    }}
                                >
                                    Change Username
                                </Button>
                            </div>
                            <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
                                <div>
                                    <Label>Full name</Label>
                                    <Input
                                        {...register('fullName')}
                                        className="mt-1.5"
                                        maxLength={50}
                                        defaultValue={profile.name}
                                    />
                                </div>
                                {/* Other form fields */}
                                <div>
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
                                                <Image
                                                    src={URL.createObjectURL(
                                                        selectedImage
                                                    )}
                                                    alt="Selected Image"
                                                    width={1260} // Adjust the desired width
                                                    height={750} // Adjust the desired height
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
                                                    <p className="text-xs text-neutral-500">
                                                        PNG, JPG up to 1MB
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Replace Input and Label components with plain HTML Inputs and Labels */}
                                <div>
                                    <Label>Email</Label>
                                    <div className="mt-1.5 flex">
                                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                            <MailIcon
                                                className="w-5 h-5"
                                                aria-hidden="true"
                                                strokeWidth={1.5}
                                            />
                                        </span>
                                        <Input
                                            {...register('email')}
                                            className="!rounded-l-none"
                                            placeholder="youremail@com"
                                            defaultValue={profile.email}
                                        />
                                    </div>
                                </div>
                                {/* Other form fields */}
                                <div>
                                    <Label>Phone number</Label>
                                    <div className="mt-1.5 flex">
                                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                            <PhoneIcon
                                                className="w-5 h-5"
                                                aria-hidden="true"
                                                strokeWidth={1.5}
                                            />
                                        </span>
                                        <Input
                                            {...register('phone')}
                                            className="!rounded-l-none"
                                            placeholder="000 0000 000"
                                            defaultValue={profile.phone}
                                        />
                                    </div>
                                </div>
                                {/* ---- */}
                                <div>
                                    <Label>About you</Label>
                                    <Textarea
                                        {...register('about')}
                                        className="mt-1.5"
                                        rows={5}
                                        defaultValue={profile.bio}
                                    />
                                </div>
                                <div className="pt-2 flex justify-center">
                                    {loading ? (
                                        <ButtonPrimary
                                            className="text-white px-2 py-1 rounded-lg"
                                            loading
                                        >
                                            Submitting...
                                        </ButtonPrimary>
                                    ) : (
                                        <ButtonPrimary
                                            type="submit"
                                            className="text-white px-2 py-1 rounded-lg"
                                        >
                                            Update account
                                        </ButtonPrimary>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                {success && <Alert type="success" message={success} />}
                {error && <Alert type="danger" message={error} />}
                {showModal && (
                    <ModalEditUsername
                        show={showModal}
                        onCloseModal={() => setShowModal(false)}
                        id={session.user?.id}
                    />
                )}
            </div>
        </>
    )
}

export default AccountPage
