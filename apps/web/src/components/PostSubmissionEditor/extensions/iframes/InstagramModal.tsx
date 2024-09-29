import { Input, Label, ButtonPrimary, Modal, ButtonSecondary } from 'ui'
import React, { FC, useRef } from 'react'

interface Props {
    show: boolean
    onCloseModal: () => void
    onSubmit: (value: string) => void
}

const InstagramModal: FC<Props> = ({ show, onCloseModal, onSubmit }) => {
    const [instagramUrl, setInstagramUrl] = React.useState('')
    const [error, setError] = React.useState('')
    const initialFocusRef = useRef(null)

    const handleClickSubmitForm = (e: any) => {
        e.preventDefault()
        const instagramUrlPattern =
            /^(https:\/\/www\.instagram\.com\/p\/[a-zA-Z0-9_-]+\/)$/
        if (!instagramUrlPattern.test(instagramUrl)) {
            setError('Please enter a valid Instagram URL.')
            return
        }
        const embedUrl = `${instagramUrl}embed`
        onSubmit(embedUrl)
        onCloseModal()
    }

    const renderContent = () => {
        return (
            <form action="/#" onSubmit={handleClickSubmitForm}>
                <Label>
                    Type the URL of the Instagram post you want to embed
                </Label>
                <Input
                    required
                    className="mt-1"
                    type={'text'}
                    onChange={(e) => {
                        setInstagramUrl(e.currentTarget.value)
                        setError('')
                    }}
                    ref={initialFocusRef}
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <div className="mt-4 space-x-3">
                    <ButtonPrimary type="submit">Apply</ButtonPrimary>
                    <ButtonSecondary type="button" onClick={onCloseModal}>
                        Cancel
                    </ButtonSecondary>
                </div>
            </form>
        )
    }

    return (
        <Modal
            renderTrigger={() => null}
            isOpenProp={show}
            renderContent={renderContent}
            onCloseModal={onCloseModal}
            contentExtraClass="max-w-screen-sm"
            modalTitle="Instagram Iframe URL"
            initialFocusRef={initialFocusRef}
        />
    )
}

export default InstagramModal
