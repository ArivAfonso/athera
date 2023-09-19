'use client'

import React from 'react'
import { useState } from 'react'
import twitterSvg from '@/images/Twitter.svg'
import googleSvg from '@/images/Google.svg'
import Input from '@/components/Input/Input'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import NcLink from '@/components/NcLink/NcLink'
import Heading2 from '@/components/Heading/Heading2'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
})

const PageLogin = ({}) => {
    const supabase = createClientComponentClient()
    const [errorMsg, setErrorMsg] = useState('')

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
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    async function twitterSignIn() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'twitter',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }
    return (
        <>
            <header className="text-center max-w-2xl mx-auto - mb-14 sm:mb-16 lg:mb-20 ">
                <Heading2>Login</Heading2>
                <span className="block text-sm mt-2 text-neutral-700 sm:text-base dark:text-neutral-200">
                    Welcome to our blog magazine Community
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
                            alt="Login with Google"
                        />
                        <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                            Login with Google
                        </h3>
                    </a>
                    <a
                        className=" flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
                        onClick={twitterSignIn}
                    >
                        <Image
                            className="flex-shrink-0"
                            src={twitterSvg}
                            alt="Login with Twitter"
                        />
                        <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                            Login with Twitter
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
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={LoginSchema}
                    onSubmit={emailLogin}
                >
                    <Form className="grid grid-cols-1 gap-6">
                        <label className="block">
                            <span className="text-neutral-800 dark:text-neutral-200">
                                Email address
                            </span>
                            <Field
                                type="email"
                                name="email"
                                placeholder="example@example.com"
                                component={Input}
                                className="mt-1"
                            />
                        </label>
                        <label className="block">
                            <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                                Password
                                <NcLink
                                    href="/forgot-pass"
                                    className="text-sm underline"
                                >
                                    Forgot password?
                                </NcLink>
                            </span>
                            <Field
                                type="password"
                                name="password"
                                component={Input}
                                className="mt-1"
                            />
                        </label>
                        <ButtonPrimary type="submit">Continue</ButtonPrimary>
                    </Form>
                </Formik>
                {errorMsg && <div className="text-red-600">{errorMsg}</div>}
                {/* ==== */}
                <span className="block text-center text-neutral-700 dark:text-neutral-300">
                    New user? {` `}
                    <NcLink href="/signup">Create an account</NcLink>
                </span>
            </div>
        </>
    )
}

export default PageLogin
