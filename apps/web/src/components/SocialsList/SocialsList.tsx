import React, { FC, ReactNode } from 'react'

export interface SocialType {
    id: string
    name: string
    href: string
    icon: string
}

export interface SocialsListProps {
    className?: string
    itemClass?: string
    twitter: string
    facebook: string
    instagram: string
    youtube: string
    github: string
    pinterest: string
    linkedin: string
    twitch: string
    tiktok: string
}

const SocialsList: FC<SocialsListProps> = ({
    className = '',
    itemClass = 'block',
    twitter,
    facebook,
    instagram,
    youtube,
    github,
    pinterest,
    linkedin,
    twitch,
    tiktok,
}) => {
    const socials: SocialType[] = [
        {
            id: 'Facebook',
            name: 'Facebook',
            icon: `<svg class="h-6 w-6 -mt-[3px]" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path stroke="currentColor" stroke-linecap="round" stroke-width="12" d="M96 170c40.869 0 74-33.131 74-74 0-40.87-33.131-74-74-74-40.87 0-74 33.13-74 74 0 40.869 33.13 74 74 74Zm0 0v-62m30-48h-10c-11.046 0-20 8.954-20 20v28m0 0H74m22 0h22"/>
            </svg>`,
            href: facebook,
        },
        {
            id: 'Twitter',
            name: 'Twitter',
            icon: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none">
    <path d="M3 21L10.5484 13.4516M21 3L13.4516 10.5484M13.4516 10.5484L8 3H3L10.5484 13.4516M13.4516 10.5484L21 21H16L10.5484 13.4516" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
    `,
            href: twitter,
        },
        {
            id: 'Instagram',
            name: 'Instagram',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
    `,
            href: `https://www.instagram.com/${instagram}`,
        },
        {
            id: 'Youtube',
            name: 'Youtube',
            icon: `<svg class="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 209.673 209.673" xml:space="preserve">
<g>
	<path d="M173.075,29.203H36.599C16.418,29.203,0,45.626,0,65.812v78.05c0,20.186,16.418,36.608,36.599,36.608h136.477
		c20.18,0,36.598-16.422,36.598-36.608v-78.05C209.673,45.626,193.255,29.203,173.075,29.203z M194.673,143.861
		c0,11.915-9.689,21.608-21.598,21.608H36.599c-11.91,0-21.599-9.693-21.599-21.608v-78.05c0-11.915,9.689-21.608,21.599-21.608
		h136.477c11.909,0,21.598,9.693,21.598,21.608V143.861z"/>
	<path d="M145.095,98.57L89.499,61.92c-2.303-1.519-5.254-1.649-7.684-0.342c-2.429,1.308-3.944,3.845-3.944,6.604v73.309
		c0,2.759,1.515,5.295,3.944,6.604c1.113,0.6,2.336,0.896,3.555,0.896c1.442,0,2.881-0.415,4.129-1.239l55.596-36.659
		c2.105-1.388,3.372-3.74,3.372-6.262C148.467,102.31,147.2,99.958,145.095,98.57z M92.871,127.562V82.109l34.471,22.723
		L92.871,127.562z"/>
</g>
</svg>`,
            href: youtube,
        },
        {
            id: 'Github',
            name: 'Github',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
            href: github,
        },
        {
            id: 'Linkedin',
            name: 'Linkedin',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
            href: linkedin,
        },
        {
            id: 'Twitch',
            name: 'Twitch',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 256 256"><path d="M208,32H48A16,16,0,0,0,32,48V192a16,16,0,0,0,16,16H64v32a8,8,0,0,0,13.12,6.15L122.9,208h42.2a16,16,0,0,0,10.25-3.71l42.89-35.75A15.93,15.93,0,0,0,224,156.25V48A16,16,0,0,0,208,32Zm0,124.25L165.1,192H120a8,8,0,0,0-5.12,1.85L80,222.92V200a8,8,0,0,0-8-8H48V48H208ZM160,136V88a8,8,0,0,1,16,0v48a8,8,0,0,1-16,0Zm-48,0V88a8,8,0,0,1,16,0v48a8,8,0,0,1-16,0Z"></path></svg>`,
            href: twitch,
        },
        {
            id: 'Tiktok',
            name: 'Tiktok',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 256 256"><path d="M224,72a48.05,48.05,0,0,1-48-48,8,8,0,0,0-8-8H128a8,8,0,0,0-8,8V156a20,20,0,1,1-28.57-18.08A8,8,0,0,0,96,130.69V88a8,8,0,0,0-9.4-7.88C50.91,86.48,24,119.1,24,156a76,76,0,0,0,152,0V116.29A103.25,103.25,0,0,0,224,128a8,8,0,0,0,8-8V80A8,8,0,0,0,224,72Zm-8,39.64a87.19,87.19,0,0,1-43.33-16.15A8,8,0,0,0,160,102v54a60,60,0,0,1-120,0c0-25.9,16.64-49.13,40-57.6v27.67A36,36,0,1,0,136,156V32h24.5A64.14,64.14,0,0,0,216,87.5Z"></path></svg>`,
            href: tiktok,
        },
    ]
    return (
        <nav
            className={`SocialsList pb-2 flex space-x-2 text-2xl text-neutral-6000 dark:text-neutral-400 ${className}`}
        >
            {socials.map((item, i) => {
                if (item.id === 'Facebook' && !facebook) return null
                if (item.id === 'Twitter' && !twitter) return null
                if (item.id === 'Instagram' && !instagram) return null
                if (item.id === 'Youtube' && !youtube) return null
                if (item.id === 'Github' && !github) return null
                if (item.id === 'Pinterest' && !pinterest) return null
                if (item.id === 'Linkedin' && !linkedin) return null
                if (item.id === 'Twitch' && !twitch) return null
                if (item.id === 'Tiktok' && !tiktok) return null

                return (
                    <a
                        key={i}
                        className={`${itemClass}`}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={item.name}
                        dangerouslySetInnerHTML={{ __html: item.icon }}
                    ></a>
                )
            })}
        </nav>
    )
}

export default SocialsList
