'use client'

// {"type":"doc","content":[{"type":"paragraph","content":[{"text":"On Thursday, Porsche ","type":"text"},{"text":"introduced","type":"text","marks":[{"type":"link","attrs":{"rel":"noopener noreferrer nofollow","href":"https://newsroom.porsche.com/en_US/2023/products/porsche-mission-x-hypercar-concept-32711.html","class":"e-rte-anchor","target":"_blank"}},{"type":"bold"},{"type":"underline"}]},{"text":" its latest electric concept car, the Mission X, which represents a \"conceptual reinterpretation\" of a hypercar. While the design takes inspiration from the Porsche 918 Spyder, the Mission X boasts a more pronounced and chunky aesthetic, particularly in its corner details and roof design.","type":"text"}]},{"type":"paragraph","content":[{"text":"Porsche envisions the Mission X with a 900-volt battery system architecture, offering faster charging times compared to the Taycan Turbo S. It is said to have an impressive power-to-weight ratio, providing approximately one horsepower per 2.2 pounds. The automaker claims that the Mission X would be the fastest road-legal vehicle to conquer the Nürburgring Nordschleife, a title currently held by the Mercedes-AMG One.","type":"text"}]},{"type":"paragraph","content":[{"text":"One of the standout design features of the Mission X is its sweeping and upward-opening doors, which create a unique seating experience, allowing occupants to feel connected to the open sky. When viewed from the front, the car exhibits a resemblance to a scarab beetle, further emphasizing its distinctive character. The Mission X rolls on staggered tires, with 20-inch wheels in the front and 21-inch wheels in the rear.","type":"text"}]},{"type":"paragraph","content":[{"text":"Inside the Mission X, Porsche blends a retro-futuristic aesthetic reminiscent of jet planes from the 1980s. The car features a steering yoke in place of a traditional wheel, while the interior design showcases straight lines, sharp angles, and flat surfaces, capturing the essence of 80s sports cars. The passenger-side dashboard includes a modular attachment area with a stopwatch module, featuring both analog and digital displays to track lap times and other vital driver information.","type":"text"}]},{"type":"paragraph","content":[{"text":"At the rear, the \"PORSCHE\" badge and red LED strips are designed to protrude from the car, creating a three-dimensional effect that adds a touch of artistic flair.","type":"text"}]},{"type":"paragraph","content":[{"text":"The heart of the Mission X lies in its battery placement, which is positioned in the middle of the car, just behind the seats, following an \"e-core layout\" reminiscent of traditional mid-engine car designs. This configuration ensures optimal weight distribution and enhances the car's handling and performance.","type":"text"}]},{"type":"paragraph","content":[{"text":"It's worth noting that the Mission X follows in the footsteps of Porsche's previous electric concept, the Mission E, which was initially introduced in 2015. Over time, the Mission E evolved and eventually became the production model known as the Porsche Taycan, showcasing the brand's commitment to electric mobility and innovation.","type":"text"}]}]}

import React, { useEffect, useMemo, useState } from 'react'
import NextImage from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { Controller, useForm } from 'react-hook-form'
import { Input, Alert, Label, ButtonPrimary } from 'ui'
import { useRouter } from 'next/navigation'
import stringToSlug from '@/utils/stringToSlug'
import { useStore } from '@/stores/editPost'
import PostType from '@/types/PostType'
import { TrashIcon } from '@heroicons/react/24/solid'
import TiptapEditor from '@/components/PostSubmissionEditor/TiptapEditor'
import TitleEditor from '@/components/PostSubmissionEditor/TitleEditor'
import TagsInput from '@/components/PostSubmissionEditor/TagsInput'
import PostOptionsBtn, {
    PostOptionsData,
} from '@/components/PostSubmissionEditor/PostOptionsBtn'
import Loading from './loading'

function modifyString(str: string) {
    //Capitalize every word of the string and replace spaces with -
    return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-')
}

const EditPost = (context: { params: { slug: any } }) => {
    const router = useRouter()
    // Inside your component
    const { post, setPost } = useStore()
    const [loading, setLoading] = useState(true)
    const [editPost, setEditPost] = useState<PostType>()

    const supabase = createClient()

    const [errorMsg, setErrorMsg] = useState('')
    const [text, setText] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [imgChanged, setImgChanged] = useState(false)
    let [title, setTitle] = useState('' as any)
    const [json, setJson] = useState('' as any)
    const defaultPostOptionsData = {
        excerptText: '',
        isAllowComments: true,
        license: '--------------',
        timeSchedulePublication: undefined,
    }
    const [postOptionsData, setPostOptionsData] = useState<PostOptionsData>(
        defaultPostOptionsData
    )

    let [tags, setTags] = useState([''])
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        async function getData() {
            // Get the authenticated user
            const { data: session } = await supabase.auth.getUser()
            if (!session.user) {
                router.push('/login')
                return
            }
            if (post) {
                // rteObj.value = post.rawText
                setEditPost(post)
                setTags(post.post_topics.map((topic: any) => topic.topic.name))
            } else {
                const { data, error } = await supabase
                    .from('posts')
                    .select(
                        'title, id, created_at, json, description, image, author(name, id, username, avatar), post_topics(topic:topics(id,name,color))'
                    )
                    .eq('id', context.params.slug[0])
                    .single()

                const postData: PostType | null = data as unknown as PostType

                if (session.user.id !== postData?.author?.id) {
                    router.push('/')
                }

                if (postData) {
                    // rteObj.value = postData.rawText
                    setEditPost(postData)
                    setTags(
                        postData.post_topics.map((topic) => topic.topic.name)
                    )
                    // Get the file data from the image url
                    const res = await fetch(postData.image)
                    const blob = await res.blob()
                    const file = new File([blob], 'image', {
                        type: blob.type,
                    })
                    setPostOptionsData({
                        excerptText: postData.description,
                        isAllowComments: true,
                        license: postData.license,
                        timeSchedulePublication: undefined,
                    })

                    //@ts-ignore
                    setSelectedImage(file)
                }
                setLoading(false)
            }
        }
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [changesMade, setChangesMade] = useState(false)

    useEffect(() => {
        const warnOnLeave = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = true
        }

        if (isDirty) {
            window.addEventListener('beforeunload', warnOnLeave)
        } else {
            window.removeEventListener('beforeunload', warnOnLeave)
        }

        return () => {
            window.removeEventListener('beforeunload', warnOnLeave)
        }
    }, [changesMade])

    async function sendPost(formData: any) {
        setUploading(true)
        setErrorMsg('')
        setProgress(10)

        console.log('json' + json)
        console.log(editPost?.json)
        console.log('title' + title)

        if (title == null || title.length == 0) {
            title = editPost?.title
        }

        // Get the authenticated user
        const {
            data: { user },
        } = await supabase.auth.getUser()

        //@ts-ignore
        let newPost: PostType[] = [
            {
                title: editPost ? editPost.title : 'No Title',
                description: editPost ? editPost?.description : '',
                comments_allowed: postOptionsData.isAllowComments,
                license: postOptionsData.license
                    ? (postOptionsData.license ?? '--------------')
                    : null,
                //@ts-ignore
                json: editPost ? editPost?.json : '',
            },
        ]

        if (title !== editPost?.title) {
            newPost[0]['title'] = title
        }
        if (postOptionsData.excerptText !== editPost?.description) {
            newPost[0]['description'] = postOptionsData.excerptText
        }
        setProgress(20)
        if (imgChanged) {
            // Update the selected image to Supabase storage with the post's ID as the name
            const { data: imagePath, error: uploadError } =
                await supabase.storage.from('images').update(
                    `${user?.id}/${context.params.slug[0]}/main-image`,
                    //@ts-ignore
                    selectedImage
                )

            if (uploadError) {
                console.error('Error uploading image:', uploadError)
                return
            }

            // Create a URL for the uploaded image
            const uploadedImageUrl =
                'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/' +
                imagePath?.path

            // Update the inserted post with the image URL
            await supabase
                .from('posts')
                .update({
                    image: uploadedImageUrl,
                })
                .eq('id', context.params.slug[0])
        }
        setProgress(30)

        if (json !== editPost?.json && json !== '') {
            newPost[0]['json'] = json
        }

        tags.filter((tag) => tag && tag.length > 0).map((tag: string) => {
            if (tag.length == 0 || tag == null || tag.length > 20) {
                setUploading(false)
                setErrorMsg('Topics must be between 1 and 20 characters')
                return
            }
        })
        setProgress(40)

        const { data, error } = await supabase
            .from('posts')
            .update(newPost[0])
            .eq('id', context.params.slug[0])

        setProgress(70)

        if (tags.length > 0) {
            tags = tags.map((tag) => {
                return modifyString(tag)
            })

            const { data: tagsArray } = await supabase.rpc('manage_topics', {
                topics: tags,
            })
            const finalTags = tagsArray.map((tag: any) => {
                return {
                    post: context.params.slug[0],
                    topic: tag.top_id,
                }
            })
            setProgress(90)

            if (finalTags !== editPost?.post_topics) {
                await supabase
                    .from('post_topics')
                    .delete()
                    .eq('post', editPost?.id)
                await supabase.from('post_topics').insert(finalTags).select('*')
            }
        }
        setProgress(100)

        router.push(`/post/${stringToSlug(title)}/${context.params.slug[0]}`)
    }

    const handleImageSelect = (event: { target: { files: any[] } }) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = function () {
                //@ts-ignore
                setShowImg(reader.result as string)
            }
            reader.readAsDataURL(file)
            setImgChanged(true)
        }
    }

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
                setErrorMsg(
                    'Unsupported file type. Please use PNG, JPG, or JPEG.'
                )
            }
        }
        setIsDragging(false)
    }

    const handleChangeTags = (tags: any) => {
        setTags(tags)
    }

    const handleApplyPostOptions = (data: PostOptionsData) => {
        setPostOptionsData(data)
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
        formState: { errors, isDirty },
    } = useForm() // Initialize the hook

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <Loading />
                </div>
            ) : (
                <>
                    <title>Edit Post - Athera</title>
                    <div className="max-w-4xl mx-auto lg:pt-5 pt-10 sm:pt-26 pb-24 lg:pb-32">
                        <div className="rounded-xl md:p-6">
                            <form
                                className="grid md:grid-cols-2 gap-6"
                                onSubmit={handleSubmit(async (data, event) => {
                                    event?.preventDefault() // Prevent default form submission
                                    await sendPost(data)
                                })}
                                method="post"
                            >
                                <Label className="block sm:col-span-1 md:col-span-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                    <TitleEditor
                                        onUpdate={(editor) => {
                                            setTitle(editor.getText())
                                            setChangesMade(true)
                                        }}
                                        defaultTitle={editPost?.title}
                                    />
                                    {errors.postTitle && (
                                        <Alert
                                            type="danger"
                                            message="Required"
                                        />
                                    )}
                                </Label>

                                <Label className="flex justify-top sm:col-span-1 md:col-span-2">
                                    <TagsInput
                                        onChange={handleChangeTags}
                                        defaultValue={tags}
                                    />
                                </Label>

                                <div className="group block md:col-span-2">
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        className="relative mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-2xl"
                                    >
                                        <div className="space-y-1 text-center">
                                            {selectedImage ? (
                                                <>
                                                    <NextImage
                                                        src={
                                                            imgChanged
                                                                ? showImg
                                                                    ? showImg
                                                                    : ''
                                                                : editPost?.image
                                                                  ? editPost?.image
                                                                  : '/images/placeholder.png'
                                                        }
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
                                                                setSelectedImage(
                                                                    null
                                                                )
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
                                                    <p className="text-xs text-neutral-500 pb-8">
                                                        PNG, JPG up to 10MB
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 relative pb-[700px] md:hidden">
                                    <div className="absolute inset-0 flex flex-col">
                                        <div className="rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 border-dashed">
                                            <TiptapEditor
                                                onUpdate={(editor) => {
                                                    const text =
                                                        editor.getText()
                                                    setText(text)
                                                    setJson(editor.getJSON())
                                                    setChangesMade(true)
                                                }}
                                                defaultContent={editPost?.json}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block md:col-span-2">
                                    <div className="rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 border-dashed">
                                        <TiptapEditor
                                            onUpdate={(editor) => {
                                                const text = editor.getText()
                                                setText(text)
                                                setJson(editor.getJSON())
                                                setChangesMade(true)
                                            }}
                                            defaultContent={editPost?.json}
                                        />
                                    </div>
                                </div>
                                <div className="pt-2 md:col-span-2 flex space-x-12 justify-center flex-wrap">
                                    {!uploading ? (
                                        <>
                                            <ButtonPrimary
                                                type="submit"
                                                className="text-white md:col-span-2 rounded-lg"
                                            >
                                                Update Post
                                            </ButtonPrimary>
                                            <PostOptionsBtn
                                                defaultData={postOptionsData}
                                                onSubmit={
                                                    handleApplyPostOptions
                                                }
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <ButtonPrimary
                                                className="text-white md:col-span-2 rounded-lg"
                                                loading
                                            >
                                                Updating...
                                            </ButtonPrimary>
                                            <div className="md:col-span-2 h-2 relative overflow-hidden rounded-lg w-full mt-4">
                                                <div className="w-full h-full bg-gray-200 absolute"></div>
                                                <div
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                    className="h-full bg-blue-500 absolute rounded-lg transition-all duration-500 ease-in-out"
                                                ></div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {errorMsg && (
                                    <Alert type="danger" message={errorMsg} />
                                )}
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default EditPost
