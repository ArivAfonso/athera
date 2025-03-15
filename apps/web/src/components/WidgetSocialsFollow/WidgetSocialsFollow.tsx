import { FC } from 'react'
import Heading2 from '../Heading2/Heading2'
import NewsType from '@/types/NewsType'
import { MailIcon } from 'lucide-react'

interface WidgetSocialsFollowProps {
    className?: string
    news: NewsType
}

const socials = [
    {
        name: 'twitter',
        icon: (
            <svg
                className="w-7 h-7"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
            >
                <path
                    d="M3 21L10.5484 13.4516M21 3L13.4516 10.5484M13.4516 10.5484L8 3H3L10.5484 13.4516M13.4516 10.5484L21 21H16L10.5484 13.4516"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        url: 'https://x.com',
        description: 'Share on X',
    },
    {
        name: 'facebook',
        icon: (
            <svg
                className="w-8 h-8"
                viewBox="0 0 192 192"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="12"
                    d="M96 170c40.869 0 74-33.131 74-74 0-40.87-33.131-74-74-74-40.87 0-74 33.13-74 74 0 40.869 33.13 74 74 74Zm0 0v-62m30-48h-10c-11.046 0-20 8.954-20 20v28m0 0H74m22 0h22"
                />
            </svg>
        ),
        url: 'https://www.facebook.com',
        description: 'Share on Facebook',
    },
    {
        name: 'whatsapp',
        icon: (
            <svg
                id="Layer_1"
                version="1.1"
                viewBox="0 0 30 30.2"
                className="w-7 h-7"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <g>
                    <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8" // Increased from original 1.25 for thicker lines
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        d="M8.3,26.7c-0.8-0.5-4.7,2.4-5.3,1.7c-0.6-0.6,2-4.7,1.5-5.4C2.9,20.8,2,18.1,2,15.2C2,7.8,8,1.7,15.5,1.7S29,7.8,29,15.2s-6,13.5-13.5,13.5c-1,0-1.9-0.1-2.8-0.3"
                    />
                    <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8" // Increased from original 1.25 for thicker lines
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        d="M12.7,8.4l1.2,3c0.1,0.2,0,0.4-0.2,0.5c-0.5,0.3-1.2,1-0.4,2.1c1,1.4,3.7,4.9,5.9,2.6c0.1-0.1,0.3-0.2,0.5-0.1l3.2,1.4c0.2,0.1,0.3,0.4,0.2,0.6c-0.7,1.4-3.4,5.1-10.1-0.7c-6.8-5.9-2.4-8.8-0.9-9.5C12.3,8,12.6,8.1,12.7,8.4z"
                    />
                </g>
            </svg>
        ),
        url: 'https://www.whatsapp.com',
        description: 'Share on Whatsapp',
    },
    {
        name: 'linkedin',
        icon: (
            <svg
                id="Layer_1"
                version="1.1"
                viewBox="0 0 37 38"
                className="h-6 w-6"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <path
                    d="M36,38h-7c-0.6,0-1-0.4-1-1V23.2c0-2.4-1.3-3.8-3.6-3.8c-1.6,0-3,1.1-3.4,2.1c-0.1,0.2,0,0.8,0,1.1c0,0.2,0,0.4,0,0.6V37  c0,0.5-0.4,1-1,1h-7c-0.3,0-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.4-0.3-0.7L12,19.6c0-2.4,0-4.5-0.1-6.3c0-0.3,0.1-0.5,0.3-0.7  c0.2-0.2,0.5-0.3,0.7-0.3h6c0.6,0,1,0.4,1,1v0.6c1.5-1.3,3.9-2.5,7.1-2.5c6.2,0,10,4,10,10.8V37C37,37.6,36.6,38,36,38z M30,36h5  V22.2c0-7.7-5-8.8-8-8.8c-3.6,0-6.2,2-7.1,3.4c-0.2,0.3-0.5,0.5-0.9,0.5H19c-0.6,0-1-0.4-1-1v-2h-4c0,1.6,0,3.3,0,5.3l0,1.4L14,36h5  V23.2c0-0.2,0-0.3,0-0.5c0-0.7,0-1.3,0.2-1.9c0.7-1.7,2.7-3.4,5.3-3.4c3.4,0,5.6,2.3,5.6,5.8V36z M8,38H1c-0.6,0-1-0.4-1-1V12  c0-0.6,0.4-1,1-1h7c0.6,0,1,0.4,1,1l0,25c0,0.3-0.1,0.5-0.3,0.7C8.5,37.9,8.3,38,8,38z M2,36h5l0-23H2V36z M4.4,9C1.9,9,0,7.1,0,4.5  C0,1.9,1.9,0,4.5,0C7.1,0,8.9,1.8,9,4.5C9,7.1,7.1,9,4.4,9z M4.5,1.9c-1.6,0-2.7,1-2.7,2.6c0,1.5,1.1,2.6,2.6,2.6  c1.6,0,2.7-1,2.7-2.6C7.1,2.9,6.1,1.9,4.5,1.9z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.4"
                />
            </svg>
        ),
        url: 'https://www.youtube.com',
        description: 'Share on Youtube',
    },
    {
        name: 'pinterest',
        icon: (
            <svg
                className="h-8 w-8"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
            >
                <line
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                    x1="120"
                    x2="88"
                    y1="88"
                    y2="224"
                />
                <path
                    d="M61.5,156.6A80,80,0,1,1,208,112c0,44.2-32,72-64,72s-41.6-21.1-41.6-21.1"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                />
            </svg>
        ),
        url: 'https://www.pinterest.com',
        description: 'Share on Pinterest',
    },
    {
        name: 'reddit',
        icon: (
            <svg
                version="1.1"
                viewBox="0 0 100 100"
                className="w-7 h-7"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <g id="Layer_1" />
                <g id="Layer_2">
                    <g>
                        <path
                            d="M85.696,37.427c-2.622-0.005-5.142,0.854-7.2,2.439c-7.217-4.443-16.491-7.087-26.225-7.458l-1.726-0.018l5.981-18.256    c1.901,0.748,2.876-2.079,0.918-2.631c0,0-1.52-0.359-1.52-0.359c-0.697-0.162-1.411,0.234-1.636,0.918l-6.665,20.342    c-9.749,0.338-19,2.916-26.265,7.333c-7.586-5.78-18.976-0.033-18.858,9.522c0.001,3.825,1.798,7.334,4.852,9.559    c-2.063,41.383,86.681,41.513,84.972,0.252C101.914,52.584,97.295,37.477,85.696,37.427z M90.155,57.152    c-1.352,0.809-0.28,2.801-0.481,4.106c-1.838,35.574-82.427,34.504-79.459-2.873c0.095-0.556-0.158-1.113-0.637-1.41    c-2.695-1.664-4.304-4.549-4.305-7.715c-0.037-7.721,9.323-11.953,15.064-6.789c0.465,0.411,1.147,0.464,1.668,0.13    c14.985-9.938,40.892-9.903,55.853,0.14c0.532,0.347,1.232,0.287,1.698-0.145c5.674-5.347,15.255-1.132,15.2,6.67    C94.77,52.535,93.008,55.556,90.155,57.152z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M63.987,48.407c-4.254,0-7.848,3.591-7.848,7.841c0.392,10.203,15.204,10.306,15.591,0    C71.729,51.925,68.256,48.407,63.987,48.407z M63.987,61.219c-6.784-0.249-6.639-9.751,0-10.04    C70.508,51.391,70.603,61.012,63.987,61.219z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M43.878,56.248c0-4.323-3.473-7.841-7.743-7.841c-10.306,0.511-10.475,15.132,0,15.583    C40.405,63.99,43.878,60.518,43.878,56.248z M31.067,56.248c0.305-6.648,9.742-6.743,10.04,0    C40.899,62.864,31.278,62.767,31.067,56.248z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M62.444,71.911c-2.425,2.422-6.493,3.601-12.434,3.601c-5.943,0-10.007-1.179-12.429-3.601    c-1.619-1.574-4.019,0.805-2.439,2.437c5.335,6.174,24.401,6.172,29.738,0C66.449,72.722,64.078,70.336,62.444,71.911z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M60.855,15.154c0,0,10.751,2.531,10.751,2.531c-1.646,6.188,3.319,12.539,9.729,12.448    c13.308-0.549,13.312-19.518,0-20.069c-3.706,0-6.941,2.024-8.679,5.021L61.49,12.456C59.717,12.064,59.084,14.707,60.855,15.154z     M81.335,12.836c4.005,0,7.263,3.258,7.263,7.263c-0.365,9.622-14.162,9.619-14.525,0C74.072,16.094,77.33,12.836,81.335,12.836z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                </g>
            </svg>
        ),
        url: 'https://www.reddit.com',
        description: 'Share on Reddit',
    },
    {
        name: 'telegram',
        icon: (
            <svg
                version="1.1"
                viewBox="0 0 512 512"
                className="w-7 h-7"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <g id="comp_x5F_335-telegram">
                    <g>
                        <path
                            d="M477.805,102.98l-67.327,317.516c-5.08,22.41-18.326,27.984-37.15,17.431l-102.585-75.596l-49.497,47.607    c-5.477,5.478-10.06,10.061-20.617,10.061l7.37-104.479l190.129-171.805c8.268-7.37-1.792-11.454-12.848-4.083L150.233,287.633    l-101.19-31.672c-22.011-6.873-22.408-22.012,4.581-32.568L449.419,70.911C467.744,64.039,483.779,74.993,477.805,102.98z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit="10"
                        />
                    </g>
                </g>
                <g id="Layer_1" />
            </svg>
        ),
        url: 'https://www.telegram.com',
        description: 'Share on Telegram',
    },
    {
        name: 'email',
        icon: <MailIcon strokeWidth={1.25} className="w-7 h-7" />,
        url: 'https://www.email.com',
        description: 'Share via Email',
    },
]

// Helper to compute share URL for each platform using the news URL.
const getShareUrl = (socialName: string, newsUrl: string): string => {
    switch (socialName.toLowerCase()) {
        case 'twitter':
            return `https://twitter.com/intent/tweet?url=${encodeURIComponent(newsUrl)}`
        case 'facebook':
            return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(newsUrl)}`
        case 'whatsapp':
            return `https://api.whatsapp.com/send?text=${encodeURIComponent(newsUrl)}`
        case 'linkedin':
            return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(newsUrl)}`
        case 'pinterest':
            return `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(newsUrl)}`
        case 'reddit':
            return `https://www.reddit.com/submit?url=${encodeURIComponent(newsUrl)}`
        case 'telegram':
            return `https://t.me/share/url?url=${encodeURIComponent(newsUrl)}`
        case 'email':
            return `mailto:?subject=Check this out&body=${encodeURIComponent(newsUrl)}`
        default:
            return newsUrl
    }
}

const WidgetSocialsFollow: FC<WidgetSocialsFollowProps> = ({
    className = 'rounded-3xl border border-neutral-100 dark:border-neutral-700',
    news,
}) => {
    return (
        <div className={`WidgetSocialsFollow overflow-hidden ${className}`}>
            <Heading2 title="🧬 Share" />
            <div className="grid grid-cols-2">
                {socials?.map((social, index) => {
                    const shareUrl = getShareUrl(social.name, news.link)
                    return (
                        <a
                            key={index}
                            className="flex items-center gap-3 p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
                            href={shareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="relative mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full shadow-lg shadow-neutral-800/5 ring-1 ring-neutral-900/5 dark:border dark:border-neutral-700/50 dark:bg-neutral-800 dark:ring-0">
                                {social?.icon}
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="w-full flex-none text-xs font-medium capitalize text-neutral-900 dark:text-neutral-100">
                                    {social?.name}
                                </div>
                            </div>
                        </a>
                    )
                })}
            </div>
        </div>
    )
}

export default WidgetSocialsFollow
