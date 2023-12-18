'use client'

import React, { useState, useEffect, use } from 'react'
import { useForm } from 'react-hook-form'
import Input from '@/components/Input/Input'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import NcLink from '@/components/NcLink/NcLink'
import Heading2 from '@/components/Heading/Heading2'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

const PageForgotPass = ({}) => {
    const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit } = useForm()
    const router = useRouter()

    async function recoverPassword(email: string) {
        const supabase = createClientComponentClient()
        await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/forgot-pass`,
        })
    }

    async function getData() {
        const supabase = createClientComponentClient()
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsPasswordRecovery(true)
            }
        })
        // const { data: session } = await supabase.auth.getSession()
        // if (session.session !== null) {
        //     router.push('/login')
        // }
    }
    getData()

    use(getData())

    async function updatePassword(newPassword: string) {
        const supabase = createClientComponentClient()
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        })
        if (error) {
            console.log(error)
        }
    }

    const onSubmit = async (data: any) => {
        if (isPasswordRecovery) {
            updatePassword(data.newPassword)
        } else {
            recoverPassword(data.email)
        }
    }

    console.log(loading)

    return (
        <>
            <header className="text-center max-w-2xl mx-auto - mb-14 sm:mb-16 lg:mb-20">
                {isPasswordRecovery ? (
                    <Heading2>Reset Password</Heading2>
                ) : (
                    <>
                        <Heading2>Forgot password</Heading2>
                        <span className="block text-sm mt-2 text-neutral-700 sm:text-base dark:text-neutral-200">
                            Welcome to our blog magazine Community
                        </span>
                    </>
                )}
            </header>

            <div className="max-w-md mx-auto space-y-6">
                {isPasswordRecovery ? (
                    <form
                        className="grid grid-cols-1 gap-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <label className="block">
                            <span className="text-neutral-800 dark:text-neutral-200">
                                New Password
                            </span>
                            <Input
                                type="password"
                                name="newPassword"
                                placeholder="New Password"
                                className="mt-1"
                            />
                        </label>
                        <ButtonPrimary type="submit">
                            Update Password
                        </ButtonPrimary>
                    </form>
                ) : (
                    <form
                        className="grid grid-cols-1 gap-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <label className="block">
                            <span className="text-neutral-800 dark:text-neutral-200">
                                Email address
                            </span>
                            <Input
                                type="email"
                                name="email"
                                placeholder="example@example.com"
                                className="mt-1"
                            />
                        </label>
                        {loading ? (
                            <ButtonPrimary
                                type="submit"
                                className="text-white px-4 py-2 rounded-lg"
                            >
                                Change Password
                            </ButtonPrimary>
                        ) : (
                            <ButtonPrimary loading>Submitting...</ButtonPrimary>
                        )}
                    </form>
                )}

                <span className="block text-center text-neutral-700 dark:text-neutral-300">
                    Go back for <NcLink href="/login">Sign in</NcLink>
                    {' / '}
                    <NcLink href="/signup">Sign up</NcLink>
                </span>
            </div>
        </>
    )
}

export default PageForgotPass
