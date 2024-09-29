import React, { FC, useState } from 'react'
import { SOCIALS_DATA, TSocialShareItem } from '../SocialsShare/SocialsShare'
import { useRouter } from 'next/navigation'
import { DropDown, DropDownItem } from 'ui'

export interface Props {
    className?: string
    bgClass?: string
    sizeClass?: string
    itemClass?: string
    href?: string
}

type TDropDownShareItem = TSocialShareItem | 'copylink'

const initActions: DropDownItem<TDropDownShareItem>[] = [
    {
        id: 'copylink',
        name: 'Copy link',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
<path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
</svg>`,
    },
    //@ts-ignore
    ...SOCIALS_DATA,
]

const SocialsShareDropdown: FC<Props> = ({
    className = ' ',
    sizeClass = 'h-9 w-9',
    bgClass = 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700',
    itemClass,
    href = '',
}) => {
    // get current link to share
    const [currentLink, setCurrentLink] = useState(href || '')
    const router = useRouter()

    // update current link to share
    React.useEffect(() => {
        setCurrentLink(window.location.href)
    }, [router])

    const link = currentLink || ''

    const handleClick = (item: DropDownItem<TDropDownShareItem>) => {
        if (item.id === 'copylink') {
            navigator.clipboard.writeText(link)
            return
        }
    }

    const actions = initActions.map((item) => {
        if (item.id === 'Facebook') {
            item.href = `https://www.facebook.com/sharer/sharer.php?u=${link}`
        } else if (item.id === 'Twitter') {
            item.href = `https://twitter.com/intent/tweet?url=${link}`
        } else if (item.id === 'Linkedin') {
            item.href = `https://www.linkedin.com/shareArticle?mini=true&url=${link}`
        } else if (item.id === 'WhatsApp') {
            item.href = `https://api.whatsapp.com/send?text=${link}`
        }

        return item
    })

    return (
        <div className={`SocialsShare flex-shrink-0 ${className}`}>
            <DropDown
                className={`flex-shrink-0 flex items-center justify-center focus:outline-none text-neutral-700 dark:text-neutral-200 rounded-full ${sizeClass} ${bgClass}`}
                renderTrigger={() => (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                )}
                onClick={handleClick}
                data={actions}
                dropdownItemsClass={itemClass}
            />
        </div>
    )
}

export default SocialsShareDropdown
