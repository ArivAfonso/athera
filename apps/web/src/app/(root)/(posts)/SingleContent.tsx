'use client'

import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import SingleAuthor from './SingleAuthor'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import PostCardLikeAction from '@/components/PostCardLikeAction/PostCardLikeAction'
import PostCardCommentBtn from '@/components/PostCardCommentBtn/PostCardCommentBtn'
import { ArrowUpIcon } from '@heroicons/react/24/solid'
import AuthorType from '@/types/AuthorType'
import parse from 'html-react-parser'
import PostCommentSection from './PostCommentSection'
import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import { Image as ImageHypermedia } from '@/components/PostSubmissionEditor/extensions/hypermedia/nodes/image/image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { generateHTML } from '@tiptap/core'
import { Youtube } from '@/components/PostSubmissionEditor/extensions/hypermedia/nodes/youtube/youtube'
import { SoundCloud } from '@/components/PostSubmissionEditor/extensions/hypermedia/nodes/soundcloud/soundcloud'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Twitter } from '@/components/PostSubmissionEditor/extensions/hypermedia/nodes/twitter/twitter'
import { ScaleIcon } from 'lucide-react'
import TableContentAnchor from './TableContentAnchor'
import BookmarkBtn from '@/components/BookmarkBtn/BookmarkBtn'
import CustomHeading from '@/components/PostSubmissionEditor/extensions/headings/CustomHeading'
import { Mathematics } from '@/components/PostSubmissionEditor/extensions/mathematics/MathematicsExtension'
import { cn } from '@/utils/cn'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import {
    Nunito,
    EB_Garamond,
    Expletus_Sans,
    Dancing_Script,
    Caveat,
    Special_Elite,
    Bungee_Shade,
    Rye,
    Poppins,
} from 'next/font/google'

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700'] })
const ebGaramond = EB_Garamond({ subsets: ['latin'], weight: ['400', '700'] })
const expletusSans = Expletus_Sans({
    subsets: ['latin'],
    weight: ['400', '700'],
})
const dancingScript = Dancing_Script({
    subsets: ['latin'],
    weight: ['400', '700'],
})
const caveat = Caveat({ subsets: ['latin'], weight: ['400', '700'] })
const specialElite = Special_Elite({ subsets: ['latin'], weight: ['400'] })
const bungeeShade = Bungee_Shade({ subsets: ['latin'], weight: ['400'] })
const rye = Rye({ subsets: ['latin'], weight: ['400'] })

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '700'],
    style: 'normal',
})

export interface SingleContentProps {
    body: string
    author: AuthorType
    likeCount: number
    isLiked: boolean
    commentCount: number
    id: string
    json: JSON
    license: string | null
    currentUserID: string
    font: string
}

const SingleContent: FC<SingleContentProps> = ({
    body,
    author,
    likeCount,
    isLiked,
    json,
    commentCount,
    license,
    currentUserID,
    id,
    font,
}) => {
    const endedAnchorRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const progressRef = useRef<HTMLButtonElement>(null)
    //
    const [isShowScrollToTop, setIsShowScrollToTop] = useState<boolean>(false)
    //

    const endedAnchorEntry = useIntersectionObserver(endedAnchorRef, {
        threshold: 0,
        root: null,
        rootMargin: '0%',
        freezeOnceVisible: false,
    })

    let myFont

    switch (font) {
        case 'rounded':
            myFont = nunito
            break
        case 'traditional':
            myFont = ebGaramond
            break
        case 'modern':
            myFont = expletusSans
            break
        case 'cursive':
            myFont = dancingScript
            break
        case 'handwritten':
            myFont = caveat
            break
        case 'typewriter':
            myFont = specialElite
            break
        case 'retro':
            myFont = bungeeShade
            break
        case 'wild west':
            myFont = rye
            break
        default:
            myFont = poppins
    }

    const output = useMemo(() => {
        return generateHTML(json, [
            StarterKit.configure({
                heading: false, // Disable the default heading from StarterKit
            }),
            Document,
            CustomHeading,
            Paragraph,
            Text,
            CodeBlockLowlight,
            Bold,
            Highlight,
            Underline,
            Link,
            Placeholder,
            TextAlign,
            Twitter,
            Youtube,
            SoundCloud,
            Image,
            ImageHypermedia,
            Subscript,
            Superscript,
            Table,
            TableCell,
            TableHeader,
            TableRow,
            Mathematics.configure({
                HTMLAttributes: {
                    class: cn(
                        'text-foreground rounded p-1 hover:bg-accent cursor-pointer'
                    ),
                },
                katexOptions: {
                    throwOnError: false,
                },
            }),
        ])
    }, [json])

    useEffect(() => {
        const handleProgressIndicator = () => {
            const entryContent = contentRef.current
            const progressBarContent = progressRef.current

            if (!entryContent || !progressBarContent) {
                return
            }

            const totalEntryH =
                entryContent.offsetTop + entryContent.offsetHeight
            const winScroll = window.scrollY
            const scrolled = (winScroll / totalEntryH) * 100

            progressBarContent.innerText = scrolled.toFixed(0) + '%'

            if (scrolled >= 100) {
                setIsShowScrollToTop(true)
            } else {
                setIsShowScrollToTop(false)
            }
        }

        const handleProgressIndicatorHeadeEvent = () => {
            window?.requestAnimationFrame(handleProgressIndicator)
        }
        handleProgressIndicator()
        window?.addEventListener('scroll', handleProgressIndicatorHeadeEvent)
        return () => {
            window?.removeEventListener(
                'scroll',
                handleProgressIndicatorHeadeEvent
            )
        }
    }, [])

    const showLikeAndCommentSticky =
        !endedAnchorEntry?.intersectionRatio &&
        (endedAnchorEntry?.boundingClientRect.top || 0) > 0

    return (
        <>
            <div className="relative">
                <div className="SingleContent space-y-10">
                    {/* ENTRY CONTENT */}
                    {json ? (
                        <>
                            <div
                                id="single-entry-content"
                                className={`prose lg:prose-lg !max-w-screen-md mx-auto dark:prose-invert ${myFont.className}`}
                                ref={contentRef}
                                dangerouslySetInnerHTML={{ __html: output }}
                            ></div>
                        </>
                    ) : (
                        <div
                            id="single-entry-content"
                            className={`prose lg:prose-lg !max-w-screen-md mx-auto dark:prose-invert ${myFont.className}`}
                            ref={contentRef}
                        >
                            {parse(body)}
                        </div>
                    )}
                    {/* AUTHOR */}
                    <div className="max-w-screen-md mx-auto border-b border-t border-neutral-100 dark:border-neutral-700"></div>
                    <div
                        className="max-w-screen-md mx-auto"
                        ref={endedAnchorRef}
                    >
                        {license && (
                            <div className="prose -mt-10 pb-6 lg:prose-lg !max-w-screen-md mx-auto dark:prose-invert flex items-center">
                                <ScaleIcon
                                    strokeWidth="1.5"
                                    color="currentColor"
                                />
                                <p className="inline pb-4  text-gray-500 dark:text-neutral-400 text-sm ml-2">
                                    {license
                                        ? license
                                        : 'Creative Commons 4.0 International License'}
                                </p>
                            </div>
                        )}

                        <SingleAuthor author={author} />
                    </div>
                    {/* COMMENT FORM */}
                    <div
                        id="comments"
                        className="scroll-mt-20 max-w-screen-md mx-auto pt-5"
                    >
                        <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                            Comments {`(${commentCount})`}
                        </h3>
                    </div>
                    {/* COMMENTS LIST */}
                    <div className="max-w-screen-md mx-auto">
                        <PostCommentSection
                            currentUserID={currentUserID}
                            id={id}
                        />
                    </div>
                    <div></div>
                </div>
                <div
                    className={`sticky mt-8 bottom-14 gap-2 md:bottom-8 z-40 justify-center ${
                        showLikeAndCommentSticky ? 'flex' : 'hidden'
                    }`}
                >
                    <div className="flex items-center justify-center gap-1 rounded-full bg-white p-1.5 text-xs shadow-lg dark:ring-1 dark:ring-neutral-600 sm:gap-2 dark:bg-neutral-800">
                        <PostCardLikeAction
                            className="px-3 h-9 text-xs bg-white"
                            likeCount={likeCount}
                            postId={id}
                        />
                        <div className="h-4 border-s border-neutral-200 dark:border-neutral-700"></div>
                        <PostCardCommentBtn
                            isATagOnSingle
                            className={` flex px-3 h-9 text-xs bg-white`}
                            commentCount={commentCount}
                        />
                        <div className="h-4 border-s border-neutral-200 dark:border-neutral-700"></div>
                        <BookmarkBtn postId={id} />
                        <div className="h-4 border-s border-neutral-200 dark:border-neutral-700"></div>

                        <button
                            className={`h-9 w-9 items-center justify-center rounded-full bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 ${
                                isShowScrollToTop ? 'flex' : 'hidden'
                            }`}
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            title="Go to top"
                        >
                            <ArrowUpIcon className="h-4 w-4" />
                        </button>

                        <button
                            ref={progressRef as any}
                            className={`h-9 w-9 items-center justify-center ${
                                isShowScrollToTop ? 'hidden' : 'flex'
                            }`}
                            title="Go to top"
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                        >
                            %
                        </button>
                    </div>
                    <TableContentAnchor
                        className="flex items-center justify-center gap-2 rounded-full bg-white p-1.5 text-xs shadow-lg dark:ring-1 dark:ring-neutral-600 dark:bg-neutral-800"
                        content={json}
                        id={id}
                    />
                </div>
            </div>
        </>
    )
}

export default SingleContent
