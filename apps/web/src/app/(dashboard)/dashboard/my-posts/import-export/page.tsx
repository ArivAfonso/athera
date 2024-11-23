'use client'

import React, { useState } from 'react'
import mediumImg from '@/images/Medium.png'
import hashnodeImg from '@/images/Hashnode.png'
import devImg from '@/images/Dev.png'
import wordpressImg from '@/images/Wordpress.png'
import { ButtonPrimary, ButtonSecondary, Img } from 'ui'
import DevModal from '@/components/ImportModals/DevModal'
import WordPressModal from '@/components/ImportModals/WordPressModal'
import HashnodeModal from '@/components/ImportModals/HashnodeModal'
import MediumModal from '@/components/ImportModals/MediumModal'

const plans = [
    {
        name: 'Medium',
        img: mediumImg,
    },
    {
        name: 'Dev.to',
        img: devImg,
    },
    {
        name: 'Wordpress',
        img: wordpressImg,
    },
    {
        name: 'Hashnode',
        img: hashnodeImg,
    },
]
const PageConnectWallet = ({}) => {
    const [showModal, setShowModal] = useState('')

    const renderContent = () => {
        return (
            <form action="#">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
                    Scan to connect
                </h3>
                <span className="text-sm">
                    Open Coinbase Wallet on your mobile phone and scan
                </span>

                <div className="p-5 border bg-white dark:bg-neutral-300 border-neutral-200 dark:border-neutral-700 rounded-xl flex items-center justify-center mt-4">
                    {/* <Img className="w-40" alt="" src={QrCodeImg} /> */}
                </div>

                <div className="mt-5 space-x-3">
                    <ButtonPrimary type="submit">Install app</ButtonPrimary>
                    <ButtonSecondary type="button">Cancel</ButtonSecondary>
                </div>
            </form>
        )
    }

    return (
        <div className={`PageConnectWallet`}>
            <title>Import/Export - Athera</title>
            <div className="container">
                <div className="my-12 sm:lg:my-16 lg:my-24 max-w-3xl mx-auto space-y-8 sm:space-y-10">
                    {/* HEADING */}
                    <div className="max-w-2xl">
                        <h2 className="text-3xl sm:text-4xl font-semibold">
                            Import your Content
                        </h2>
                        <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                            Connect with one of our available providers to
                            import your content.
                        </span>
                    </div>

                    <hr className="w-full border-t-2 border-neutral-100 dark:border-neutral-700" />

                    <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
                        <div className="space-y-3">
                            {plans.map((plan) => (
                                <div
                                    key={plan.name}
                                    onClick={() => setShowModal(plan.name)}
                                    typeof="button"
                                    tabIndex={0}
                                    className="relative rounded-xl hover:shadow-lg border 
                border-neutral-200 dark:border-neutral-700 px-3 sm:px-5 py-4 cursor-pointer flex 
                focus:outline-none focus:shadow-outline-blue focus:border-blue-500 dark:bg-neutral-800 
                dark:text-neutral-100 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
                                >
                                    <div className="flex items-center w-full">
                                        <Img
                                            src={plan.img}
                                            alt=""
                                            containerClassName="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl overflow-hidden"
                                        />
                                        <div
                                            className={`ml-4 sm:ml-8 font-semibold text-xl sm:text-2xl `}
                                        >
                                            {plan.name}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <DevModal
                show={showModal == 'Dev.to'}
                onCloseModal={() => setShowModal('')}
            />
            <WordPressModal
                show={showModal == 'Wordpress'}
                onCloseModal={() => setShowModal('')}
            />
            <HashnodeModal
                show={showModal == 'Hashnode'}
                onCloseModal={() => setShowModal('')}
            />
            <MediumModal
                show={showModal == 'Medium'}
                onCloseModal={() => setShowModal('')}
            />
        </div>
    )
}

export default PageConnectWallet
