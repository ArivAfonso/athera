import { Listbox, Switch, Transition } from '@headlessui/react'
import { debounce } from 'lodash'
import React, { FC, Fragment, useState } from 'react'
import {
    Modal,
    Alert,
    Button,
    Textarea,
    Label,
    ButtonPrimary,
    ButtonThird,
    DateTimePicker,
} from 'ui'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { useThemeMode } from '@/hooks/useThemeMode'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'

export interface PostOptionsData {
    excerptText: string
    isAllowComments: boolean
    timeSchedulePublication?: Date
    license?: string | null
}

interface PostOptionsBtnProps {
    onSubmit: (data: PostOptionsData) => void
    defaultData: PostOptionsData
}

const PostOptionsBtn: FC<PostOptionsBtnProps> = ({ onSubmit, defaultData }) => {
    const { isDarkMode } = useThemeMode()
    const [timeSchedulePublication, settimeSchedulePublication] = useState(
        defaultData.timeSchedulePublication
    )
    const [excerptText, setExcerptText] = useState(defaultData.excerptText)
    const [isAllowComments, setIsAllowComments] = useState(
        defaultData.isAllowComments
    )

    const [postLicenseSelected, setPostLicenseSelected] = useState(
        defaultData.license
    )

    const [isDragging, setIsDragging] = useState(false)

    const handleDrop = (event: any) => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        if (file) {
            if (
                file.type === 'image/png' ||
                file.type === 'image/jpeg' ||
                file.type === 'image/jpg'
            ) {
                // setSelectedImage(file)
            } else {
                // Handle the case when the file type is not supported
                toast.custom((t) => (
                    <Alert
                        type="danger"
                        message="File type not supported. Please upload a PNG or JPG file"
                    />
                ))
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
        // if (file) {
        //     setSelectedImage(file)
        // }
    }

    const licenses = [
        'CC Attribution',
        'CC Attribution-ShareAlike',
        'CC Attribution-NoDerivs',
        'CC Attribution-NonCommercial',
        'CC Attribution-NonCommercial-ShareAlike',
        'CC Attribution-NonCommercial-NoDerivs',
        'Public Domain Dedication (CC0)',
    ]

    const debounceGetExcerpt = debounce(function (e: string) {
        setExcerptText(e)
    }, 200)

    const handleClickApply = () => {
        onSubmit({
            excerptText,
            isAllowComments,
            timeSchedulePublication,
        })
    }

    const handleClickCancel = () => {}
    //

    const renderBtnOpenPopover = (openModal: () => void) => {
        return (
            <Button
                sizeClass="px-4"
                className="PostOptionsBtn flex-shrink-0 !rounded-lg !bg-transparent dark:!bg-transparent"
                // title="Post options"
                pattern="third"
                onClick={openModal}
                type="button"
            >
                <Cog8ToothIcon className="w-7 h-7" />
            </Button>
        )
    }

    const renderListBoxPostlicense = () => {
        return (
            <div>
                <Label>License</Label>
                <Listbox
                    value={postLicenseSelected}
                    onChange={setPostLicenseSelected}
                >
                    <div className="relative z-10 mt-1">
                        <Listbox.Button className="focus:outline-none relative w-full cursor-default rounded-full py-2 pl-3 pr-10 text-left border border-neutral-100 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600 text-gray-600 dark:text-gray-300">
                            <span className="block truncate capitalize">
                                {postLicenseSelected
                                    ? postLicenseSelected
                                    : 'Select a license'}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronsUpDownIcon
                                    strokeWidth={1.75}
                                    className="h-5 w-5 text-gray-400 dark:text-gray-500"
                                />
                            </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="focus:outline-none absolute hiddenScrollbar mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white dark:bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm">
                                {licenses.map((license, key) => (
                                    <Listbox.Option
                                        key={key}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                active
                                                    ? 'bg-amber-100 text-amber-900'
                                                    : 'text-gray-900'
                                            }`
                                        }
                                        value={license}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate capitalize ${
                                                        selected
                                                            ? 'font-medium'
                                                            : 'font-normal'
                                                    }`}
                                                >
                                                    {license}
                                                </span>
                                                {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                        <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>
        )
    }

    const renderExcerptTextarea = () => {
        return (
            <div>
                <Label>Write an excerpt (optional)</Label>
                <Textarea
                    onChange={(event) => {
                        debounceGetExcerpt(event.currentTarget.value)
                    }}
                    defaultValue={excerptText}
                    className="mt-1"
                />
            </div>
        )
    }

    const renderUploadGallery = () => {
        return (
            <div>
                <Label>Gallery images</Label>
                <div className="flex gap-x-2.5 py-2 overflow-x-auto snap-x">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item, idx) => (
                        <div
                            className="flex-shrink-0 h-full w-48 snap-start flex flex-col"
                            key={idx}
                        >
                            <Label>{`Image ${item}`}</Label>
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                className="mt-1 flex justify-center px-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-2xl"
                            >
                                <div className="space-y-1 text-center pb-8">
                                    {/* {selectedImage ? (
                                        <NextImage
                                            src={URL.createObjectURL(
                                                selectedImage
                                            )}
                                            alt="Selected Image"
                                            width={800} // Adjust the desired width
                                            height={480} // Adjust the desired height
                                        />
                                    ) : ( */}
                                    <>
                                        <svg
                                            className="mx-auto h-12 w-12 text-neutral-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        ></svg>
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
                                                    <span>Upload an image</span>
                                                )}
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/jpg"
                                                    className="sr-only"
                                                    //@ts-ignore
                                                    onChange={handleImageSelect}
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-neutral-500">
                                            PNG, JPG up to 1MB
                                        </p>
                                    </>
                                    {/* )} */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const renderSchedulePublication = () => {
        const dateGap = 7

        // Only able to select previos & future 7 days start from today
        const minDate = dayjs(new Date())
            .subtract(dateGap, 'day')
            .startOf('day')
            .toDate()
        return (
            <div>
                <Label>Schedule Publication</Label>
                <DateTimePicker
                    value={
                        timeSchedulePublication
                            ? timeSchedulePublication
                            : new Date()
                    }
                    onChange={(date) => {
                        if (date) {
                            settimeSchedulePublication(date)
                        }
                    }}
                />
            </div>
        )
    }

    const renderAllowCommentSwitch = () => {
        return (
            <div className="flex gap-2 sm:gap-6 items-center">
                <Label>Allow comments</Label>
                <Switch
                    checked={isAllowComments}
                    onChange={setIsAllowComments}
                    className={`${
                        isAllowComments ? 'bg-primary-700' : 'bg-gray-700'
                    }
                      relative inline-flex h-[30px] w-[62px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                    <span className="sr-only">Allow comments</span>
                    <span
                        aria-hidden="true"
                        className={`${
                            isAllowComments
                                ? 'translate-x-8 rtl:-translate-x-8'
                                : 'translate-x-0'
                        }
                        pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                </Switch>
            </div>
        )
    }

    const renderContent = () => {
        return (
            <div className="">
                <div className="relative flex flex-col px-5 py-6 space-y-5">
                    {renderExcerptTextarea()}

                    {renderUploadGallery()}
                    {renderListBoxPostlicense()}

                    {renderSchedulePublication()}

                    {renderAllowCommentSwitch()}
                    {renderAllowCommentSwitch()}
                </div>
            </div>
        )
    }

    return (
        <>
            <Modal
                containerClassName="flex"
                contentPaddingClass=""
                contentExtraClass="max-w-screen-md md:overflow-visible"
                renderContent={renderContent}
                renderTrigger={renderBtnOpenPopover}
                modalTitle="Post options"
                renderFooter={(closeModal) => {
                    return (
                        <div className="flex items-center justify-between">
                            <ButtonThird
                                onClick={() => {
                                    handleClickCancel()
                                    closeModal()
                                }}
                            >
                                Cancel
                            </ButtonThird>
                            <ButtonPrimary
                                onClick={() => {
                                    handleClickApply()
                                    closeModal()
                                }}
                            >
                                Apply
                            </ButtonPrimary>
                        </div>
                    )
                }}
            />
        </>
    )
}

export default PostOptionsBtn
