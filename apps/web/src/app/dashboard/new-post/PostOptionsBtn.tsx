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

export interface PostOptionsData {
    excerptText: string
    isAllowComments: boolean
    timeSchedulePublication?: string
}

interface PostOptionsBtnProps {
    onSubmit: (data: PostOptionsData) => void
    defaultData: PostOptionsData
}

const PostOptionsBtn: FC<PostOptionsBtnProps> = ({ onSubmit, defaultData }) => {
    const [timeSchedulePublication, settimeSchedulePublication] = useState(
        defaultData.timeSchedulePublication
    )
    const [excerptText, setExcerptText] = useState(defaultData.excerptText)
    const [isAllowComments, setIsAllowComments] = useState(
        defaultData.isAllowComments
    )

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
    const renderSchedulePublication = () => {
        return (
            <div>
                <Label>Schedule Publication</Label>
                <Input
                    onChange={(event) => {
                        settimeSchedulePublication(event.currentTarget.value)
                    }}
                    defaultValue={timeSchedulePublication}
                    className="mt-1"
                    type="datetime-local"
                    id="Schedule-time"
                    name="Schedule-time"
                    min={new Date().toISOString().slice(0, 16)}
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

                    {renderSchedulePublication()}

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
