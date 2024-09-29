'use client'
import React, { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Button from '../Button/Button'
import ButtonClose from '../ButtonClose/ButtonClose'

export interface ModalProps {
    renderContent: (closeModal: () => void) => ReactNode
    renderFooter?: (closeModal: () => void) => ReactNode
    renderTrigger?: (openModal: () => void) => ReactNode
    enableFooter?: boolean
    containerClassName?: string
    contentExtraClass?: string
    contentPaddingClass?: string
    triggerText?: ReactNode
    modalTitle?: ReactNode
    isOpenProp?: boolean
    onCloseModal?: () => void
    leaveAnimationClass?: string
    initialFocusRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement>
}

const Modal: FC<ModalProps> = ({
    renderTrigger,
    renderContent,
    renderFooter,
    enableFooter = true,
    containerClassName = '',
    contentExtraClass = 'max-w-screen-xl',
    contentPaddingClass = 'p-4 md:px-6 md:py-5',
    triggerText = 'Open Modal',
    modalTitle = 'Modal title',
    isOpenProp,
    onCloseModal,
    leaveAnimationClass = 'ease-in duration-75',
    initialFocusRef,
}) => {
    let [isOpen, setIsOpen] = useState(!!isOpenProp)

    function closeModal() {
        if (typeof isOpenProp !== 'boolean') {
            setIsOpen(false)
        }
        onCloseModal && onCloseModal()
    }

    function openModal() {
        if (typeof isOpenProp !== 'boolean') {
            setIsOpen(true)
        }
    }

    useEffect(() => {
        setIsOpen(!!isOpenProp)
    }, [isOpenProp])

    return (
        <div className={`Modal ${containerClassName}`}>
            {renderTrigger ? (
                renderTrigger(openModal)
            ) : (
                <Button onClick={openModal}> {triggerText} </Button>
            )}

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-50"
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-1 text-center md:px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-75"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-75"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-neutral-900 bg-opacity-50 dark:bg-opacity-80" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-75"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave={leaveAnimationClass}
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div
                                className={`inline-flex flex-col w-full overflow-hidden text-left align-middle transition-all transform bg-white border border-black border-opacity-5 shadow-xl rounded-2xl dark:bg-neutral-800 dark:border-neutral-700 text-neutral-900 dark:text-neutral-300 ${contentExtraClass} max-h-[85vh]`}
                            >
                                <header className="flex-shrink-0 py-4 px-6 text-center relative border-b border-neutral-100 dark:border-neutral-700 md:py-5">
                                    <ButtonClose
                                        onClick={closeModal}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 sm:left-4"
                                    />
                                    {modalTitle && (
                                        <Dialog.Title
                                            as="h3"
                                            className="text-base font-semibold text-neutral-900 lg:text-xl dark:text-neutral-200 mx-10"
                                        >
                                            {modalTitle}
                                        </Dialog.Title>
                                    )}
                                </header>
                                <div
                                    className={`flex-1 overflow-y-auto ${contentPaddingClass}`}
                                >
                                    {renderContent(closeModal)}
                                </div>

                                {renderFooter && enableFooter && (
                                    <footer className="flex-shrink-0">
                                        <div className="py-4 px-6 border-t border-neutral-100 dark:border-neutral-700 md:py-5">
                                            {renderFooter(closeModal)}
                                        </div>
                                    </footer>
                                )}
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default Modal
