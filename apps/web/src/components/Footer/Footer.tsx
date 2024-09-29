import React from 'react'
import Logo from '@/components/Logo/Logo'
import { CustomLink } from '@/types/CustomLink'
import Link from 'next/link'

export interface WidgetFooterMenu {
    id: string
    title: string
    menus: CustomLink[]
}

const links = [
    {
        name: 'Home',
        href: '/',
    },
    {
        name: 'Blog',
        href: '/blog',
    },
    {
        name: 'Open Source',
        href: 'https://github.com/ArivAfonso/athera/',
    },
]
const legal = [
    {
        name: 'Privacy Policy',
        href: '/privacy-policy',
    },
    {
        name: 'Terms of Service',
        href: '/terms-of-service',
    },
    {
        name: 'License',
        href: 'https://github.com/ArivAfonso/athera/blob/main/LICENSE',
    },
]
const socials = [
    {
        name: 'Twitter',
        href: 'https://twitter.com/ArivAfonso',
    },
    {
        name: 'Youtube',
        href: 'https://youtube.com/',
    },
    {
        name: 'GitHub',
        href: 'https://github.com/ArivAfonso',
    },
]

const Footer: React.FC = () => {
    return (
        <div className="relative">
            <div className="border-t border-neutral-100  dark:border-neutral-800 px-8 pt-20 pb-16 relative">
                <div className="max-w-7xl mx-auto text-sm text-neutral-500 dark:text-neutral-300 flex sm:flex-row flex-col justify-between items-start ">
                    <div>
                        <div className="mr-4  md:flex mb-4">
                            <Logo />
                        </div>
                        <div>Copyright &copy; 2024 Athera</div>
                        <div className="mt-2">All rights reserved</div>
                    </div>
                    <div className="grid grid-cols-3 gap-10 items-start mt-10 md:mt-0">
                        <div className="flex justify-center space-y-4 flex-col mt-4">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    className="transition-colors hover:text-black text-muted dark:text-muted-dark dark:hover:text-neutral-400 text-xs sm:text-sm"
                                    href={link.href}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="flex justify-center space-y-4 flex-col mt-4">
                            {legal.map((link) => (
                                <Link
                                    key={link.name}
                                    className="transition-colors hover:text-black text-muted dark:text-muted-dark dark:hover:text-neutral-400 text-xs sm:text-sm"
                                    href={link.href}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="flex justify-center space-y-4 flex-col mt-4">
                            {socials.map((link) => (
                                <Link
                                    key={link.name}
                                    className="transition-colors hover:text-black text-muted dark:text-muted-dark dark:hover:text-neutral-400 text-xs sm:text-sm"
                                    href={link.href}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
