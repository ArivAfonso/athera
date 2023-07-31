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
                href: '/search',
                name: 'Search page',
            },
            {
                id: randomId(),
                href: '/search-2',
                name: 'Search page 2',
            },
            {
                id: randomId(),
                href: '/author/demo-slug' as Route,
                name: 'Author page',
            },
        ],
    },
]

const OTHER_PAGE_CHILD: NavItemType[] = [
    // category pages ----------------
    {
        id: randomId(),
        href: '/category/demo-slug' as Route,
        name: 'Category pages',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/category/demo-slug' as Route,
                name: 'Category page 1',
            },
            {
                id: randomId(),
                href: '/category-2/demo-slug' as Route,
                name: 'Category page 2',
            },
            {
                id: randomId(),
                href: '/category-3/demo-slug' as Route,
                name: 'Category page 2',
            },
        ],
    },

    // single pages ----------------
    {
        id: randomId(),
        href: '/single/demo-slug' as Route,
        name: 'Single pages',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/single/demo-slug' as Route,
                name: 'Single 1',
            },
            {
                id: randomId(),
                href: '/single-2/demo-slug' as Route,
                name: 'Single 2',
            },
            {
                id: randomId(),
                href: '/single-3/demo-slug' as Route,
                name: 'Single 3',
            },
            {
                id: randomId(),
                href: '/single-4/demo-slug' as Route,
                name: 'Single 4',
            },
            {
                id: randomId(),
                href: '/single-5/demo-slug' as Route,
                name: 'Single 5',
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
            },
        ],
    },

    // seach pages ----------------
    {
        id: randomId(),
        href: '/search',
        name: 'Search Page',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/search',
                name: 'Search page',
            },
            {
                id: randomId(),
                href: '/search-2',
                name: 'Search page 2',
            },
        ],
    },

    // author pages ----------------
    {
        id: randomId(),
        href: '/author/demo-slug' as Route,
        name: 'Author page',
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
        href: '/category/space' as Route,
        name: 'Space',
    },
    {
        id: randomId(),
        href: '/category/ai' as Route,
        name: 'AI',
    },
    {
        id: randomId(),
        href: '/category/robotics' as Route,
        name: 'Robotics',
    },
    {
        id: randomId(),
        href: '/category/virtual-reality' as Route,
        name: 'VR',
    },
    {
        id: randomId(),
        href: '/category/electric-vehicles' as Route,
        name: 'Electric Vehicles',
    },
]
