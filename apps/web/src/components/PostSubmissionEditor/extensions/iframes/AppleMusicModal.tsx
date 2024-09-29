import { Input, Label, ButtonPrimary, Modal, ButtonSecondary } from 'ui'
import React, { FC, useRef } from 'react'

interface Props {
    show: boolean
    onCloseModal: () => void
    onSubmit: (value: string) => void
}

const AppleMusicModal: FC<Props> = ({ show, onCloseModal, onSubmit }) => {
    const [appleMusicUrl, setAppleMusicUrl] = React.useState('')
    const [error, setError] = React.useState('')
    const initialFocusRef = useRef(null)

    const handleClickSubmitForm = (e: any) => {
        e.preventDefault()
        const appleMusicUrlPattern =
            /^(https:\/\/music\.apple\.com\/[a-zA-Z0-9-\/]+)$/
        if (!appleMusicUrlPattern.test(appleMusicUrl)) {
            setError('Please enter a valid Apple Music URL.')
            return
        }
        const embedUrl = `https://embed.music.apple.com${new URL(appleMusicUrl).pathname}`
        onSubmit(embedUrl)
        onCloseModal()
    }

    const renderContent = () => {
        return (
            <form action="/#" onSubmit={handleClickSubmitForm}>
                <Label>
                    Type the URL of the Apple Music track you want to embed
                </Label>
                <Input
                    required
                    className="mt-1"
                    type={'text'}
                    onChange={(e) => {
                        setAppleMusicUrl(e.currentTarget.value)
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
            modalTitle="Apple Music Iframe URL"
            initialFocusRef={initialFocusRef}
        />
    )
}

export default AppleMusicModal
