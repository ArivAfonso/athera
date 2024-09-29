import { useStore } from '@/stores/newPost'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { FC, useDeferredValue, useEffect, useId, useState } from 'react'

interface ImageUploadToServerProps {
    className?: string
    contentClassName?: string
    onChangeImage?: (image: ImageState) => void
    defaultImage?: ImageState
    worker: Worker
}

export interface ImageState {
    sourceUrl: string
    // databaseID
    id: string | number
    altText?: string
}

const ImageUploadToServer: FC<ImageUploadToServerProps> = ({
    className = 'flex-1',
    contentClassName = 'px-6 pt-5 pb-6 ',
    worker,
    onChangeImage = () => {},
    defaultImage = { sourceUrl: '', id: '' },
}) => {
    const [imageState, setImageState] = useState<ImageState>(defaultImage)
    const { newPostImgs, setNewPost } = useStore()
    const [isUploading, setIsUploading] = useState(false)
    const [uploadErrMess, setUploadErrMess] = useState('')

    const inputID = useId() + '_fileUpload'
    const deferredValueImageState = useDeferredValue(imageState.id)
    //
    useEffect(() => {
        setImageState(defaultImage)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultImage.id])

    useEffect(() => {
        onChangeImage(imageState)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deferredValueImageState])
    //

    const handleDeleteImageById = async (id: string) => {
        setImageState({
            sourceUrl: '',
            id: '',
            altText: '',
        })

        const supabase = createClient()
        const { error } = await supabase.storage
            .from('images')
            .remove([id])
            .then((res) => {
                // console.log('res', res)
                return res
            })
            .catch((err) => {
                // console.log('err', err)
                return err
            })

        return
    }

    function fileValidation(filePath: string) {
        // Allowing file type
        const allowedExtensions =
            /(\.jpg|\.jpeg|\.png|\.gif|\.ico|\.webp|\.JPG|\.JPEG|\.PNG|\.GIF)$/i
        return allowedExtensions.exec(filePath)
    }

    const handleUploadImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUploadErrMess('')
        if (event.target.files && event.target.files[0]) {
            setIsUploading(true)
            const file = event.target.files[0]

            if (!fileValidation(file.name)) {
                setUploadErrMess(
                    'File type is not allowed. Only image files are permitted.'
                )
                setIsUploading(false)
                return
            }

            // Create a local blob URL
            const localBlobUrl = URL.createObjectURL(file)

            setImageState({
                sourceUrl: localBlobUrl,
                id: file.name,
                altText: '',
            })
            setIsUploading(false)

            if (!worker) {
                console.error('Worker not initialized')
                return
            }

            worker.postMessage(localBlobUrl)

            worker.onmessage = (e: MessageEvent) => {
                setNewPost({
                    images: [
                        ...(newPostImgs ? newPostImgs.images : []),
                        {
                            url: localBlobUrl,
                            rating: e.data.results,
                        },
                    ],
                })
            }

            worker.onerror = (error) => {
                console.error('Worker error:', error)
            }
        }
    }

    const LOADING = isUploading

    return (
        <div className={className}>
            <label
                htmlFor={inputID}
                className={`block group ${
                    LOADING
                        ? 'cursor-not-allowed animate-pulse'
                        : 'cursor-pointer'
                }`}
            >
                <div
                    className={`relative mt-1 flex justify-center border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-xl ${contentClassName}`}
                >
                    {!!imageState.sourceUrl && !LOADING && (
                        <div
                            className="opacity-0 group-hover:opacity-100 absolute right-2.5 top-2.5 z-10 p-1.5 bg-neutral-900 dark:bg-neutral-700 text-white rounded-md cursor-pointer 
              transition-opacity duration-300 "
                            title="Delete image"
                            onClick={(e) => {
                                e.preventDefault()
                                handleDeleteImageById(String(imageState.id))
                            }}
                        >
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M10.33 16.5H13.66"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M9.5 12.5H14.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}
                    <div className="flex-1 space-y-1 text-center">
                        {imageState.sourceUrl && (
                            <div className="w-full max-w-md mx-auto">
                                <div className="w-full aspect-w-16 aspect-h-8">
                                    <Image
                                        src={imageState.sourceUrl}
                                        width={100}
                                        height={100}
                                        className="rounded-lg object-cover shadow-lg"
                                        alt={''}
                                    />
                                </div>
                            </div>
                        )}
                        {!imageState.sourceUrl && (
                            <svg
                                className="mx-auto h-12 w-12 text-neutral-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                            </svg>
                        )}
                        <div className="flex justify-center text-sm text-neutral-6000 dark:text-neutral-300">
                            <label className="relative flex-shrink-0 cursor-pointer  rounded-md font-medium text-primary-6000 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                <span>
                                    {imageState.sourceUrl
                                        ? 'Click to change'
                                        : 'Upload a file'}
                                </span>

                                <input
                                    disabled={LOADING}
                                    id={inputID}
                                    name="fileUpload"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleUploadImageChange}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            PNG, JPG, GIF, WEBP, SVG ...
                        </p>
                    </div>
                </div>
            </label>
        </div>
    )
}

export default ImageUploadToServer
