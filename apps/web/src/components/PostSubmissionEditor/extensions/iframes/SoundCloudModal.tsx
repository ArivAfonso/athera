import { Input, Label, ButtonPrimary, Modal, ButtonSecondary } from 'ui'
import React, { FC, useRef } from 'react'

interface Props {
    show: boolean
    onCloseModal: () => void
    onSubmit: (value: string) => void
}

const SoundCloudModal: FC<Props> = ({ show, onCloseModal, onSubmit }) => {
    const [soundCloudUrl, setSoundCloudUrl] = React.useState('')
    const [error, setError] = React.useState('')
    const initialFocusRef = useRef(null)

    const handleClickSubmitForm = (e: any) => {
        e.preventDefault()
        const soundCloudUrlPattern =
            /^(https:\/\/soundcloud\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+(\/[a-zA-Z0-9-]+)*)$/
        if (!soundCloudUrlPattern.test(soundCloudUrl)) {
            setError('Please enter a valid SoundCloud URL.')
            return
        }
        const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(soundCloudUrl)}`
        onSubmit(embedUrl)
        onCloseModal()
    }

    const renderContent = () => {
        return (
            <form action="/#" onSubmit={handleClickSubmitForm}>
                <Label>
                    Type the URL of the SoundCloud track you want to embed
                </Label>
                <Input
                    required
                    className="mt-1"
                    type={'text'}
                    onChange={(e) => {
                        setSoundCloudUrl(e.currentTarget.value)
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
            modalTitle="SoundCloud Iframe URL"
            initialFocusRef={initialFocusRef}
        />
    )
}

export default SoundCloudModal
