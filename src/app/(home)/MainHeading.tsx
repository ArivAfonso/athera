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
            className={`nc-Section-Heading relative flex flex-col sm:flex-row sm:items-end justify-between ${className}`}
        >
            <div
                className={
                    isCenter
                        ? 'text-center w-full max-w-2xl mx-auto '
                        : 'max-w-2xl'
                }
            >
                <h2
                    className={`text-6xl md:text-7xl lg:text-8xl font-bold leading-tight md:leading-tight lg:leading-tight`}
                    {...args}
                >
                    {words?.map((word, index) => (
                        <React.Fragment key={index}>
                            {word.toLowerCase() ===
                                highlightWord.toLowerCase() && (
                                <React.Fragment>
                                    <br />
                                    <span className="text-blue-500 bg-blue-100 dark:bg-blue-950 p-1 rounded-md">
                                        {word}
                                    </span>
                                </React.Fragment>
                            )}
                            {word.toLowerCase() !==
                                highlightWord.toLowerCase() && (
                                <span>{word}</span>
                            )}
                            {index < words.length - 1 && ' '}
                        </React.Fragment>
                    ))}
                    <span>
                        <Typing
                            speed={50}
                            eraseSpeed={70}
                            eraseDelay={500}
                            cursorClassName="font-light text-blue-500"
                            className="text-blue-500"
                            text={['Music', 'Technology', 'AI', 'the World']}
                        />
                    </span>
                </h2>
                {desc && (
                    <span className="mt-2 md:mt-3 font-normal block text-base sm:text-xl text-neutral-500 dark:text-neutral-400">
                        {desc}
                    </span>
                )}
            </div>
        </div>
    )
}

export default MainHeading
