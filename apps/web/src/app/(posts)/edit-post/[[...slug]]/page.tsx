'use client'

import React, { useEffect, useState } from 'react'
import Input from '@/components/Input/Input'
import NextImage from 'next/image'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Textarea from '@/components/Textarea/Textarea'
import Label from '@/components/Label/Label'
import { addClass, removeClass, Browser } from '@syncfusion/ej2-base'
import {
    RichTextEditorComponent,
    Toolbar,
    Inject,
    Image,
    Link,
    HtmlEditor,
    Count,
    QuickToolbar,
    Table,
    EmojiPicker,
    PasteCleanupSettingsModel,
    ImageSettingsModel,
    PasteCleanup,
} from '@syncfusion/ej2-react-richtexteditor'
import {
    ToolbarSettingsModel,
    FileManager,
    FileManagerSettingsModel,
    QuickToolbarSettingsModel,
} from '@syncfusion/ej2-react-richtexteditor'
import { useThemeMode } from '@/hooks/useThemeMode'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Controller, useForm } from 'react-hook-form'
import Alert from '@/components/Alert/Alert'
import { useRouter } from 'next/navigation'
import { pipeline } from '@xenova/transformers'
import { registerLicense } from '@syncfusion/ej2-base'
import stringToSlug from '@/utils/stringToSlug'
import { useStore } from '@/stores/editPost'
import PostType from '@/types/PostType'
import { TrashIcon } from '@heroicons/react/24/solid'
import Heading2 from '@/components/Heading/Heading2'

registerLicense(
    'Ngo9BigBOggjHTQxAR8/V1NHaF5cXmVCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWH5edXRcQ2BfWE1/XEI='
)

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
    const [editPost, setEditPost] = useState<PostType>()
    let rteObj: RichTextEditorComponent
    const hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/'
    const pasteCleanupSettings: PasteCleanupSettingsModel = {
        prompt: false,
        allowedStyleProps: [],
        keepFormat: false,
        plainText: false,
    }

    const supabase = createClientComponentClient()

    const [errorMsg, setErrorMsg] = useState('')
    const [text, setText] = useState('')
    let [htmlText, setHtmlText] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [bigTag, setBigTag] = useState(false)
    const [imgChanged, setImgChanged] = useState(false)

    let [tags, setTags] = useState([''])
    const [progress, setProgress] = useState(0)

    const insertImageSettings: ImageSettingsModel = {
        allowedTypes: ['.jpeg', '.jpg', '.png'],
        display: 'inline',
        width: 'auto',
        height: 'auto',
        saveFormat: 'Base64',
    }

    // Rich Text Editor items list
    const items: string[] = [
        'Undo',
        'Redo',
        '|',
        'Bold',
        'Italic',
        'Underline',
        'StrikeThrough',
        'FontName',
        'FontSize',
        'FontColor',
        'BackgroundColor',
        'LowerCase',
        'UpperCase',
        '|',
        'Formats',
        'Alignments',
        'NumberFormatList',
        'BulletFormatList',
        'Outdent',
        'Indent',
        'SuperScript',
        'SubScript',
        'EmojiPicker',
        '|',
        'CreateTable',
        'CreateLink',
        'Image',
        '|',
    ]
    const fileManagerSettings: FileManagerSettingsModel = {
        enable: true,
        path: '/Pictures/Food',
        ajaxSettings: {
            url: hostUrl + 'api/FileManager/FileOperations',
            getImageUrl: hostUrl + 'api/FileManager/GetImage',
            uploadUrl: hostUrl + 'api/FileManager/Upload',
            downloadUrl: hostUrl + 'api/FileManager/Download',
        },
    }
    const quickToolbarSettings: QuickToolbarSettingsModel = {
        table: [
            'TableHeader',
            'TableRows',
            'TableColumns',
            'TableCell',
            '-',
            'BackgroundColor',
            'TableRemove',
            'TableCellVerticalAlign',
            'Styles',
        ],
    }
    //Rich Text Editor ToolbarSettings
    const toolbarSettings: ToolbarSettingsModel = {
        items: items,
    }
    function handleFullScreen(e: any) {
        // Use optional chaining to handle the possibility of elements not being found
        let sbCntEle = document.querySelector(
            '.sb-content.e-view'
        ) as HTMLElement
        let sbHdrEle = document.querySelector(
            '.sb-header.e-view'
        ) as HTMLElement
        let leftBar
        let transformElement

        if (Browser.isDevice) {
            leftBar = document.querySelector('#right-sidebar') as HTMLElement
            transformElement = document.querySelector(
                '.sample-browser.e-view.e-content-animation'
            ) as HTMLElement
        } else {
            leftBar = document.querySelector('#left-sidebar') as HTMLElement
            transformElement = document.querySelector(
                '#right-pane'
            ) as HTMLElement
        }

        // Check if elements were found before using them
        if (!sbCntEle || !sbHdrEle || !leftBar || !transformElement) {
            console.error('One or more required elements not found.')
            return
        }

        if (e.targetItem === 'Maximize') {
            if (Browser.isDevice && Browser.isIos) {
                // Assuming addClass and removeClass are functions to manipulate CSS classes
                addClass([sbCntEle, sbHdrEle], ['hide-header'])
            }
            addClass([leftBar], ['e-close'])
            removeClass([leftBar], ['e-open'])

            if (!Browser.isDevice) {
                // Assuming you want to adjust margin if not on a device
                transformElement.style.marginLeft = '0px'
            }
            transformElement.style.transform = 'inherit'
        } else if (e.targetItem === 'Minimize') {
            if (Browser.isDevice && Browser.isIos) {
                // Assuming addClass and removeClass are functions to manipulate CSS classes
                removeClass([sbCntEle, sbHdrEle], ['hide-header'])
            }
            removeClass([leftBar], ['e-close'])

            if (!Browser.isDevice) {
                addClass([leftBar], ['e-open'])
                // Assuming you want to set the margin based on the leftBar's width
                transformElement.style.marginLeft = leftBar.offsetWidth + 'px'
            }
            transformElement.style.transform = 'translateX(0px)'
        }
    }

    const { isDarkMode } = useThemeMode()

    useEffect(() => {
        async function getData() {
            // Load the appropriate Tailwind CSS file based on the theme mode
            const linkElement = document.createElement('link')
            linkElement.rel = 'stylesheet'
            if (isDarkMode) {
                linkElement.href =
                    'https://cdn.syncfusion.com/ej2/22.1.34/tailwind-dark.css'
                const existingLightModeLink = document.querySelector(
                    'link[href="https://cdn.syncfusion.com/ej2/22.1.34/tailwind.css"]'
                )
                if (existingLightModeLink) {
                    existingLightModeLink.remove()
                }
            } else {
                linkElement.href =
                    'https://cdn.syncfusion.com/ej2/22.1.34/tailwind.css'
                const existingDarkModeLink = document.querySelector(
                    'link[href="https://cdn.syncfusion.com/ej2/22.1.34/tailwind-dark.css"]'
                )
                if (existingDarkModeLink) {
                    existingDarkModeLink.remove()
                }
            }
            document.head.appendChild(linkElement)

            if (post) {
                // rteObj.value = post.rawText
                setEditPost(post)
                setTags(
                    post.post_categories.map(
                        (category) => category.category.name
                    )
                )
            } else {
                const { data, error } = await supabase
                    .from('posts')
                    .select(
                        'title, id, rawText, created_at, description, image, author(name, id, username, avatar), post_categories(category:categories(id,name,color))'
                    )
                    .eq('id', context.params.slug[0])
                    .single()

                const postData: PostType | null = data as unknown as PostType

                if (postData) {
                    // rteObj.value = postData.rawText
                    setEditPost(postData)
                    setTags(
                        postData.post_categories.map(
                            (category) => category.category.name
                        )
                    )
                    // Get the file data from the image url
                    const res = await fetch(postData.image)
                    const blob = await res.blob()
                    const file = new File([blob], 'image', {
                        type: blob.type,
                    })
                    //@ts-ignore
                    setSelectedImage(file)
                }
            }

            // Cleanup on unmount
            return () => {
                const existingLink = isDarkMode
                    ? document.querySelector(
                          'link[href="https://cdn.syncfusion.com/ej2/22.1.34/tailwind-dark.css"]'
                      )
                    : document.querySelector(
                          'link[href="https://cdn.syncfusion.com/ej2/22.1.34/tailwind.css"]'
                      )
                if (existingLink) {
                    existingLink.remove()
                }
            }
        }
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDarkMode])

    function handleKeyDown(e: any) {
        setBigTag(false)
        setErrorMsg('')
        // If user did not press enter key, return
        if (e.key !== 'Enter') return
        // Get the value of the input
        e.preventDefault()
        const value = e.target.value
        // If the value is empty or longer than 20 characters, show an error message and return
        if (!value.trim()) {
            // Show error message for empty input
            console.error('Input is empty')
            return
        } else if (value.length > 20) {
            // Show error message for tag length more than 20 characters
            setBigTag(true)
            return
        }
        // Check if the tag already exists in the tags array
        if (tags.includes(value)) {
            setErrorMsg('Category already added')
            return
        }
        // Add the value to the tags array
        setTags([...tags, value])
        // Clear the input
        e.target.value = ''
    }

    function removeTag(index: number) {
        setTags(tags.filter((_, i) => i !== index))
    }

    async function sendPost(formData: any) {
        setUploading(true)
        setErrorMsg('')
        setProgress(10)

        // Get the authenticated user
        const {
            data: { user },
        } = await supabase.auth.getUser()

        const pipe = await pipeline('feature-extraction', 'Supabase/gte-small')
        //@ts-ignore
        let newPost: PostType[] = [
            {
                //@ts-ignore
                title: editPost?.title,
                //@ts-ignore
                description: editPost?.description,
                //@ts-ignore
                rawText: editPost?.rawText,
            },
        ]

        if (formData.postTitle !== editPost?.title) {
            newPost[0]['title'] = formData.postTitle
            // // Generate the embedding from text
            // const output = await pipe(
            //     formData.postTitle + formData.postExcerpt,
            //     {
            //         pooling: 'mean',
            //         normalize: true,
            //     }
            // )
        }
        if (formData.postExcerpt !== editPost?.description) {
            newPost[0]['description'] = formData.postExcerpt
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

            console.log(imagePath)

            if (uploadError) {
                console.error('Error uploading image:', uploadError)
                return
            }

            // Create a URL for the uploaded image
            const uploadedImageUrl =
                'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/' +
                imagePath?.path

            // Update the inserted post with the image URL
            console.log(uploadedImageUrl)
            console.log(context.params.slug[0])
            const { data, error } = await supabase
                .from('posts')
                .update({
                    image: uploadedImageUrl,
                })
                .eq('id', context.params.slug[0])
            console.log(data)
            console.log(error)
        }
        setProgress(30)

        tags.filter((tag) => tag && tag.length > 0).map((tag: string) => {
            if (tag.length == 0 || tag == null || tag.length > 20) {
                setUploading(false)
                setErrorMsg('Categories must be between 1 and 20 characters')
                return
            }
        })
        setProgress(40)

        if (htmlText !== editPost?.rawText) {
            try {
                // Define the regular expression pattern to extract base64 image data
                const pattern = /base64,([^'">]+)/g

                // Find all matches of the pattern in the HTML string
                let match
                const matches = []
                while ((match = pattern.exec(htmlText))) {
                    matches.push(match[1])
                }

                // Function to upload the image to Supabase Storage
                const uploadToSupabaseStorage = async (
                    base64Data: string,
                    index: number
                ) => {
                    try {
                        // Extract the image data type from the base64 string
                        //data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoICAgLC
                        const typeMatch = base64Data.match(/^data:(.+);base64,/)
                        if (typeMatch) {
                            const imageType = typeMatch
                                ? typeMatch[1]
                                : 'image/png' // Set a default value if the type is not matched

                            // Decode base64 data
                            const byteCharacters = atob(base64Data)
                            const byteNumbers = new Array(byteCharacters.length)
                            for (let i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i)
                            }
                            const byteArray = new Uint8Array(byteNumbers)

                            // Convert the byte array to a Blob
                            const blob = new Blob([byteArray], {
                                type: imageType,
                            })

                            // Upload the Blob to Supabase Storage
                            const { data, error } = await supabase.storage
                                .from('images')
                                .upload(
                                    `${user?.id}/${
                                        context.params.slug[0]
                                    }/image${index}.${imageType.split('/')[1]}`,
                                    blob
                                )

                            if (error) {
                                console.error(
                                    `Error uploading image ${index}:`,
                                    error
                                )
                            } else {
                                // Replace the base64 image with the Supabase URL
                                const supabaseUrl = `https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/${data?.path}`
                                htmlText = htmlText.replace(
                                    `data:image/jpeg;base64,${base64Data}`,
                                    `${supabaseUrl}`
                                )
                                htmlText = htmlText.replace(
                                    `data:image/png;base64,${base64Data}`,
                                    `${supabaseUrl}`
                                )
                                htmlText = htmlText.replace(
                                    `data:image/jpg;base64,${base64Data}`,
                                    `${supabaseUrl}`
                                )
                            }
                        }
                    } catch (error) {
                        console.error(`Error processing image ${index}:`, error)
                    }
                }
                // Iterate over the matches and upload images to Supabase Storage
                matches.forEach(async (base64Data, index) => {
                    await uploadToSupabaseStorage(base64Data, index)
                })
                setProgress(60)

                newPost[0]['rawText'] = htmlText
            } catch (error) {
                console.log(error)
            }
        }
        const { data, error } = await supabase
            .from('posts')
            .update(newPost[0])
            .eq('id', context.params.slug[0])
        console.log(error)
        setProgress(70)

        // Ensure tags array itself doesn't contain duplicates
        const uniqueTags = Array.from(new Set(tags))

        const tagsArray = await Promise.all(
            tags
                .filter((tag) => tag && tag.length > 0)
                .map(async (tag: string) => {
                    tag = modifyString(tag)

                    const { data: isCategory } = await supabase
                        .from('categories')
                        .select('id')
                        .eq('name', tag)

                    if (isCategory && isCategory.length > 0) {
                        return {
                            post: context.params.slug[0],
                            category: isCategory[0].id,
                        }
                    } else {
                        // Choose a random element from an array of words
                        const colors = [
                            'Red',
                            'Green',
                            'Blue',
                            'Yellow',
                            'Purple',
                            'Pink',
                            'Orange',
                            'Grey',
                        ]
                        const color =
                            colors[Math.floor(Math.random() * colors.length)]
                        const { data: newCategory } = await supabase
                            .from('categories')
                            .insert({ name: tag, color: color })
                            .select('*')

                        if (newCategory && newCategory.length > 0) {
                            return {
                                post: context.params.slug[0],
                                category: newCategory[0].id,
                            }
                        } else {
                            // Handle the case where the category couldn't be created
                            return null // or any other suitable value
                        }
                    }
                })
        )
        setProgress(90)

        if (tagsArray !== editPost?.post_categories) {
            await supabase
                .from('post_categories')
                .delete()
                .eq('post', editPost?.id)
            await supabase.from('post_categories').insert(tagsArray).select('*')
        }
        setProgress(100)

        router.push(
            `/post/${stringToSlug(formData.postTitle)}/${
                context.params.slug[0]
            }`
        )
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
        formState: { errors },
    } = useForm() // Initialize the hook

    return (
        <>
            <title>Edit Post - Athera</title>
            <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24">
                <header className="text-center max-w-2xl mx-auto mb-16">
                    <Heading2>Edit Post</Heading2>
                </header>
                <div className="rounded-xl md:border md:border-neutral-100 dark:border-neutral-800 md:p-6">
                    <form
                        className="grid md:grid-cols-2 gap-6"
                        onSubmit={handleSubmit(async (data, event) => {
                            event?.preventDefault() // Prevent default form submission
                            await sendPost(data)
                        })}
                        method="post"
                    >
                        <label className="block md:col-span-2">
                            <label>Post Title *</label>
                            <Controller
                                name="postTitle"
                                control={control}
                                defaultValue={editPost?.title}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        className="mt-2"
                                        defaultValue={editPost?.title}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.postTitle && (
                                <Alert type="danger" message="Required" />
                            )}
                        </label>
                        <label className="block md:col-span-2">
                            <label>Post Excerpt</label>
                            <Controller
                                name="postExcerpt"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Textarea
                                            rows={4}
                                            defaultValue={editPost?.description}
                                            {...field}
                                        />
                                        <p className="mt-1 text-sm text-neutral-500">
                                            Brief description for your article.
                                            URLs are hyperlinked.
                                        </p>
                                    </>
                                )}
                            />
                        </label>
                        <label className="block md:col-span-2">
                            <label>Categories</label>
                            <Controller
                                name="tags"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <div className="rounded-l w-min-80vw sm:w-600px mt-4 flex flex-wrap items-center gap-2 bg-transparent">
                                            {tags.map((tag, index) =>
                                                tag ? (
                                                    <div
                                                        className="bg-gray-200 dark:bg-neutral-900 flex items-center rounded-full px-3 py-1"
                                                        key={index}
                                                    >
                                                        <span className="text-black dark:text-gray-400 mr-2">
                                                            {tag}
                                                        </span>
                                                        <span
                                                            className="h-5 w-5 bg-gray-800 text-white rounded-full flex items-center justify-center text-lg cursor-pointer"
                                                            onClick={() =>
                                                                removeTag(index)
                                                            }
                                                        >
                                                            &times;
                                                        </span>
                                                    </div>
                                                ) : null
                                            )}
                                            <input
                                                onKeyDown={handleKeyDown}
                                                type="text"
                                                className="flex-grow py-2 rounded-md border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200/50 bg-white dark:border-neutral-500 dark:focus:ring-primary-500/30 dark:bg-neutral-900"
                                                placeholder="Type something"
                                            />
                                        </div>
                                        {bigTag && (
                                            <Alert
                                                type="danger"
                                                message="Categories must be between 1 and 20 characters"
                                            />
                                        )}
                                    </>
                                )}
                            />
                        </label>

                        <div className="group block md:col-span-2">
                            <Label>Featured Image</Label>

                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                className="relative mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-md"
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
                                                        setSelectedImage(null)
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
                                                    className={`relative cursor-pointer rounded-md font-medium text-primary-6000 hover:text-primary-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 ${
                                                        isDragging
                                                            ? 'border-2 border-primary-500'
                                                            : ''
                                                    }`}
                                                >
                                                    {isDragging ? (
                                                        <span>Drop here</span>
                                                    ) : (
                                                        <span>
                                                            Upload a file
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
                                                PNG, JPG up to 10MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <label className="block md:col-span-2">
                            <Label> Post Content</Label>
                            <link
                                href="https://cdn.syncfusion.com/ej2/22.1.34/tailwind.css"
                                rel="stylesheet"
                            ></link>
                            <div className="control-pane dark:bg-blue-950">
                                <div className="control-section" id="rteTools">
                                    <div className="rte-control-section">
                                        <div className="mx-auto custom-rte-styles">
                                            <RichTextEditorComponent
                                                id="toolsRTE"
                                                ref={(richtexteditor) => {
                                                    rteObj = richtexteditor!
                                                    if (
                                                        richtexteditor != null
                                                    ) {
                                                        setText(
                                                            rteObj.getText()
                                                        )
                                                        setHtmlText(
                                                            rteObj.getHtml()
                                                        )
                                                    }
                                                }}
                                                // enablePersistence={true}
                                                value={editPost?.rawText}
                                                showCharCount={true}
                                                insertImageSettings={
                                                    insertImageSettings
                                                }
                                                actionBegin={handleFullScreen.bind(
                                                    this
                                                )}
                                                placeholder="Type something"
                                                maxLength={50000}
                                                toolbarSettings={
                                                    toolbarSettings
                                                }
                                                fileManagerSettings={
                                                    fileManagerSettings
                                                }
                                                pasteCleanupSettings={
                                                    pasteCleanupSettings
                                                }
                                                quickToolbarSettings={
                                                    quickToolbarSettings
                                                }
                                            >
                                                <Inject
                                                    services={[
                                                        Toolbar,
                                                        Image,
                                                        Link,
                                                        HtmlEditor,
                                                        Count,
                                                        QuickToolbar,
                                                        Table,
                                                        PasteCleanup,
                                                        FileManager,
                                                        EmojiPicker,
                                                    ]}
                                                />
                                            </RichTextEditorComponent>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </label>
                        {!uploading ? (
                            <ButtonPrimary
                                type="submit"
                                className="text-white md:col-span-2 rounded-lg"
                            >
                                Update Post
                            </ButtonPrimary>
                        ) : (
                            <>
                                <ButtonPrimary
                                    className="text-white md:col-span-2 rounded-lg"
                                    loading
                                >
                                    Updating...
                                </ButtonPrimary>
                                <div className="md:col-span-2 h-2 relative overflow-hidden rounded-lg">
                                    <div className="w-full h-full bg-gray-200 absolute"></div>
                                    <div
                                        style={{ width: `${progress}%` }}
                                        className="h-full bg-blue-500 absolute rounded-lg transition-all duration-500 ease-in-out"
                                    ></div>
                                </div>
                            </>
                        )}
                        {errorMsg && <Alert type="danger" message={errorMsg} />}
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditPost
