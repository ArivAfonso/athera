'use client'

import Label from '@/components/Label/Label'
import React, { FC, useEffect, useState } from 'react'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Input from '@/components/Input/Input'
import Select from '@/components/Select/Select'
import Textarea from '@/components/Textarea/Textarea'
import { avatarImgs } from '@/contains/fakeData'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useForm, Controller } from 'react-hook-form'
import Alert from '@/components/Alert/Alert'

function AccountPage() {
    const { handleSubmit, register } = useForm()
    const [success, setSuccess] = useState('')

    async function updateProfile(formData: any) {
        const supabase = createClientComponentClient()
        const { data: session } = await supabase.auth.getSession()
        try {
            const { error } = await supabase
                .from('users')
                .update([
                    {
                        id: session.session?.user?.id,
                        name: formData.fullName,
                        // email: formData.email,
                        website: formData.website,
                        bio: formData.about,
                        avatar: formData.avatar,
                        phone: formData.phone,
                        tiktok: formData.tiktok,
                        twitter: formData.twitter,
                        facebook: formData.facebook,
                    },
                ])
                .eq('id', session.session?.user?.id)
            setSuccess('Profile updated successfully')
        } catch (error) {
            console.log(error)
        }
    }

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        website: '',
        bio: '',
        avatar: '',
        phone: '',
        tiktok: '',
        twitter: '',
        facebook: '',
    })

    useEffect(() => {
        async function checkLikedStatus() {
            const supabase = createClientComponentClient()
            const { data: session } = await supabase.auth.getSession()
            const userId = session?.session?.user.id
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

    console.log(profile.name)

    return (
        <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
            <form
                onSubmit={handleSubmit(
                    async (data) => await updateProfile(data)
                )}
                className={`nc-AccountPage`}
            >
                <div className="space-y-10 sm:space-y-12">
                    {/* HEADING */}
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                        Account information
                    </h2>
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-shrink-0 flex items-start">
                            {/* AVATAR */}
                            <div className="relative rounded-full overflow-hidden flex">
                                <Image
                                    src={profile.avatar}
                                    alt="avatar"
                                    width={128}
                                    height={128}
                                    className="w-32 h-32 rounded-full object-cover z-0"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
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
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                                    {/* Image change UI here */}
                                </div>
                                <Input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
                            <div>
                                <Label>Full name</Label>
                                <Input
                                    {...register('fullName')}
                                    className="mt-1.5"
                                    defaultValue={profile.name}
                                />
                            </div>
                            {/* Other form fields */}
                            {/* Replace Input and Label components with plain HTML Inputs and Labels */}
                            <div>
                                <Label>Email</Label>
                                <div className="mt-1.5 flex">
                                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                        <i className="text-2xl las la-envelope"></i>
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
                            {/* ... */}
                            <div className="">
                                <Label>Website</Label>
                                <div className="mt-1.5 flex">
                                    <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                        https://
                                    </span>
                                    <Input
                                        {...register('website')}
                                        className="!rounded-l-none"
                                        placeholder={
                                            profile.website
                                                ? profile.website
                                                : 'example.com'
                                        }
                                        defaultValue={profile.website}
                                    />
                                </div>
                            </div>
                            {/* ---- */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-2.5">
                                <div>
                                    <Label>Facebook</Label>
                                    <div className="mt-1.5 flex">
                                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                            <svg
                                                className="w-5 h-5"
                                                viewBox="0 0 45 74"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M26.645 42.6953V72H13.1834V42.6953H2V30.8129H13.1834V26.4896C13.1834 10.4393 19.8883 2 34.0747 2C38.4238 2 39.5111 2.69896 41.8928 3.26849V15.0215C39.2263 14.5555 38.4756 14.2966 35.7056 14.2966C32.4179 14.2966 30.6575 15.2286 29.0525 17.0666C27.4475 18.9046 26.645 22.0888 26.645 26.645V30.8388H41.8928L37.8025 42.7212H26.645V42.6953Z"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                            </svg>
                                        </span>
                                        <Input
                                            {...register('facebook')}
                                            className="!rounded-l-none"
                                            placeholder="yourfacebook"
                                            defaultValue={profile.facebook}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Twitter</Label>
                                    <div className="mt-1.5 flex">
                                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                            <svg
                                                className="w-5 h-5"
                                                viewBox="0 0 79 65"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M7 54.4003C14.4009 54.8168 20.8727 53.0867 27.1844 48.5051C20.8087 47.4158 16.3873 44.5003 13.9844 38.477C15.8427 38.2207 17.4767 38.7013 19.399 37.9324C13.1194 35.1771 9.05048 31.0441 8.89029 23.8994C10.8767 24.0596 12.3825 25.3732 14.7534 25.181C8.98642 19.5422 7.22427 13.3908 10.8446 5.92575C16.8679 12.8461 23.9164 17.5558 32.5348 19.7665C33.0154 19.8946 33.4639 20.0228 33.9445 20.1189C36.1552 20.6315 38.7824 21.7208 40.128 21.5606C42.4348 21.2723 40.128 18.6131 40.7047 15.1529C42.5309 4.38789 54.3852 -0.514024 63.1638 5.79759C65.7269 7.65584 67.7453 7.6238 70.2764 6.50245C71.59 5.92575 72.9356 5.34905 74.5055 4.67624C74.1531 7.75195 71.7822 9.45 69.8919 11.7247C72.0385 12.2053 73.7686 11.5966 75.755 10.9558C75.0822 13.1665 73.4162 14.416 71.9103 15.6335C70.3404 16.883 69.7317 18.1966 69.6676 20.247C68.7065 51.2925 33.4319 75.2895 9.30681 56.1944C6.96798 54.3362 9.24271 56.1944 7 54.4003Z"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                            </svg>
                                        </span>
                                        <Input
                                            {...register('twitter')}
                                            className="!rounded-l-none"
                                            placeholder="yourtwitter"
                                            defaultValue={profile.twitter}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Tiktok</Label>
                                    <div className="mt-1.5 flex">
                                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                            <svg
                                                className="w-5 h-5"
                                                viewBox="0 0 65 74"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M46.5893 4.66285L44.9004 2H34.6802V25.9831L34.6454 49.4092C34.6628 49.5833 34.6802 49.7747 34.6802 49.9488C34.6802 55.814 29.9097 60.6002 24.0248 60.6002C18.1399 60.6002 13.3693 55.8314 13.3693 49.9488C13.3693 44.0835 18.1399 39.2974 24.0248 39.2974C25.2435 39.2974 26.4275 39.5236 27.5244 39.9065V28.2108C26.3927 28.0194 25.2261 27.915 24.0248 27.915C11.8894 27.9324 2 37.818 2 49.9662C2 62.1144 11.8894 72 24.0422 72C36.195 72 46.0844 62.1144 46.0844 49.9662V22.1019C50.4893 26.5052 56.1827 30.8041 62.4854 32.179V20.2223C55.6430 17.1939 48.8353 8.24814 46.5893 4.66285Z"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                            </svg>
                                        </span>
                                        <Input
                                            {...register('tiktok')}
                                            className="!rounded-l-none"
                                            placeholder={
                                                profile.tiktok
                                                    ? profile.tiktok
                                                    : 'yourtiktok'
                                            }
                                            defaultValue={profile.tiktok}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* ... */}
                            {/* ---- */}
                            <div>
                                <Label>Phone number</Label>
                                <div className="mt-1.5 flex">
                                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                                        <i className="text-2xl las la-phone-volume"></i>
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
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="text-white bg-blue-500 px-4 py-2 rounded-lg"
                                >
                                    Update account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            {success && <Alert type="success" message={success} />}
        </div>
    )
}

export default AccountPage
