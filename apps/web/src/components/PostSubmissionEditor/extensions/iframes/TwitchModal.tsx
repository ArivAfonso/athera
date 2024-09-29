import { Input, Label, ButtonPrimary, Modal, ButtonSecondary } from 'ui'
import React, { FC, useRef } from 'react'

interface Props {
    show: boolean
    onCloseModal: () => void
    onSubmit: (value: string) => void
}

const TwitchModal: FC<Props> = ({ show, onCloseModal, onSubmit }) => {
    const [twitchUrl, setTwitchUrl] = React.useState('')
    const [error, setError] = React.useState('')
    const initialFocusRef = useRef(null)

    const handleClickSubmitForm = (e: any) => {
        e.preventDefault()
        const twitchUrlPattern =
            /^(https:\/\/www\.twitch\.tv\/(videos\/\d+|[a-zA-Z0-9_]+))$/
        if (!twitchUrlPattern.test(twitchUrl)) {
            setError('Please enter a valid Twitch URL.')
            return
        }
        let embedUrl = ''
        if (twitchUrl.includes('videos')) {
            const videoId = twitchUrl.split('/').pop() || ''
            embedUrl = `https://player.twitch.tv/?video=${encodeURIComponent(videoId)}&autoplay=false&parent=athera.blog&parent=localhost`
        } else {
            const channelName = twitchUrl.split('/').pop() || ''
            embedUrl = `https://player.twitch.tv/?channel=${encodeURIComponent(channelName)}&parent=athera.blog&parent=localhost`
        }
        onSubmit(embedUrl)
        onCloseModal()
    }

    const renderContent = () => {
        return (
            <form action="/#" onSubmit={handleClickSubmitForm}>
                <Label>
                    Type the URL of the Twitch channel or video you want to
                    embed
                </Label>
                <Input
                    required
                    className="mt-1"
                    type={'text'}
                    onChange={(e) => {
                        setTwitchUrl(e.currentTarget.value)
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
            modalTitle="Twitch Iframe URL"
            initialFocusRef={initialFocusRef}
        />
    )
}

export default TwitchModal
