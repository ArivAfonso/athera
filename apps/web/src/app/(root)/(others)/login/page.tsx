'use client'

import React from 'react'
import { useState } from 'react'
import twitterSvg from '@/images/Twitter.svg'
import googleSvg from '@/images/Google.svg'
import discordSvg from '@/images/Discord.svg'
import xSvg from '@/images/X.svg'
import { createClient } from '@/utils/supabase/client'
import { Controller, useForm } from 'react-hook-form'
import { Input, Image, Alert, Button, Heading2, MyLink } from 'ui'

const PageLogin = ({}) => {
    const supabase = createClient()
    const [errorMsg, setErrorMsg] = useState('')

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm() // Initialize the hook

    async function emailLogin(formData: any) {
        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })
        if (error) {
            setErrorMsg(error.message)
        }
    }

    async function googleSignIn() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/login`,
            },
        })
    }

    async function twitterSignIn() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'twitter',
            options: {
                redirectTo: `${window.location.origin}/auth/login`,
            },
        })
        if (error) {
            setErrorMsg(error.message)
        }
    }

    async function discordSignIn() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                redirectTo: `${window.location.origin}/auth/login`,
            },
        })
    }
    return (
        <>
            <title key="title">Login - Athera</title>
            <header className="text-center max-w-2xl mx-auto - mb-14 sm:mb-16 lg:mb-20 ">
                <Heading2>Login</Heading2>
                <span className="block text-sm mt-2 text-neutral-700 sm:text-base dark:text-neutral-200">
                    Welcome to our blog magazine Community
                </span>
            </header>

            <div className="max-w-md mx-auto space-y-6">
                <div className="grid gap-3">
                    <button
                        className=" flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
                        onClick={googleSignIn}
                    >
                        <Image
                            className="flex-shrink-0"
                            src={googleSvg}
                            alt="Login with Google"
                        />
                        <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                            Login with Google
                        </h3>
                    </button>
                    <button
                        className=" flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
                        onClick={twitterSignIn}
                    >
                        <Image
                            className="flex-shrink-0"
                            src={xSvg}
                            alt="Login with X"
                        />
                        <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                            Login with X
                        </h3>
                    </button>
                    <button
                        className=" flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
                        onClick={discordSignIn}
                    >
                        <Image
                            className="flex-shrink-0"
                            src={discordSvg}
                            alt="Login with Discord"
                        />
                        <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                            Login with Discord
                        </h3>
                    </button>
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
                    className="grid grid-cols-1 gap-6"
                    onSubmit={handleSubmit(
                        async (data) => await emailLogin(data)
                    )}
                >
                    <label className="block">
                        <span className="text-neutral-800 dark:text-neutral-200">
                            Email address
                        </span>
                        <Controller
                            name="email" // Field name
                            control={control} // Control prop
                            defaultValue="" // Default value
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="example@example.com"
                                    className="mt-1"
                                />
                            )}
                        />
                    </label>
                    <label className="block">
                        <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                            Password
                            <MyLink
                                href="/forgot-pass"
                                className="text-sm underline"
                            >
                                Forgot password?
                            </MyLink>
                        </span>
                        <Controller
                            name="password" // Field name
                            control={control} // Control prop
                            defaultValue="" // Default value
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="password"
                                    className="mt-1"
                                />
                            )}
                        />
                    </label>
                    <div className="flex justify-center items-center">
                        <Button type="submit" pattern="third">
                            Continue
                        </Button>
                    </div>
                </form>
                {errorMsg && <Alert message={errorMsg} type="danger" />}
                {/* ==== */}
                <span className="block text-center text-neutral-700 dark:text-neutral-300">
                    New user? <MyLink href="/signup">Create an account</MyLink>
                </span>
            </div>
        </>
    )
}

export default PageLogin
