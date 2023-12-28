import { NavItemType } from '@/components/Navigation/NavigationItem'
import { Route } from '@/routers/types'
import _ from 'lodash'

const randomId = _.uniqueId

export const MEGAMENU_TEMPLATES: NavItemType[] = [
    // single pages ---------
    {
        id: randomId(),
        href: '/single/demo-slug' as Route,
        name: 'Single Pages',
        children: [
            {
                id: randomId(),
                href: '/single/demo-slug' as Route,
                name: 'Single page 1',
            },
            {
                id: randomId(),
                href: '/single-2/demo-slug' as Route,
                name: 'Single page 2',
            },
            {
                id: randomId(),
                href: '/single-3/demo-slug' as Route,
                name: 'Single page 3',
            },
            {
                id: randomId(),
                href: '/single-4/demo-slug' as Route,
                name: 'Single page 4',
            },

            {
                id: randomId(),
                href: '/single-audio/demo-slug' as Route,
                name: 'Single Audio',
            },
            {
                id: randomId(),
                href: '/single-video/demo-slug' as Route,
                name: 'Single Video',
            },
            {
                id: randomId(),
                href: '/single-gallery/demo-slug' as Route,
                name: 'Single Gallery',
                isNew: true,
            },
        ],
    },

    // category pages ---------
    {
        id: randomId(),
        href: '/#',
        name: 'Category Pages',
        children: [
            {
                id: randomId(),
                href: '/category/demo-slug' as Route,
                name: 'Category page',
            },
            {
                id: randomId(),
                href: '/category-2/demo-slug' as Route,
                name: 'Category audio',
            },
            {
                id: randomId(),
                href: '/category-3/demo-slug' as Route,
                name: 'Category videos',
            },
            {
                id: randomId(),
                href: '/author/demo-slug' as Route,
                name: 'Author page',
            },
        ],
    },
]

export const NAVIGATION_DEMO_2: NavItemType[] = [
    //
    {
        id: randomId(),
        href: '/' as Route,
        name: 'Home',
    },
    {
        id: randomId(),
        href: '/category/World/1d79bec8-141d-4c3d-a1e6-01f94fd72e27' as Route,
        name: 'World',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/category/United-States/9d0f7723-b88d-4dc8-a3ac-63ed2fcfcb2d' as Route,
                name: 'United States',
            },
            {
                id: randomId(),
                href: '/category/India/72e8168c-b87b-427a-bc6a-084e47d5ef1b' as Route,
                name: 'India',
            },
            {
                id: randomId(),
                href: '/category/China/f4db36c2-5bca-48d2-8d54-e01a6b05aba8' as Route,
                name: 'China',
            },
            {
                id: randomId(),
                href: '/category/Japan/c42fb51f-5220-4b73-9c0e-ce216f79c2da' as Route,
                name: 'Japan',
            },
            {
                id: randomId(),
                href: '/category/Russia/08f2487f-aee0-48e2-b14f-c213be537147' as Route,
                name: 'Russia',
            },
            {
                id: randomId(),
                href: '/category/United-Kingdom/dbbe48f2-9145-41b1-aae1-6b5b984bddc0' as Route,
                name: 'United Kingdom',
            },
        ],
    },

    {
        id: randomId(),
        href: '/category/Tech/027adce1-87f3-4cc2-b1cb-f2cb72eb56d3' as Route,
        name: 'Tech',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/category/AI/2573c2ec-abc5-45b6-9819-befd7714a206' as Route,
                name: 'AI',
            },
            {
                id: randomId(),
                href: '/category/Electric-Vehicles/d05b722a-0ffe-4c22-8421-d458867ef6c3' as Route,
                name: 'Electric Vehicles',
            },
            {
                id: randomId(),
                href: '/category/Apps/ce7dffab-a560-4e72-ae28-7f19c4f22394' as Route,
                name: 'Apps',
            },
            {
                id: randomId(),
                href: '/category/Crypto/f4044e4b-5ff1-4b1d-b8bc-88e8ca5455af' as Route,
                name: 'Cryptocurrency',
            },
            {
                id: randomId(),
                href: '/category/Robotics/4041daa7-a19d-4edc-85f1-691be824784b' as Route,
                name: 'Robotics',
            },
            {
                id: randomId(),
                href: '/category/Startups/f2a0d7b3-2934-4b77-978e-74ca6b29be53' as Route,
                name: 'Startups',
            },
        ],
    },
    {
        id: randomId(),
        href: '/category/Business/4c676630-5d49-439f-8418-71bab6cfa30d' as Route,
        name: 'Business',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/category/Finance/13cba8d0-d6d4-48d7-90c7-7731153b78b0' as Route,
                name: 'Finance',
            },
            {
                id: randomId(),
                href: '/category/Stock-Market/3a2d2131-791b-4360-8143-b7e2a94c587d' as Route,
                name: 'Stock Market',
            },
            {
                id: randomId(),
                href: '/category/Real-Estate/9afcdc72-2486-469d-8921-12cc7a56c30e' as Route,
                name: 'Real Estate',
            },
            {
                id: randomId(),
                href: '/category/Management/7b961613-6df2-41b7-9c78-16d36397d60b' as Route,
                name: 'Management',
            },
            {
                id: randomId(),
                href: '/category/Marketing/1492933e-b356-4af9-98c2-9aa939e6d91e' as Route,
                name: 'Marketing',
            },
            {
                id: randomId(),
                href: '/category/Media/9f86fc0c-298b-4160-b6ef-056e0c49138c' as Route,
                name: 'Investing',
            },
        ],
    },
    {
        id: randomId(),
        href: '/category/Sports/c2cb2a4a-6e8d-4d7f-9199-0d268f9ea6c2' as Route,
        name: 'Sports',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/category/Cricket/ea0fcbea-f3b9-473f-a531-1ede8221742c' as Route,
                name: 'Cricket',
            },
            {
                id: randomId(),
                href: '/category/Badminton/57880db5-8144-403a-bc87-a60bbb23ba50' as Route,
                name: 'Badminton',
            },
            {
                id: randomId(),
                href: '/category/Football/1a3d7148-be3e-471f-9956-fbd4acd91326' as Route,
                name: 'Football',
            },
            {
                id: randomId(),
                href: '/category/Tennis/13be7c97-1ab3-4ce6-afe3-e84f5e4cfe19' as Route,
                name: 'Tennis',
            },
            {
                id: randomId(),
                href: '/category/Basketball/e5c04426-1c2c-4329-bcad-c1c11261c0eb' as Route,
                name: 'Basketball',
            },
            {
                id: randomId(),
                href: '/category/Golf/6c689432-3c01-47aa-ba9c-4dc160e7847e' as Route,
                name: 'Golf',
            },
            {
                id: randomId(),
                href: '/category/Racing/c270170a-459a-47a0-8d1e-b1cca42d5e6c' as Route,
                name: 'Formula One',
            },
        ],
    },
]
