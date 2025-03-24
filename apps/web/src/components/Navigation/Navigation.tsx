import React, { FC } from 'react'
import NavigationItem, { NavItemType } from './NavigationItem'
import { uniqueId } from 'es-toolkit/compat'
import { Route } from 'next'

const randomId = uniqueId

interface Props {
    className?: string
}

const NAVIGATION_DEMO_2: NavItemType[] = [
    //
    {
        id: randomId(),
        href: '/' as Route,
        name: 'Home',
    },
    {
        name: 'MapView',
        id: randomId(),
        href: '/mapview', // removed: as Route
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

const Navigation: FC<Props> = ({ className = 'flex' }) => {
    return (
        <ul className={`Navigation items-start ${className}`}>
            {NAVIGATION_DEMO_2.map((item) => (
                <NavigationItem key={item.id} menuItem={item} />
            ))}
        </ul>
    )
}

export default Navigation
