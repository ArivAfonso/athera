import { Input, Label, ButtonPrimary, Modal, ButtonSecondary } from 'ui'
import React, { FC, useRef } from 'react'

interface Props {
    show: boolean
    onCloseModal: () => void
    onSubmit: (value: string) => void
}

const FacebookModal: FC<Props> = ({ show, onCloseModal, onSubmit }) => {
    const [facebookUrl, setFacebookUrl] = React.useState('')
    const [error, setError] = React.useState('')
    const initialFocusRef = useRef(null)

    const handleClickSubmitForm = (e: any) => {
        e.preventDefault()
        const facebookUrlPattern =
            /^(https:\/\/www\.facebook\.com\/[a-zA-Z0-9.]+\/posts\/[0-9]+)$/
        if (!facebookUrlPattern.test(facebookUrl)) {
            setError('Please enter a valid Facebook URL.')
            return
        }
        const embedUrl = facebookUrl.replace(
            'www.facebook.com',
            'www.facebook.com/plugins/post.php?href=https://www.facebook.com'
        )
        onSubmit(embedUrl)
        onCloseModal()
    }

    const renderContent = () => {
        return (
            <form action="/#" onSubmit={handleClickSubmitForm}>
                <Label>
                    Type the URL of the Facebook post you want to embed
                </Label>
                <Input
                    required
                    className="mt-1"
                    type={'text'}
                    onChange={(e) => {
                        setFacebookUrl(e.currentTarget.value)
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
            modalTitle="Facebook Iframe URL"
            initialFocusRef={initialFocusRef}
        />
    )
}

export default FacebookModal
