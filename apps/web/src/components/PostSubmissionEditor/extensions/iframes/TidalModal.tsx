import { Input, Label, ButtonPrimary, Modal, ButtonSecondary } from 'ui'
import React, { FC, useRef, useState } from 'react'

interface Props {
    show: boolean
    onCloseModal: () => void
    onSubmit: (value: string) => void
}

const TidalModal: FC<Props> = ({ show, onCloseModal, onSubmit }) => {
    const [tidalUrl, setTidalUrl] = useState('')
    const [error, setError] = useState('')
    const initialFocusRef = useRef(null)

    const handleClickSubmitForm = (e: any) => {
        e.preventDefault()
        const tidalUrlPattern =
            /^(https:\/\/tidal\.com\/browse\/(track|album|playlist)\/[a-zA-Z0-9]+)$/
        if (!tidalUrlPattern.test(tidalUrl)) {
            setError('Please enter a valid Tidal URL.')
            return
        }
        const embedUrl = tidalUrl.replace(
            'https://tidal.com/browse/',
            'https://embed.tidal.com/'
        )
        onSubmit(embedUrl)
        onCloseModal()
    }

    const renderContent = () => {
        return (
            <form action="/#" onSubmit={handleClickSubmitForm}>
                <Label>
                    Type the URL of the Tidal iframe you want to embed
                </Label>
                <Input
                    required
                    className="mt-1"
                    type={'text'}
                    onChange={(e) => {
                        setTidalUrl(e.currentTarget.value)
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
            modalTitle="Tidal Iframe URL"
            initialFocusRef={initialFocusRef}
        />
    )
}

export default TidalModal
