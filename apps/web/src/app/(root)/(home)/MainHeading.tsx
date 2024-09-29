'use client'

import { HeroHighlight, Highlight } from '@/animations/Highlight'
import React, { HTMLAttributes, ReactNode } from 'react'
import Typing from 'react-typing-effect'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    fontClass?: string
    desc?: ReactNode
    isCenter?: boolean
}

const MainHeading: React.FC<HeadingProps> = ({
    children,
    desc = 'Get the latest news from the world of technology',
    className = 'mb-10 md:mb-12 text-neutral-900 dark:text-neutral-50',
    isCenter = false,
    ...args
}) => {
    const words = children?.toString().split(' ')

    const highlightWord = 'happening'

    return (
        <div
            className={`Section-Heading relative flex flex-col sm:flex-row sm:items-end justify-between ${className}`}
        >
            <div
                className={
                    isCenter
                        ? 'text-center w-full max-w-2xl mx-auto '
                        : 'max-w-2xl'
                }
            >
                <HeroHighlight>
                    <h2
                        className={`text-5xl md:text-6xl lg:text-8xl leading-snug md:leading-tight lg:leading-tight`}
                        {...args}
                    >
                        {words?.map((word, index) => (
                            <React.Fragment key={index}>
                                {word.toLowerCase() ===
                                    highlightWord.toLowerCase() && (
                                    <React.Fragment>
                                        <br />
                                        {/* <span className=" font-bold bg-blue-100 dark:bg-blue-950 p-1 rounded-md"> */}
                                        <Highlight className="text-blue-500">
                                            {word.trim()}
                                        </Highlight>
                                        {/* </span> */}
                                    </React.Fragment>
                                )}
                                {word.toLowerCase() !==
                                    highlightWord.toLowerCase() && (
                                    <span className="font-bold">{word}</span>
                                )}
                                {index < words.length - 1 && ' '}
                            </React.Fragment>
                        ))}
                        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
                        <link
                            href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap"
                            rel="stylesheet"
                        ></link>
                        <div className="sm:hidden">
                            <Typing
                                speed={40}
                                eraseSpeed={70}
                                eraseDelay={600}
                                cursorClassName="text-blue-500 dark:text-blue-300"
                                className="dark:text-blue-300 text-6xl md:text-7xl lg:text-8xl font-light font-mono lg:mt-0 md:mt-0 xl:mt-0 sm:mt-[-16px] text-blue-500"
                                text={[
                                    'Music',
                                    'Tech',
                                    'Finance',
                                    'Space',
                                    'Football',
                                    'History',
                                    'Business',
                                ]}
                            />
                        </div>
                        <div className="hidden sm:block">
                            <Typing
                                speed={40}
                                eraseSpeed={70}
                                eraseDelay={600}
                                cursorClassName="text-blue-500 dark:text-blue-300"
                                className="dark:text-blue-300 text-6xl md:text-7xl lg:text-8xl font-light font-mono lg:mt-0 md:mt-0 xl:mt-0 sm:mt-[-16px] text-blue-500"
                                text={[
                                    'Music',
                                    'Technology',
                                    'Finance',
                                    'Space',
                                    'Football',
                                    'History',
                                    'Business',
                                    'the World',
                                ]}
                            />
                        </div>
                    </h2>
                </HeroHighlight>
                {desc && (
                    <span className="mt-2 md:mt-3 font-normal block text-base sm:text-xl text-neutral-500 dark:text-neutral-400">
                        <b>A </b> <b>T</b>rue <b>H</b>ome for <b>E</b>xtremely{' '}
                        <b>R</b>evolting <b>A</b>rticles
                    </span>
                )}
            </div>
        </div>
    )
}

export default MainHeading
