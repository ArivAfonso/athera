'use client'

import Label from '@/components/Label/Label'
import React, { FC, useEffect, useState } from 'react'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Input from '@/components/Input/Input'
import Textarea from '@/components/Textarea/Textarea'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { useForm, Controller } from 'react-hook-form'
import Alert from '@/components/Alert/Alert'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import Button from '@/components/Button/Button'

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

    async function updateProfile(formData: any) {}

    useEffect(() => {
        async function checkLikedStatus() {
            const supabase = createClient()
            const { data: session } = await supabase.auth.getSession()
            setSession(session)
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
                >
                    <div className="space-y-10 sm:space-y-12">
                        {/* HEADING */}
                        <h2 className="text-2xl sm:text-3xl font-semibold">
                            Notification Settings
                        </h2>
                    </div>
                </form>
                {success && <Alert type="success" message={success} />}
                {error && <Alert type="danger" message={error} />}
            </div>
        </>
    )
}

export default AccountPage
