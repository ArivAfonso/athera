'use client'

import React, { FC, useEffect, useState } from 'react'
import { Input, Alert, Label, ButtonPrimary } from 'ui'
import { createClient } from '@/utils/supabase/client'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

function isValidHttpUrl(string: string) {
    let url

    try {
        url = new URL(string)
    } catch (_) {
        return false
    }

    return url.protocol === 'http:' || url.protocol === 'https:'
}

function Socials() {
    const { handleSubmit, register, reset } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            website: '',
            about: '',
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
            twitch: '',
        },
    })
    const [imageFile, setImageFile] = useState(null)
    const [loading, setLoading] = useState(false)
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
        twitch: '',
    })

    async function updateProfile(formData: any) {
        setLoading(true)

        const validateAndAssignUrl = (urlKey: keyof typeof formData) => {
            if (formData[urlKey] && !isValidHttpUrl(formData[urlKey])) {
                setLoading(false)
                return false
            }
            return true
        }

        const urlsToValidate = [
            'website',
            'tiktok',
            'twitter',
            'facebook',
            'youtube',
            'github',
            'instagram',
            'linkedin',
            'twitch',
        ] as const

        for (const urlKey of urlsToValidate) {
            if (!validateAndAssignUrl(urlKey)) {
                return
            }
        }

        try {
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
                    toast.custom((t) => (
                        <Alert type="danger" message="Error uploading image" />
                    ))
                    setLoading(false)
                    return
                }
                formData.background =
                    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/` +
                    imgPath.path
            }

            await supabase
                .from('users')
                .update({
                    name:
                        formData.fullName == ''
                            ? profile.name
                            : formData.fullName,
                    website: formData.website,
                    background: formData.background
                        ? formData.background
                        : profile.background,
                    bio: formData.about,
                    avatar: imgUrl ? imgUrl : profile.avatar,
                    phone: formData.phone,
                    tiktok: formData.tiktok,
                    twitter: formData.twitter,
                    facebook: formData.facebook,
                    youtube: formData.youtube,
                    github: formData.github,
                    instagram: formData.instagram,
                    linkedin: formData.linkedin,
                    twitch: formData.twitch,
                })
                .eq('id', session.user?.id)
            toast.custom((t) => (
                <Alert type="success" message="Profile Updated Successfully" />
            ))

            setLoading(false)
        } catch (error) {}
    }

    useEffect(() => {
        async function checkLikedStatus() {
            const supabase = createClient()
            const { data: session } = await supabase.auth.getUser()
            setSession(session)
            const userId = session.user?.id

            if (!userId) return
            // Check if the post is liked by the user
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()
            if (data) {
                setProfile({
                    name: data.name || '',
                    email: data.email || '',
                    website: data.website || '',
                    bio: data.bio || '',
                    avatar: data.avatar || '',
                    background: data.background || '',
                    phone: data.phone || '',
                    tiktok: data.tiktok || '',
                    twitter: data.twitter || '',
                    facebook: data.facebook || '',
                    youtube: data.youtube || '',
                    github: data.github || '',
                    instagram: data.instagram || '',
                    linkedin: data.linkedin || '',
                    twitch: data.twitch || '',
                })
            }

            //Reset the form with the fetched data
            reset({
                fullName: data?.name ?? '',
                email: data?.email ?? '',
                website: data?.website ?? '',
                about: data?.bio ?? '',
                avatar: data?.avatar ?? '',
                background: data?.background ?? '',
                phone: data?.phone ?? '',
                tiktok: data?.tiktok ?? '',
                twitter: data?.twitter ?? '',
                facebook: data?.facebook ?? '',
                youtube: data?.youtube ?? '',
                github: data?.github ?? '',
                instagram: data?.instagram ?? '',
                linkedin: data?.linkedin ?? '',
                twitch: data?.twitch ?? '',
            })
        }
        checkLikedStatus()
    }, [])

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
                            Socials
                        </h2>
                        <div className="flex flex-col md:flex-row">
                            <div className="flex-grow mt-10 md:mt-0 md:pl-8 max-w-5xl space-y-6">
                                <div className="SocialsProfileForm__fieldsWrap grid grid-cols-1 md:grid-cols-2 gap-5 ">
                                    {/* ---- Youtube */}
                                    <div className="SocialsProfileForm__Youtube">
                                        <Label>Youtube</Label>
                                        <div className="mt-1.5 flex">
                                            <span className="inline-flex items-center px-2.5 rounded-s-2xl border border-e-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="1em"
                                                    viewBox="0 0 576 512"
                                                    fill="currentColor"
                                                >
                                                    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                                                </svg>
                                            </span>
                                            <Input
                                                {...register('youtube')}
                                                className="!rounded-s-none"
                                                sizeClass="h-11 px-4 ps-2 pe-3"
                                                placeholder="https://www.youtube.com/channel/yourname"
                                            />
                                        </div>
                                    </div>

                                    {/* ----Facebook */}
                                    <div className="SocialsProfileForm__Facebook">
                                        <Label>Facebook</Label>
                                        <div className="mt-1.5 flex">
                                            <span className="inline-flex items-center px-2.5 rounded-s-2xl border border-e-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                                <svg
                                                    fill="currentColor"
                                                    className="w-5 h-5"
                                                    height="1em"
                                                    viewBox="0 0 512 512"
                                                >
                                                    <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
                                                </svg>
                                            </span>
                                            <Input
                                                {...register('facebook')}
                                                className="!rounded-s-none"
                                                sizeClass="h-11 px-4 ps-2 pe-3"
                                                placeholder="https://www.facebook.com/yourname"
                                            />
                                        </div>
                                    </div>
                                    {/* ---- Github */}
                                    <div className="SocialsProfileForm__Github">
                                        <Label>Github </Label>
                                        <div className="mt-1.5 flex">
                                            <span className="inline-flex items-center px-2.5 rounded-s-2xl border border-e-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                                <svg
                                                    fill="currentColor"
                                                    height="1em"
                                                    viewBox="0 0 496 512"
                                                    className="w-5 h-5"
                                                >
                                                    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                                                </svg>
                                            </span>
                                            <Input
                                                {...register('github')}
                                                className="!rounded-s-none"
                                                sizeClass="h-11 px-4 ps-2 pe-3"
                                                placeholder="https://github.com/yourname"
                                            />
                                        </div>
                                    </div>

                                    {/* ---- Twitter*/}
                                    <div className="SocialsProfileForm__Twitter">
                                        <Label>X/Twitter</Label>
                                        <div className="mt-1.5 flex">
                                            <span className="inline-flex items-center px-2.5 rounded-s-2xl border border-e-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                                <svg
                                                    fill="currentColor"
                                                    height="1em"
                                                    viewBox="0 0 512 512"
                                                    className="w-5 h-5"
                                                >
                                                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                                                </svg>
                                            </span>
                                            <Input
                                                {...register('twitter')}
                                                className="!rounded-s-none"
                                                sizeClass="h-11 px-4 ps-2 pe-3"
                                                placeholder="https://twitter.com/yourname"
                                            />
                                        </div>
                                    </div>

                                    {/* ---- Instagram */}
                                    <div className="SocialsProfileForm__Instagram">
                                        <Label>Instagram </Label>
                                        <div className="mt-1.5 flex">
                                            <span className="inline-flex items-center px-2.5 rounded-s-2xl border border-e-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                                <svg
                                                    fill="currentColor"
                                                    height="1em"
                                                    viewBox="0 0 448 512"
                                                    className="w-5 h-5"
                                                >
                                                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                                </svg>
                                            </span>
                                            <Input
                                                {...register('instagram')}
                                                className="!rounded-s-none"
                                                sizeClass="h-11 px-4 ps-2 pe-3"
                                                placeholder="https://instagram.com/yourname"
                                            />
                                        </div>
                                    </div>

                                    {/* ---- Linkedin  */}
                                    <div className="SocialsProfileForm__Linkedin">
                                        <Label>Linkedin </Label>
                                        <div className="mt-1.5 flex">
                                            <span className="inline-flex items-center px-2.5 rounded-s-2xl border border-e-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                                <svg
                                                    fill="currentColor"
                                                    height="1em"
                                                    viewBox="0 0 448 512"
                                                    className="w-5 h-5"
                                                >
                                                    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                                                </svg>
                                            </span>
                                            <Input
                                                {...register('linkedin')}
                                                className="!rounded-s-none"
                                                sizeClass="h-11 px-4 ps-2 pe-3"
                                                placeholder="https://linkedin.com/in/yourname"
                                            />
                                        </div>
                                    </div>

                                    {/* ---- Twitch    */}
                                    <div className="SocialsProfileForm__Twitch">
                                        <Label>Twitch </Label>
                                        <div className="mt-1.5 flex">
                                            <span className="inline-flex items-center px-2.5 rounded-s-2xl border border-e-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                                <svg
                                                    fill="currentColor"
                                                    height="1em"
                                                    viewBox="0 0 512 512"
                                                    className="w-5 h-5"
                                                >
                                                    <path d="M391.17,103.47H352.54v109.7h38.63ZM285,103H246.37V212.75H285ZM120.83,0,24.31,91.42V420.58H140.14V512l96.53-91.42h77.25L487.69,256V0ZM449.07,237.75l-77.22,73.12H294.61l-67.6,64v-64H140.14V36.58H449.07Z" />
                                                </svg>
                                            </span>
                                            <Input
                                                {...register('twitch')}
                                                className="!rounded-s-none"
                                                sizeClass="h-11 px-4 ps-2 pe-3"
                                                placeholder="https://twitch.com/yourname"
                                            />
                                        </div>
                                    </div>
                                    {/* ---- Tiktok    */}
                                    <div className="SocialsProfileForm__Tiktok">
                                        <Label>Tiktok </Label>
                                        <div className="mt-1.5 flex">
                                            <span className="inline-flex items-center px-2.5 rounded-s-2xl border border-e-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                                <svg
                                                    fill="currentColor"
                                                    height="1em"
                                                    viewBox="0 0 448 512"
                                                    className="w-5 h-5"
                                                >
                                                    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
                                                </svg>
                                            </span>
                                            <Input
                                                {...register('tiktok')}
                                                className="!rounded-s-none"
                                                sizeClass="h-11 px-4 ps-2 pe-3"
                                                placeholder="https://www.tiktok.com/@name"
                                            />
                                        </div>
                                    </div>
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
            </div>
        </>
    )
}

export default Socials
