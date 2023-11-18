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
        href: '/category/space/75c8b97c-3cd6-432f-8775-fa8170143f65' as Route,
        name: 'Space',
    },
    {
        id: randomId(),
        href: '/category/ai/2573c2ec-abc5-45b6-9819-befd7714a206' as Route,
        name: 'AI',
    },
    {
        id: randomId(),
        href: '/category/music/772131eb-340d-44ea-aba9-ae2c91e8ff08' as Route,
        name: 'Music',
    },
    {
        id: randomId(),
        href: '/category/sports/c2cb2a4a-6e8d-4d7f-9199-0d268f9ea6c2' as Route,
        name: 'Sports',
    },
    {
        id: randomId(),
        href: '/category/history/42536f03-8975-4ef6-8e3f-af9d3100aace' as Route,
        name: 'History',
    },
]
