'use client'

import { useState } from 'react'
import HorizontalFormBlockWrapper from './FormWrapper'
import { RadioGroup, Switch } from '@headlessui/react'
import Radio from '@/components/Radio/Radio'
import Button from '@/components/Button/Button'
import Checkbox from '@/components/Checkbox/Checkbox'
import { Heading3 } from 'lucide-react'

const generalOptions = [
    {
        title: 'I’m mentioned in a message',
    },
    {
        title: 'Someone replies to any message',
    },
    {
        title: 'I’m assigned a task',
    },
    {
        title: 'A task is overdue',
    },
    {
        title: 'A task status is updated',
    },
]

const summaryOptions = [
    {
        title: 'Daily summary',
    },
    {
        title: 'Weekly summary',
    },
    {
        title: 'Monthly summary',
    },
    {
        title: 'Quaterly summary',
    },
]

export default function NotificationSettingsView() {
    const [values, setValues] = useState<string[]>([])
    const [value, setValue] = useState('')

    return (
        <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
            <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row pb-8">
                <h2 className="text-2xl sm:text-3xl font-semibold">
                    Notification Settings
                </h2>
            </div>
            <HorizontalFormBlockWrapper
                title="General notifications"
                description="Select when you’ll be notified when the following changes occur."
                descriptionClassName="max-w-[344px]"
            >
                <div className="col-span-2">
                    {generalOptions.map((opt, index) => (
                        <div
                            key={`generalopt-${index}`}
                            className="flex items-center justify-between border-b border-muted py-6 last:border-none last:pb-0"
                        >
                            <h3 className="text-sm font-medium dark:text-gray-300 text-gray-900">
                                {opt.title}
                            </h3>
                            <ButtonGroup
                                onChange={(option) =>
                                    console.log(opt.title, option)
                                }
                            />
                        </div>
                    ))}
                </div>
            </HorizontalFormBlockWrapper>
            <HorizontalFormBlockWrapper
                title="Summary notifications"
                description="Select when you’ll be notified when the following summaries or report are ready."
                descriptionClassName="max-w-[344px]"
            >
                <div className="col-span-2">
                    {summaryOptions.map((opt, index) => (
                        <div
                            key={`summaryopt-${index}`}
                            className="flex items-center justify-between border-b border-muted py-6 last:border-none last:pb-0"
                        >
                            <h4 className="text-sm font-medium dark:text-gray-300 text-gray-900">
                                {opt.title}
                            </h4>
                            <ButtonGroup
                                onChange={(option) =>
                                    console.log(opt.title, option)
                                }
                            />
                        </div>
                    ))}
                </div>
            </HorizontalFormBlockWrapper>
            <HorizontalFormBlockWrapper
                title="Comments"
                description="These are notifications for comments on your posts and replies to your comments."
                descriptionClassName="max-w-[344px]"
            >
                <div className="col-span-2">
                    <Switch name="Do not notify me" />
                    <Switch
                        name="Mentions only"
                        className="font-medium text-sm text-gray-900"
                    />
                    <Switch name="All comments" />
                </div>
            </HorizontalFormBlockWrapper>
            <HorizontalFormBlockWrapper
                title="Notifications from us"
                description="These are notifications for when someone tags you in a comment, post or story."
                descriptionClassName="max-w-[344px]"
            >
                <div className="col-span-2">
                    <Checkbox
                        name="app_notification"
                        label="News and updates"
                        className="mb-5"
                        //   labelClassName="pl-2 text-sm font-medium !text-gray-900"
                        //   helperClassName="text-gray-500 text-sm mt-3 ms-8"
                        //   helperText="News about product and feature updates."
                    />
                    <Checkbox
                        name="app_notification"
                        label="News and updates"
                        className="mb-5"
                        //   labelClassName="pl-2 text-sm font-medium !text-gray-900"
                        //   helperClassName="text-gray-500 text-sm mt-3 ms-8"
                        //   helperText="News about product and feature updates."
                    />
                    <Checkbox
                        name="app_notification"
                        label="News and updates"
                        className="mb-5"
                        //   labelClassName="pl-2 text-sm font-medium !text-gray-900"
                        //   helperClassName="text-gray-500 text-sm mt-3 ms-8"
                        //   helperText="News about product and feature updates."
                    />
                </div>
            </HorizontalFormBlockWrapper>
            <HorizontalFormBlockWrapper
                title="Reminders"
                description="These are notifications to remind you of updates you might have missed."
                descriptionClassName="max-w-[344px]"
            >
                <div className="col-span-2">
                    <RadioGroup
                        value={value}
                        className="justify-center space-x-4 space-y-4"
                    >
                        <div className="flex w-full flex-col divide-slate-300 md:w-[500px]">
                            <Radio
                                name="reminders"
                                label="Do not notify me"
                                id="do_not_notify_reminders"
                                className="mb-5 pl-2 text-sm font-medium dark:text-gray-300 text-gray-900"
                                // className="pl-2 text-sm font-medium text-gray-900"
                            />
                            <Radio
                                name="reminders"
                                label="Do not notify me"
                                id="do_not_notify_reminders"
                                className="mb-5 pl-2 text-sm font-medium dark:text-gray-300 text-gray-900"
                                // className="pl-2 text-sm font-medium text-gray-900"
                            />
                            <Radio
                                name="reminders"
                                label="Do not notify me"
                                id="do_not_notify_reminders"
                                className="mb-5 pl-2 text-sm font-medium dark:text-gray-300 text-gray-900"
                                // className="pl-2 text-sm font-medium text-gray-900"
                            />
                        </div>
                    </RadioGroup>
                </div>
            </HorizontalFormBlockWrapper>
            <HorizontalFormBlockWrapper
                title="More activity about you"
                description="These are notifications for posts on your profile, likes and other reactions to your posts, and more."
                descriptionClassName="max-w-[344px]"
                className="border-0 pb-0"
            >
                <div className="col-span-2">
                    <RadioGroup
                        value={value}
                        className="justify-center space-x-4 space-y-4"
                    >
                        <div className="flex w-full flex-col divide-slate-300 md:w-[500px]">
                            <Radio
                                name="reminders"
                                label="Do not notify me"
                                id="do_not_notify_reminders"
                                className="mb-5 pl-2 text-sm font-medium dark:text-gray-300 text-gray-900"
                                // className="pl-2 text-sm font-medium text-gray-900"
                            />
                            <Radio
                                name="reminders"
                                label="Do not notify me"
                                id="do_not_notify_reminders"
                                className="mb-5 pl-2 text-sm font-medium dark:text-gray-300 text-gray-900"
                                // className="pl-2 text-sm font-medium text-gray-900"
                            />
                        </div>
                    </RadioGroup>
                </div>
            </HorizontalFormBlockWrapper>
        </div>
    )
}

const options = ['None', 'In-app', 'Email']

function ButtonGroup({ onChange }: { onChange: (option: string) => void }) {
    const [selected, setSelected] = useState<string>()
    function handleOnClick(option: string) {
        setSelected(option)
        onChange && onChange(option)
    }

    return (
        <div className="inline-flex gap-1">
            {options.map((option) => (
                <Button
                    key={option}
                    // variant={selected === option ? 'solid' : 'outline'}
                    className="rounded-md bg-transparent border border-gray-5000"
                    pattern="white"
                    onClick={() => handleOnClick(option)}
                >
                    {option}
                </Button>
            ))}
        </div>
    )
}
