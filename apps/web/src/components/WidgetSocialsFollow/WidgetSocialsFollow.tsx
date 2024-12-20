import { FC } from 'react'
import Heading2 from '../Heading2/Heading2'

interface WidgetSocialsFollowProps {
    className?: string
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        ),
        url: 'https://x.com',
        description: 'Follow us on X',
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
                    stroke-linecap="round"
                    stroke-width="12"
                    d="M96 170c40.869 0 74-33.131 74-74 0-40.87-33.131-74-74-74-40.87 0-74 33.13-74 74 0 40.869 33.13 74 74 74Zm0 0v-62m30-48h-10c-11.046 0-20 8.954-20 20v28m0 0H74m22 0h22"
                />
            </svg>
        ),
        url: 'https://www.facebook.com',
        description: 'Follow us on Facebook',
    },
    {
        name: 'instagram',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
        ),
        url: 'https://www.instagram.com',
        description: 'Follow us on Instagram',
    },
    {
        name: 'youtube',
        icon: (
            <svg
                className="w-7 h-7"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 209.673 209.673"
                xmlSpace="preserve"
            >
                <g>
                    <path
                        d="M173.075,29.203H36.599C16.418,29.203,0,45.626,0,65.812v78.05c0,20.186,16.418,36.608,36.599,36.608h136.477
           c20.18,0,36.598-16.422,36.598-36.608v-78.05C209.673,45.626,193.255,29.203,173.075,29.203z M194.673,143.861
           c0,11.915-9.689,21.608-21.598,21.608H36.599c-11.91,0-21.599-9.693-21.599-21.608v-78.05c0-11.915,9.689-21.608,21.599-21.608
           h136.477c11.909,0,21.598,9.693,21.598,21.608V143.861z"
                    />
                    <path
                        d="M145.095,98.57L89.499,61.92c-2.303-1.519-5.254-1.649-7.684-0.342c-2.429,1.308-3.944,3.845-3.944,6.604v73.309
           c0,2.759,1.515,5.295,3.944,6.604c1.113,0.6,2.336,0.896,3.555,0.896c1.442,0,2.881-0.415,4.129-1.239l55.596-36.659
           c2.105-1.388,3.372-3.74,3.372-6.262C148.467,102.31,147.2,99.958,145.095,98.57z M92.871,127.562V82.109l34.471,22.723
           L92.871,127.562z"
                    />
                </g>
            </svg>
        ),
        url: 'https://www.youtube.com',
        description: 'Follow us on Youtube',
    },
]

const WidgetSocialsFollow: FC<WidgetSocialsFollowProps> = ({
    className = 'rounded-3xl border border-neutral-100 dark:border-neutral-700',
}) => {
    return (
        <div className={`WidgetSocialsFollow overflow-hidden ${className}`}>
            <Heading2 title="🧬 We are on socials" />
            <div className="grid grid-cols-2">
                {socials?.map((social, idex) => (
                    <a
                        key={idex}
                        className="flex items-center gap-3 p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        href={social?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="relative mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full shadow-lg shadow-neutral-800/5 ring-1 ring-neutral-900/5 dark:border dark:border-neutral-700/50 dark:bg-neutral-400 dark:ring-0">
                            {social?.icon}
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="w-full flex-none text-sm font-medium capitalize text-neutral-900 dark:text-neutral-100">
                                {social?.name}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                <span className="line-clamp-1">
                                    {' '}
                                    {social?.description}
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}

export default WidgetSocialsFollow
