import React, { FC } from 'react'
import { DropDownItem } from 'ui'

export interface SocialsShareProps {
    className?: string
    itemClass?: string
    link: string
}

export type TSocialShareItem = 'Facebook' | 'Twitter' | 'Linkedin' | 'WhatsApp'

interface SocialShareType extends DropDownItem<TSocialShareItem> {}

export const SOCIALS_DATA: SocialShareType[] = [
    {
        id: 'Facebook',
        name: 'Facebook',
        icon: `<svg class="w-5 h-5" fill="currentColor" height="1em" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>
  `,
        href: '#',
        isTargetBlank: true,
    },
    {
        id: 'Twitter',
        name: 'Twitter',
        icon: `<svg class="w-5 h-5" fill="currentColor" height="1em" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
  `,
        href: '#',
        isTargetBlank: true,
    },
    {
        id: 'Linkedin',
        name: 'Linkedin',
        icon: `<svg class="w-5 h-5" fill="currentColor" height="1em" viewBox="0 0 448 512"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>
  `,
        href: '#',
        isTargetBlank: true,
    },
    {
        id: 'WhatsApp',
        name: 'WhatsApp',
        icon: `<svg  viewBox="0 0 23 23" class="w-5 h-5" fill="currentColor" height="1em">
        <path d="M3.50002 12C3.50002 7.30558 7.3056 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C10.3278 20.5 8.77127 20.0182 7.45798 19.1861C7.21357 19.0313 6.91408 18.9899 6.63684 19.0726L3.75769 19.9319L4.84173 17.3953C4.96986 17.0955 4.94379 16.7521 4.77187 16.4751C3.9657 15.176 3.50002 13.6439 3.50002 12ZM12 1.5C6.20103 1.5 1.50002 6.20101 1.50002 12C1.50002 13.8381 1.97316 15.5683 2.80465 17.0727L1.08047 21.107C0.928048 21.4637 0.99561 21.8763 1.25382 22.1657C1.51203 22.4552 1.91432 22.5692 2.28599 22.4582L6.78541 21.1155C8.32245 21.9965 10.1037 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5ZM14.2925 14.1824L12.9783 15.1081C12.3628 14.7575 11.6823 14.2681 10.9997 13.5855C10.2901 12.8759 9.76402 12.1433 9.37612 11.4713L10.2113 10.7624C10.5697 10.4582 10.6678 9.94533 10.447 9.53028L9.38284 7.53028C9.23954 7.26097 8.98116 7.0718 8.68115 7.01654C8.38113 6.96129 8.07231 7.046 7.84247 7.24659L7.52696 7.52195C6.76823 8.18414 6.3195 9.2723 6.69141 10.3741C7.07698 11.5163 7.89983 13.314 9.58552 14.9997C11.3991 16.8133 13.2413 17.5275 14.3186 17.8049C15.1866 18.0283 16.008 17.7288 16.5868 17.2572L17.1783 16.7752C17.4313 16.5691 17.5678 16.2524 17.544 15.9269C17.5201 15.6014 17.3389 15.308 17.0585 15.1409L15.3802 14.1409C15.0412 13.939 14.6152 13.9552 14.2925 14.1824Z"/>
        </svg>
`,
        href: '#',
        isTargetBlank: true,
    },
]

const SocialsShare: FC<SocialsShareProps> = ({
    className = 'grid gap-[6px]',
    itemClass = 'w-7 h-7 text-base hover:bg-neutral-100',
    link = '',
}) => {
    const actions = SOCIALS_DATA.map((item) => {
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

    const renderItem = (item: SocialShareType, index: number) => {
        return (
            <a
                key={index}
                href={item.href}
                className={`rounded-full leading-none flex items-center justify-center text-neutral-600 ${itemClass} `}
                title={`Share on ${item.name}`}
            >
                <div dangerouslySetInnerHTML={{ __html: item.icon }}></div>
            </a>
        )
    }

    return (
        <div className={`SocialsShare ${className}`}>
            {actions.map(renderItem)}
        </div>
    )
}

export default SocialsShare
