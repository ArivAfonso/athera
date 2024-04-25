import React from 'react'
import Logo from '@/components/Logo/Logo'
import { CustomLink } from '@/data/types'
import Link from 'next/link'

export interface WidgetFooterMenu {
    id: string
    title: string
    menus: CustomLink[]
}

const widgetMenus: WidgetFooterMenu[] = [
    {
        id: '5',
        title: 'Getting started',
        menus: [
            { href: '/', label: 'Installation' },
            { href: '/', label: 'Release Notes' },
            { href: '/', label: 'Upgrade Guide' },
            { href: '/', label: 'Browser Support' },
            { href: '/', label: 'Editor Support' },
        ],
    },
    {
        id: '1',
        title: 'Explore',
        menus: [
            { href: '/', label: 'Design features' },
            { href: '/', label: 'Prototyping' },
            { href: '/', label: 'Design systems' },
            { href: '/', label: 'Pricing' },
            { href: '/', label: 'Customers' },
        ],
    },
    {
        id: '2',
        title: 'Resources',
        menus: [
            { href: '/', label: 'Best practices' },
            { href: '/', label: 'Support' },
            { href: '/', label: 'Developers' },
            { href: '/', label: 'Learn design' },
            { href: '/', label: "What's new" },
        ],
    },
    {
        id: '4',
        title: 'Community',
        menus: [
            { href: '/', label: 'Discussion Forums' },
            { href: '/', label: 'Code of Conduct' },
            { href: '/', label: 'Community Resources' },
            { href: '/', label: 'Contributing' },
            { href: '/', label: 'Concurrent Mode' },
        ],
    },
]

const Footer: React.FC = () => {
    const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
        return (
            <div key={index} className="text-sm">
                <ul className="mt-5 space-y-4">
                    {menu.menus.map((item, index) => (
                        <li key={index}>
                            <a
                                key={index}
                                className="text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                                href={item.href}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <div className="max-w-screen-lg mx-auto">
            <footer className="mt-12 py-6 border-t-2 border-light-700 flex flex-col sm:flex-row justify-between">
                <div>
                    <Link
                        className="flex items-center font-bold text-xl text-dark-300"
                        href="/"
                    >
                        <div className="w-auto h-10 mr-4">
                            <Logo />
                        </div>
                    </Link>
                </div>
                <div className="mt-4 sm:mt-0 flex text-sm sm:text-base space-x-6">
                    <ul>
                        <h5 className="pr-10 mb-4 font-semibold text-dark-50">
                            Menu
                        </h5>
                        <li className="py-0.5">
                            <Link
                                className="text-gray-400 hover:text-dark-300 transition"
                                href=""
                            >
                                Write
                            </Link>
                        </li>
                        <li className="py-0.5">
                            <Link
                                className="text-gray-400 hover:text-dark-300 transition"
                                href=""
                            >
                                All Posts
                            </Link>
                        </li>
                        <li className="py-0.5">
                            <Link
                                className="text-gray-400 hover:text-dark-300 transition"
                                href="/login"
                            >
                                Login
                            </Link>
                        </li>
                    </ul>

                    <ul>
                        <h5 className="pr-10 mb-4 font-semibold text-dark-50">
                            Open Source
                        </h5>
                        <li className="py-0.5">
                            <Link
                                className="text-gray-400 hover:text-dark-300 transition"
                                href="https://github.com/zernonia/keypress"
                                target="_blank"
                            >
                                GitHub
                            </Link>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    )
}

export default Footer
