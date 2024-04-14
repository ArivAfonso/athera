'use client'

import React, { FC } from 'react'
import { TaxonomyType } from '@/data/types'
import CardTopic1 from '@/components/CardTopic1/CardTopic1'
import NcModal from '@/components/NcModal/NcModal'
import Button from '@/components/Button/Button'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import TopicType from '@/types/TopicType'

export interface ModalTopicsProps {
    topics: TopicType[]
}

const ModalTopics: FC<ModalTopicsProps> = ({ topics }) => {
    const renderModalContent = () => {
        return (
            <div className="grid gap-6 sm:grid-cols-2 sm:py-2 md:gap-8 md:grid-cols-3 lg:grid-cols-4 xl:md:grid-cols-5">
                {topics.map((cat, key) => (
                    <CardTopic1 key={key} topic={cat} size="normal" />
                ))}
            </div>
        )
    }

    return (
        <div className="nc-ModalTopics">
            <NcModal
                renderTrigger={(openModal) => (
                    <Button
                        pattern="third"
                        fontSize="text-sm font-medium"
                        onClick={openModal}
                    >
                        <div>
                            <span className="hidden sm:inline">Other</span>{' '}
                            Topics
                        </div>
                        <ChevronDownIcon
                            className="w-4 h-4 ml-2 -mr-1"
                            aria-hidden="true"
                        />
                    </Button>
                )}
                modalTitle="Discover other topics"
                renderContent={renderModalContent}
            />
        </div>
    )
}

export default ModalTopics
