import { Listbox, Switch, Transition } from '@headlessui/react'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Input from '@/components/Input/Input'
import Label from '@/components/Label/Label'
import Textarea from '@/components/Textarea/Textarea'
import { debounce } from 'lodash'
import React, { FC, Fragment, useState } from 'react'
import ButtonThird from '@/components/Button/ButtonThird'
import Button from '@/components/Button/Button'
import NcModal from '@/components/NcModal/NcModal'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import DateTimepicker from '@/components/DateTimePicker/DateTimepicker'
import dayjs from 'dayjs'
import Alert from '@/components/Alert/Alert'
import toast from 'react-hot-toast'
import { useThemeMode } from '@/hooks/useThemeMode'

export interface PostOptionsData {
    excerptText: string
    isAllowComments: boolean
    timeSchedulePublication?: Date
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

    //

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
                className="flex-shrink-0 !rounded-lg !bg-transparent dark:!bg-transparent"
                // title="Post options"
                pattern="third"
                onClick={openModal}
                type="button"
            >
                <Cog8ToothIcon className="w-7 h-7" />
            </Button>
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
                {/* @ts-ignore */}
                <DateTimepicker
                    placeholder="Pick date & time"
                    minDate={minDate}
                    value={timeSchedulePublication}
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
            <div className="flex gap-3 sm:gap-8 items-center">
                <Label>Allow comments</Label>
                <Switch
                    checked={isAllowComments}
                    onChange={setIsAllowComments}
                    className={`${
                        isAllowComments ? 'bg-primary-700' : 'bg-gray-700'
                    }
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                    <span className="sr-only">Allow comments</span>
                    <span
                        aria-hidden="true"
                        className={`${
                            isAllowComments
                                ? 'translate-x-9 rtl:-translate-x-9'
                                : 'translate-x-0'
                        }
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
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

                    {renderSchedulePublication()}

                    {renderAllowCommentSwitch()}
                    {renderAllowCommentSwitch()}
                </div>
            </div>
        )
    }

    return (
        <>
            <NcModal
                containerClassName="flex"
                contentPaddingClass=""
                contentExtraClass="max-w-screen-md"
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
