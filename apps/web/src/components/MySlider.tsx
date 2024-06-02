import React, { FC, ReactNode, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import { useSwipeable } from 'react-swipeable'
import { variants } from '@/utils/animationVariants'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import PrevBtn from '@/components/NextPrev/PrevBtn'
import NextBtn from '@/components/NextPrev/NextBtn'

export interface MySliderProps<T> {
    className?: string
    itemPerRow?: number
    data: T[]
    renderItem?: (item: T, indx: number) => ReactNode
    arrowBtnClass?: string
    shiftCount?: number
}

export default function MySlider<T>({
    className = '',
    itemPerRow = 5,
    data,
    renderItem = () => <div></div>,
    arrowBtnClass = 'top-1/2 -translate-y-1/2',
    shiftCount = 1,
}: MySliderProps<T>) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)
    const [numberOfItems, setNumberOfitem] = useState(0)

    const windowWidth = useWindowSize().width
    useEffect(() => {
        if (windowWidth < 320) {
            return setNumberOfitem(1)
        }
        if (windowWidth < 500) {
            return setNumberOfitem(itemPerRow - 3)
        }
        if (windowWidth < 1024) {
            return setNumberOfitem(itemPerRow - 2)
        }
        if (windowWidth < 1280) {
            return setNumberOfitem(itemPerRow - 1)
        }

        setNumberOfitem(itemPerRow)
    }, [itemPerRow, windowWidth])

    function changeItemId(newVal: number) {
        if (newVal > currentIndex) {
            setDirection(1)
        } else {
            setDirection(-1)
        }
        // Check if newVal would exceed the length of the data array
        if (newVal > data.length - numberOfItems) {
            // If it would, set the new index to the last possible index
            setCurrentIndex(data.length - numberOfItems)
        } else {
            setCurrentIndex(newVal)
        }
    }

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (currentIndex < data?.length - shiftCount) {
                changeItemId(currentIndex + shiftCount)
            }
        },
        onSwipedRight: () => {
            if (currentIndex >= shiftCount) {
                changeItemId(currentIndex - shiftCount)
            }
        },
        trackMouse: true,
    })

    if (!numberOfItems) {
        return <div></div>
    }

    return (
        <div className={`MySlider ${className}`}>
            <MotionConfig
                transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                }}
            >
                <div className={`relative flow-root`} {...handlers}>
                    <div className={`flow-root overflow-hidden rounded-xl`}>
                        <motion.ul
                            initial={false}
                            className="relative whitespace-nowrap -mx-2 xl:-mx-4 "
                        >
                            <AnimatePresence initial={false} custom={direction}>
                                {data.map((item, indx) => (
                                    <motion.li
                                        className={`relative inline-block px-2 xl:px-4 whitespace-normal`}
                                        custom={direction}
                                        initial={{
                                            x: `${(currentIndex - 1) * -100}%`,
                                        }}
                                        animate={{
                                            x: `${currentIndex * -100}%`,
                                        }}
                                        variants={variants(200, 1)}
                                        key={indx}
                                        style={{
                                            width: `calc(1/${numberOfItems} * 100%)`,
                                        }}
                                    >
                                        {renderItem(item, indx)}
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </motion.ul>
                    </div>

                    {currentIndex >= shiftCount ? (
                        <PrevBtn
                            onClick={() =>
                                changeItemId(
                                    Math.max(currentIndex - shiftCount, 0)
                                )
                            }
                            className={`w-9 h-9 xl:w-12 xl:h-12 text-lg absolute -left-3 xl:-left-6 z-[1] ${arrowBtnClass}`}
                        />
                    ) : null}

                    {data.length > currentIndex + numberOfItems ? (
                        <NextBtn
                            onClick={() =>
                                changeItemId(
                                    Math.min(
                                        currentIndex + shiftCount,
                                        data.length - numberOfItems
                                    )
                                )
                            }
                            className={`w-9 h-9 xl:w-12 xl:h-12 text-lg absolute -right-3 xl:-right-6 z-[1] ${arrowBtnClass}`}
                        />
                    ) : null}
                </div>
            </MotionConfig>
        </div>
    )
}
