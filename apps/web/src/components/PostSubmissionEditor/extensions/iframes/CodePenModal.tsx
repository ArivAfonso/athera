import { Input, Label, ButtonPrimary, Modal, ButtonSecondary } from 'ui'
import React, { FC, useRef } from 'react'

interface Props {
    show: boolean
    onCloseModal: () => void
    onSubmit: (value: string) => void
}

const CodePenModal: FC<Props> = ({ show, onCloseModal, onSubmit }) => {
    const [codePenUrl, setCodePenUrl] = React.useState('')
    const [error, setError] = React.useState('')
    const initialFocusRef = useRef(null)

    const handleClickSubmitForm = (e: any) => {
        e.preventDefault()
        const codePenUrlPattern =
            /^(https:\/\/codepen\.io\/[a-zA-Z0-9-]+\/pen\/[a-zA-Z0-9]+)$/
        if (!codePenUrlPattern.test(codePenUrl)) {
            setError('Please enter a valid CodePen URL.')
            return
        }
        const embedUrl = `${codePenUrl}/embed`
        onSubmit(embedUrl)
        onCloseModal()
    }

    const renderContent = () => {
        return (
            <form action="/#" onSubmit={handleClickSubmitForm}>
                <Label>Type the URL of the CodePen you want to embed</Label>
                <Input
                    required
                    className="mt-1"
                    type={'text'}
                    onChange={(e) => {
                        setCodePenUrl(e.currentTarget.value)
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
            modalTitle="CodePen Embed URL"
            initialFocusRef={initialFocusRef}
        />
    )
}

export default CodePenModal
