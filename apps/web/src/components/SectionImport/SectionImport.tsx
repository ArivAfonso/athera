import React, { FC } from 'react'
import Step1Img from '@/images/Step_1.png'
import Step2Img from '@/images/Step_2.png'
import Step3Img from '@/images/Step_3.png'
import Step4Img from '@/images/Step_4.png'
import DotsImg from '@/images/Dots.svg'
import Image from 'next/image'
import Badge from '../Badge/Badge'
import { Heading, Img } from 'ui'

export interface SectionHowItWorkProps {
    className?: string
    data?: (typeof DEMO_DATA)[0][]
}

const DEMO_DATA = [
    {
        id: 1,
        img: Step1Img,
        title: 'Login',
        desc: 'Go to your dashboard and click Import',
    },
    {
        id: 2,
        img: Step2Img,
        title: 'Search Provider',
        desc: 'Select your desired provider and select your posts',
    },
    {
        id: 3,
        img: Step3Img,
        title: 'Wait',
        desc: 'Wait for the import process to finish',
    },
    {
        id: 4,
        img: Step4Img,
        title: 'Enjoy',
        desc: 'Have fun and continue your journey with us',
    },
]

const SectionImport: FC<SectionHowItWorkProps> = ({
    className = '',
    data = DEMO_DATA,
}) => {
    return (
        <div className={`SectionHowItWork ${className}`}>
            <Heading
                desc="Import content from other services like Medium, Hashnode, Dev.to, WordPress etc."
                isCenter
            >
                Import Your Content
            </Heading>
            <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 xl:gap-20">
                <Image
                    className="hidden md:block absolute inset-x-0 top-5"
                    src={DotsImg}
                    alt="dots"
                />
                {data.map((item: (typeof DEMO_DATA)[number], index: number) => (
                    <div
                        key={item.id}
                        className="relative flex flex-col items-center max-w-xs mx-auto"
                    >
                        <Img
                            containerClassName="mb-4 sm:mb-10 max-w-[140px] mx-auto"
                            className="rounded-3xl"
                            src={item.img}
                            sizes="150px"
                            alt="Steps"
                        />
                        <div className="text-center mt-auto space-y-5">
                            <Badge
                                name={`Step ${index + 1}`}
                                color={
                                    !index
                                        ? 'red'
                                        : index === 1
                                          ? 'indigo'
                                          : index === 2
                                            ? 'green'
                                            : 'purple'
                                }
                            />
                            <h3 className="text-base font-semibold">
                                {item.title}
                            </h3>
                            <span className="block text-slate-600 dark:text-slate-400 text-sm leading-6">
                                {item.desc}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SectionImport
