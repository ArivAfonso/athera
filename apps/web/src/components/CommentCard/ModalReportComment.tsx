'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import { Modal, Textarea, ButtonPrimary, ButtonThird } from 'ui'
import { RadioGroup } from '@/app/headlessui'
import twFocusClass from '@/utils/twFocusClass'
import { Controller, useForm } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'

export interface ProblemPlan {
    name: string
    label: string
}

export interface ModalReportCommentprops {
    show: boolean
    problemPlans?: ProblemPlan[]
    id: string
    onCloseModalReportItem: () => void
}

const problemPlansDemo = [
    { name: 'Violence', id: 'Violence', label: 'Violence' },
    { name: 'Trouble', id: 'Trouble', label: 'Trouble' },
    { name: 'Spam', id: 'Spam', label: 'Spam' },
    { name: 'Other', id: 'Other', label: 'Other' },
]

const ModalReportComment: FC<ModalReportCommentprops> = ({
    problemPlans = problemPlansDemo,
    show,
    id,
    onCloseModalReportItem,
}) => {
    const textareaRef = useRef(null)

    const [problemSelected, setProblemSelected] = useState(problemPlans[0])

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                const element: HTMLTextAreaElement | null = textareaRef.current
                if (element) {
                    ;(element as HTMLTextAreaElement).focus()
                }
            }, 400)
        }
    }, [show])

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const [uploadErrors, setUploadError] = useState('')

    const sendReport = async (data: any) => {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getUser()
        const { error } = await supabase.from('comment_reports').insert([
            {
                reporter: session.user?.id,
                comment: id,
                type: problemSelected,
                message: data.message,
            },
        ])
        if (error) {
            setUploadError(error.message)
        }
    }

    const renderContent = () => {
        return (
            <>
                <form
                    action="#"
                    onSubmit={handleSubmit(
                        async (data) => await sendReport(data)
                    )}
                >
                    {/* RADIO PROBLEM PLANS */}
                    <RadioGroup
                        value={problemSelected}
                        onChange={setProblemSelected}
                    >
                        <RadioGroup.Label className="sr-only">
                            Problem Plans
                        </RadioGroup.Label>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            {problemPlans.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`${
                                        problemSelected === plan
                                            ? 'bg-primary-6000 text-white dark:bg-primary-700'
                                            : 'bg-white border-t border-neutral-50'
                                    } relative shadow-lg rounded-lg px-3 py-3 cursor-pointer flex sm:px-5 sm:py-4 focus:outline-none`}
                                >
                                    <label>
                                        <Controller
                                            name="problemSelected"
                                            control={control}
                                            defaultValue={false} // Set the default value based on your initial state
                                            render={({ field }) => (
                                                <input
                                                    type="radio"
                                                    {...field}
                                                    className="hidden"
                                                    // value={plan}
                                                />
                                            )}
                                        />
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center">
                                                <div className="text-sm">
                                                    <p
                                                        className={`font-medium line-clamp-1 ${
                                                            problemSelected ===
                                                            plan
                                                                ? 'text-white'
                                                                : 'text-neutral-900'
                                                        }`}
                                                    >
                                                        {plan.label}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>

                    {/* TEXAREA MESSAGER */}
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
                            Message
                        </h4>
                        <span className="text-sm text-neutral-6000 dark:text-neutral-400">
                            Please provide any additional information or context
                            that will help us understand and handle the
                            situation.
                        </span>
                        <Controller
                            name="message"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    placeholder="..."
                                    className="mt-3"
                                    required={true}
                                    rows={4}
                                    id="report-message"
                                />
                            )}
                        />
                        {errors.message && (
                            <span className="text-red-600">
                                Message is required
                            </span>
                        )}
                    </div>

                    <div className="mt-4 space-x-3">
                        <ButtonPrimary type="submit">Submit</ButtonPrimary>
                        <ButtonThird
                            type="button"
                            onClick={onCloseModalReportItem}
                        >
                            Cancel
                        </ButtonThird>
                    </div>
                </form>
                {uploadErrors && (
                    <div className="text-red-600">{uploadErrors}</div>
                )}
            </>
        )
    }

    const renderTrigger = () => {
        return null
    }

    return (
        <Modal
            isOpenProp={show}
            onCloseModal={onCloseModalReportItem}
            contentExtraClass="max-w-screen-md"
            renderContent={renderContent}
            renderTrigger={renderTrigger}
            modalTitle="Report Abuse"
        />
    )
}

export default ModalReportComment
