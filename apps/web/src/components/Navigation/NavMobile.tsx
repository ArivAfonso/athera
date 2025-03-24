'use client'

import React, { useEffect, useState } from 'react'
import { ButtonClose } from 'ui'
import Logo from '@/components/Logo/Logo'
import { Disclosure } from '@/app/headlessui'
import { NavItemType } from './NavigationItem'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import SwitchDarkMode from '@/components/SwitchDarkMode/SwitchDarkMode'
import Link from 'next/link'
import { Button } from 'ui'
import { createClient } from '@/utils/supabase/client'
import { AuthSession } from '@supabase/supabase-js'
import { uniqueId } from 'es-toolkit/compat'
import { Route } from 'next'

const randomId = uniqueId

export interface NavMobileProps {
    data?: NavItemType[]
    onClickClose?: () => void
}

const NAVIGATION_DEMO_2: NavItemType[] = [
    //
    {
        id: randomId(),
        href: '/' as Route,
        name: 'Home',
    },
    {
        id: randomId(),
        name: 'World',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/topic/United-States/9d0f7723-b88d-4dc8-a3ac-63ed2fcfcb2d' as Route,
                name: 'United States',
            },
            {
                id: randomId(),
                href: '/topic/India/72e8168c-b87b-427a-bc6a-084e47d5ef1b' as Route,
                name: 'India',
            },
            {
                id: randomId(),
                href: '/topic/China/f4db36c2-5bca-48d2-8d54-e01a6b05aba8' as Route,
                name: 'China',
            },
            {
                id: randomId(),
                href: '/topic/Japan/c42fb51f-5220-4b73-9c0e-ce216f79c2da' as Route,
                name: 'Japan',
            },
            {
                id: randomId(),
                href: '/topic/Russia/08f2487f-aee0-48e2-b14f-c213be537147' as Route,
                name: 'Russia',
            },
            {
                id: randomId(),
                href: '/topic/United-Kingdom/dbbe48f2-9145-41b1-aae1-6b5b984bddc0' as Route,
                name: 'United Kingdom',
            },
        ],
    },

    {
        id: randomId(),
        name: 'Tech',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/topic/AI/2573c2ec-abc5-45b6-9819-befd7714a206' as Route,
                name: 'AI',
            },
            {
                id: randomId(),
                href: '/topic/Electric-Vehicles/d05b722a-0ffe-4c22-8421-d458867ef6c3' as Route,
                name: 'Electric Vehicles',
            },
            {
                id: randomId(),
                href: '/topic/Apps/ce7dffab-a560-4e72-ae28-7f19c4f22394' as Route,
                name: 'Apps',
            },
            {
                id: randomId(),
                href: '/topic/Crypto/f4044e4b-5ff1-4b1d-b8bc-88e8ca5455af' as Route,
                name: 'Cryptocurrency',
            },
            {
                id: randomId(),
                href: '/topic/Robotics/4041daa7-a19d-4edc-85f1-691be824784b' as Route,
                name: 'Robotics',
            },
            {
                id: randomId(),
                href: '/topic/Startups/f2a0d7b3-2934-4b77-978e-74ca6b29be53' as Route,
                name: 'Startups',
            },
        ],
    },
    {
        id: randomId(),
        name: 'Business',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/topic/Finance/13cba8d0-d6d4-48d7-90c7-7731153b78b0' as Route,
                name: 'Finance',
            },
            {
                id: randomId(),
                href: '/topic/Stock-Market/3a2d2131-791b-4360-8143-b7e2a94c587d' as Route,
                name: 'Stock Market',
            },
            {
                id: randomId(),
                href: '/topic/Real-Estate/9afcdc72-2486-469d-8921-12cc7a56c30e' as Route,
                name: 'Real Estate',
            },
            {
                id: randomId(),
                href: '/topic/Management/7b961613-6df2-41b7-9c78-16d36397d60b' as Route,
                name: 'Management',
            },
            {
                id: randomId(),
                href: '/topic/Marketing/1492933e-b356-4af9-98c2-9aa939e6d91e' as Route,
                name: 'Marketing',
            },
            {
                id: randomId(),
                href: '/topic/Media/9f86fc0c-298b-4160-b6ef-056e0c49138c' as Route,
                name: 'Investing',
            },
        ],
    },
    {
        id: randomId(),
        name: 'Sports',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/topic/Cricket/ea0fcbea-f3b9-473f-a531-1ede8221742c' as Route,
                name: 'Cricket',
            },
            {
                id: randomId(),
                href: '/topic/Badminton/57880db5-8144-403a-bc87-a60bbb23ba50' as Route,
                name: 'Badminton',
            },
            {
                id: randomId(),
                href: '/topic/Football/1a3d7148-be3e-471f-9956-fbd4acd91326' as Route,
                name: 'Football',
            },
            {
                id: randomId(),
                href: '/topic/Tennis/13be7c97-1ab3-4ce6-afe3-e84f5e4cfe19' as Route,
                name: 'Tennis',
            },
            {
                id: randomId(),
                href: '/topic/Basketball/e5c04426-1c2c-4329-bcad-c1c11261c0eb' as Route,
                name: 'Basketball',
            },
            {
                id: randomId(),
                href: '/topic/Golf/6c689432-3c01-47aa-ba9c-4dc160e7847e' as Route,
                name: 'Golf',
            },
            {
                id: randomId(),
                href: '/topic/Racing/c270170a-459a-47a0-8d1e-b1cca42d5e6c' as Route,
                name: 'Formula One',
            },
        ],
    },
]

const NavMobile: React.FC<NavMobileProps> = ({
    data = NAVIGATION_DEMO_2,
    onClickClose,
}) => {
    const _renderMenuChild = (
        item: NavItemType,
        itemClass = ' pl-3 text-neutral-900 dark:text-neutral-200 font-medium '
    ) => {
        return (
            <ul className="nav-mobile-sub-menu pl-6 pb-1 text-base">
                {item.children?.map((i, index) => (
                    <Disclosure key={index} as="li">
                        <Link
                            href={{
                                pathname: i.href || undefined,
                            }}
                            className={`flex text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 mt-0.5 pr-4 ${itemClass}`}
                        >
                            <span
                                className={`py-2.5 ${
                                    !i.children ? 'block w-full' : ''
                                }`}
                                onClick={onClickClose}
                            >
                                {i.name}
                            </span>
                            {i.children && (
                                <span
                                    className="flex items-center flex-grow"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <Disclosure.Button
                                        as="span"
                                        className="flex justify-end flex-grow"
                                    >
                                        <ChevronDownIcon
                                            className="ml-2 h-4 w-4 text-slate-500"
                                            aria-hidden="true"
                                        />
                                    </Disclosure.Button>
                                </span>
                            )}
                        </Link>
                        {i.children && (
                            <Disclosure.Panel>
                                {_renderMenuChild(
                                    i,
                                    'pl-3 text-slate-600 dark:text-slate-400 '
                                )}
                            </Disclosure.Panel>
                        )}
                    </Disclosure>
                ))}
            </ul>
        )
    }

    const _renderItem = (item: NavItemType, index: number) => {
        return (
            <Disclosure
                key={index}
                as="li"
                className="text-slate-900 dark:text-white"
            >
                <Link
                    className="flex w-full items-center py-2.5 px-4 font-medium uppercase tracking-wide text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    href={{
                        pathname: item.href || undefined,
                    }}
                >
                    <span
                        className={!item.children ? 'block w-full' : ''}
                        onClick={onClickClose}
                    >
                        {item.name}
                    </span>
                    {item.children && (
                        <span
                            className="block flex-grow"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Disclosure.Button
                                as="span"
                                className="flex justify-end flex-grow"
                            >
                                <ChevronDownIcon
                                    className="ml-2 h-4 w-4 text-neutral-500"
                                    aria-hidden="true"
                                />
                            </Disclosure.Button>
                        </span>
                    )}
                </Link>
                {item.children && (
                    <Disclosure.Panel>
                        {_renderMenuChild(item)}
                    </Disclosure.Panel>
                )}
            </Disclosure>
        )
    }

    const renderMagnifyingGlassIcon = () => {
        return (
            <svg
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M22 22L20 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }

    const [session, setSession] = useState<AuthSession>()

    useEffect(() => {
        async function fetchData() {
            try {
                const supabase = createClient()
                const { data: session } = await supabase.auth.getSession()
                if (session.session) setSession(session.session)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="overflow-y-auto w-full h-screen py-2 transition transform shadow-lg ring-1 dark:ring-neutral-700 bg-white dark:bg-neutral-900 divide-y-2 divide-neutral-100 dark:divide-neutral-800">
            <div className="py-6 px-5">
                <Logo />
                <div className="flex flex-col mt-5 text-slate-600 dark:text-slate-300 text-sm">
                    <span>
                        Discover the most outstanding articles on all topics of
                        life. Write your stories and share them
                    </span>

                    <div className="flex justify-between items-center mt-4">
                        <span className="block">
                            <SwitchDarkMode className="bg-neutral-100 dark:bg-neutral-800" />
                        </span>
                    </div>
                </div>
                <span className="absolute right-2 top-2 p-1">
                    <ButtonClose onClick={onClickClose} />
                </span>
            </div>
            <ul className="flex flex-col py-6 px-2 space-y-1">
                {data.map(_renderItem)}
            </ul>
            {!session && (
                <div className="flex items-center justify-center py-6 px-5 space-x-2">
                    <Button href="/signup" className="!px-10 bg-blue-600">
                        Sign Up
                    </Button>
                </div>
            )}
        </div>
    )
}

export default NavMobile
