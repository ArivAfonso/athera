'use client'

import React, { useEffect, useState } from 'react'
import Input from '@/components/Input/Input'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Select from '@/components/Select/Select'
import Textarea from '@/components/Textarea/Textarea'
import Label from '@/components/Label/Label'
import { BlockNoteView, useBlockNote } from '@blocknote/react'
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
} from '@syncfusion/ej2-react-richtexteditor'
import {
    ToolbarSettingsModel,
    FileManager,
    FileManagerSettingsModel,
    QuickToolbarSettingsModel,
} from '@syncfusion/ej2-react-richtexteditor'
import '@/styles/styles.css'
import { useThemeMode } from '@/hooks/useThemeMode'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Controller, useForm } from 'react-hook-form'
import { htmlToJSON } from '@/utils/htmlToJson'
import { Alert } from '@/components/Alert/Alert'
import { useRouter } from 'next/navigation'

const DashboardSubmitPost = () => {
    let rteObj: RichTextEditorComponent
    const hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/'

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
    let textArea: HTMLTextAreaElement
    let myCodeMirror: any
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
        // Load the tailwind-dark.css file when dark mode is enabled
        if (isDarkMode) {
            const linkElement = document.createElement('link')
            linkElement.href =
                'https://cdn.syncfusion.com/ej2/22.1.34/tailwind-dark.css'
            linkElement.rel = 'stylesheet'
            document.head.appendChild(linkElement)
        } else {
            // Remove the link to tailwind-dark.css if dark mode is disabled
            const existingLink = document.querySelector(
                'link[href="https://cdn.syncfusion.com/ej2/22.1.34/tailwind.css"]'
            )
            if (existingLink) {
                const linkElement = document.createElement('link')
                existingLink.remove()
                linkElement.href =
                    'https://cdn.syncfusion.com/ej2/22.1.34/tailwind.css'
                linkElement.rel = 'stylesheet'
                document.head.appendChild(linkElement)
            }
        }
    }, [isDarkMode])

    const supabase = createClientComponentClient()
    const [errorMsg, setErrorMsg] = useState('')
    const [text, setText] = useState('')
    const [htmlText, setHtmlText] = useState('')
    console.log(text)

    async function sendPost(formData: any) {
        console.log(htmlToJSON(htmlText))
        const {
            data: { user },
        } = await supabase.auth.getUser()
        const { error } = await supabase.from('posts').insert({
            title: formData.postTitle,
            author: user?.id,
            description: formData.postExcerpt,
            category: formData.category,
            text: text,
            rawText: htmlToJSON(htmlText),
        })
        if (error) {
            setErrorMsg(error.message)
        }
    }

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm() // Initialize the hook

    return (
        <div className="rounded-xl md:border md:border-neutral-100 dark:border-neutral-800 md:p-6">
            <form
                className="grid md:grid-cols-2 gap-6"
                action="#"
                onSubmit={handleSubmit(async (data) => await sendPost(data))}
                method="post"
            >
                <label className="block md:col-span-2">
                    <label>Post Title *</label>
                    <Controller
                        name="postTitle"
                        control={control}
                        render={({ field }) => (
                            <Input type="text" className="mt-2" {...field} />
                        )}
                    />
                    {errors.postTitle && <Alert type="error">Required</Alert>}
                </label>
                <label className="block md:col-span-2">
                    <label>Post Excerpt</label>
                    <Controller
                        name="postExcerpt"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Textarea rows={4} {...field} />
                                <p className="mt-1 text-sm text-neutral-500">
                                    Brief description for your article. URLs are
                                    hyperlinked.
                                </p>
                            </>
                        )}
                    />
                </label>
                <label className="block">
                    <label>Category</label>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select className="mt-1" {...field}>
                                <option value="-1">– select –</option>
                                <option value="Category 1">Category 1</option>
                                <option value="Category 2">Category 2</option>
                                <option value="Category 3">Category 3</option>
                            </Select>
                        )}
                    />
                </label>
                <label className="block">
                    <label>Tags</label>
                    <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                            <Input type="text" className="mt-1" {...field} />
                        )}
                    />
                </label>

                <div className="block md:col-span-2">
                    <Label>Featured Image</Label>

                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
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
                            <div className="flex flex-col sm:flex-row text-sm text-neutral-6000">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md font-medium text-primary-6000 hover:text-primary-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-neutral-500">
                                PNG, JPG, GIF up to 2MB
                            </p>
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
                                            if (richtexteditor != null) {
                                                setText(rteObj.getText())
                                                setHtmlText(rteObj.getHtml())
                                            }
                                        }}
                                        showCharCount={true}
                                        actionBegin={handleFullScreen.bind(
                                            this
                                        )}
                                        toolbarSettings={toolbarSettings}
                                        fileManagerSettings={
                                            fileManagerSettings
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

                <ButtonPrimary className="md:col-span-2" type="submit">
                    Submit post
                </ButtonPrimary>
                {errorMsg && <Alert type="error">{errorMsg}</Alert>}
            </form>
        </div>
    )
}

export default DashboardSubmitPost
