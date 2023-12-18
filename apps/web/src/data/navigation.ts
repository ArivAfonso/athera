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
        href: '#',
        name: 'World',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/category/USA/1' as Route,
                name: 'United States',
            },
            {
                id: randomId(),
                href: '/category/India/1' as Route,
                name: 'India',
            },
            {
                id: randomId(),
                href: '/category/China/1' as Route,
                name: 'China',
            },
            {
                id: randomId(),
                href: '/category/Japan/1' as Route,
                name: 'Middle East',
            },
            {
                id: randomId(),
                href: '/category/Russia/1' as Route,
                name: 'Russia',
            },
            {
                id: randomId(),
                href: '/category/UK/1' as Route,
                name: 'United Kingdom',
            },
        ],
    },

    {
        id: randomId(),
        href: '#',
        name: 'Tech',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/category/ai/2573c2ec-abc5-45b6-9819-befd7714a206' as Route,
                name: 'AI',
            },
            {
                id: randomId(),
                href: '/category/electric-vehicles/1' as Route,
                name: 'Electric Vehicles',
            },
            {
                id: randomId(),
                href: '/category/Apps/1' as Route,
                name: 'Apps',
            },
            {
                id: randomId(),
                href: '/category/crypto/1' as Route,
                name: 'Cryptocurrency',
            },
            {
                id: randomId(),
                href: '/category/robotics/1' as Route,
                name: 'Robotics',
            },
            {
                id: randomId(),
                href: '/category/startups/1' as Route,
                name: 'Startups',
            },
        ],
    },
    {
        id: randomId(),
        href: '#' as Route,
        name: 'Business',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/category/finance/1' as Route,
                name: 'Finance',
            },
            {
                id: randomId(),
                href: '/category/stock-market/1' as Route,
                name: 'Stock Market',
            },
            {
                id: randomId(),
                href: '/category/real-estate/1' as Route,
                name: 'Real Estate',
            },
            {
                id: randomId(),
                href: '/category/management/1' as Route,
                name: 'Management',
            },
            {
                id: randomId(),
                href: '/category/marketing/1' as Route,
                name: 'Marketing',
            },
            {
                id: randomId(),
                href: '/category/media/1' as Route,
                name: 'Investing',
            },
        ],
    },
    {
        id: randomId(),
        href: '#' as Route,
        name: 'Sports',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/category/cricket/1' as Route,
                name: 'Cricket',
            },
            {
                id: randomId(),
                href: '/category/football/1' as Route,
                name: 'Football',
            },
            {
                id: randomId(),
                href: '/category/tennis/1' as Route,
                name: 'Tennis',
            },
            {
                id: randomId(),
                href: '/category/basketball/1' as Route,
                name: 'Basketball',
            },
            {
                id: randomId(),
                href: '/category/golf/1' as Route,
                name: 'Golf',
            },
            {
                id: randomId(),
                href: '/category/racing/1' as Route,
                name: 'Formula One',
            },
        ],
    },
]
