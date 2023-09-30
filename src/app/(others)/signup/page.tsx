'use client'

import React from 'react'
import { useState } from 'react'
import twitterSvg from '@/images/Twitter.svg'
import googleSvg from '@/images/Google.svg'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import NcLink from '@/components/NcLink/NcLink'
import Heading2 from '@/components/Heading/Heading2'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useForm, Controller } from 'react-hook-form' // Import the necessary functions
import * as Yup from 'yup'
import Input from '@/components/Input/Input'

const PageSignUp = ({}) => {
    const supabase = createClientComponentClient()
    const [errorMsg, setErrorMsg] = useState('')

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm() // Initialize the hook

    async function emailSignUp(formData: any) {
        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.full_name,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        if (error) {
            setErrorMsg(error.message)
            console.log(error)
        }
    }

    async function googleSignIn() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        if (error) {
            setErrorMsg(error.message)
        }
    }

    async function twitterSignIn() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'twitter',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        if (error) {
            setErrorMsg(error.message)
        }
    }

    return (
        <>
            <header className="text-center max-w-2xl mx-auto - mb-14 sm:mb-16 lg:mb-20">
                <Heading2>Sign up</Heading2>
                <span className="block text-sm mt-2 text-neutral-700 sm:text-base dark:text-neutral-200">
                    Welcome to Athera
                </span>
            </header>

            <div className="max-w-md mx-auto space-y-6">
                <div className="grid gap-3">
                    <a
                        className=" flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
                        onClick={googleSignIn}
                    >
                        <Image
                            className="flex-shrink-0"
                            src={googleSvg}
                            alt="Signup with Google"
                        />
                        <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                            Signup with Google
                        </h3>
                    </a>
                    <a
                        className=" flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
                        onClick={twitterSignIn}
                    >
                        <Image
                            className="flex-shrink-0"
                            src={twitterSvg}
                            alt="Signup with Twitter"
                        />
                        <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                            Signup with Twitter
                        </h3>
                    </a>
                </div>
                {/* OR */}
                <div className="relative text-center">
                    <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
                        OR
                    </span>
                    <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
                </div>
                {/* FORM */}
                <form
                    onSubmit={handleSubmit(
                        async (data) => await emailSignUp(data)
                    )} // Use the handleSubmit function from React Hook Form
                    className="grid grid-cols-1 gap-6"
                    action="#"
                    method="post"
                >
                    <label className="block">
                        <span className="text-neutral-800 dark:text-neutral-200">
                            Full Name
                        </span>
                        <Controller
                            name="full_name"
                            control={control} // Use the control prop
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Thomas Vaz"
                                    className={`mt-1 ${
                                        errors.full_name ? 'border-red-500' : ''
                                    }`}
                                    {...field}
                                />
                            )}
                        />
                        {errors.full_name && (
                            <div className="text-red-500">Required</div>
                        )}
                    </label>
                    <label className="block">
                        <span className="text-neutral-800 dark:text-neutral-200">
                            Email address
                        </span>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    placeholder="example@example.com"
                                    className={`mt-1 ${
                                        errors.email ? 'border-red-500' : ''
                                    }`}
                                    {...field}
                                />
                            )}
                        />
                        {errors.email && (
                            <div className="text-red-500">Required</div>
                        )}
                    </label>
                    <label className="block">
                        <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                            Password
                        </span>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="password"
                                    className={`mt-1 ${
                                        errors.password ? 'border-red-500' : ''
                                    }`}
                                    {...field}
                                />
                            )}
                        />
                        {errors.password && (
                            <div className="text-red-500">Required</div>
                        )}
                    </label>
                    <ButtonPrimary type="submit">Continue</ButtonPrimary>
                </form>
                {errorMsg && <div className="text-red-600">{errorMsg}</div>}
                {/* ==== */}
                <span className="block text-center text-neutral-700 dark:text-neutral-300">
                    Already have an account? {` `}
                    <NcLink href="/login">Sign in</NcLink>
                </span>
            </div>
        </>
    )
}

export default PageSignUp
