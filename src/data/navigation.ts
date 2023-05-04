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

    // archive pages ---------
    {
        id: randomId(),
        href: '/#',
        name: 'Archive Pages',
        children: [
            {
                id: randomId(),
                href: '/archive/demo-slug' as Route,
                name: 'Category page',
            },
            {
                id: randomId(),
                href: '/archive-2/demo-slug' as Route,
                name: 'Category audio',
            },
            {
                id: randomId(),
                href: '/archive-3/demo-slug' as Route,
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

    // others pages ----------------
    {
        id: randomId(),
        href: '/#',
        name: 'Other Pages',
        children: [
            { id: randomId(), href: '/dashboard', name: 'Dashboard' },
            { id: randomId(), href: '/about', name: 'About' },
            { id: randomId(), href: '/contact', name: 'Contact us' },
            {
                id: randomId(),
                href: '/login',
                name: 'Login',
            },
            {
                id: randomId(),
                href: '/signup',
                name: 'Signup',
            },
            {
                id: randomId(),
                href: '/forgot-pass',
                name: 'Forgot password',
            },
            {
                id: randomId(),
                href: '/subscription',
                name: 'Subscription',
            },
        ],
    },
]

const OTHER_PAGE_CHILD: NavItemType[] = [
    // archive pages ----------------
    {
        id: randomId(),
        href: '/archive/demo-slug' as Route,
        name: 'Category pages',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/archive/demo-slug' as Route,
                name: 'Category page 1',
            },
            {
                id: randomId(),
                href: '/archive-2/demo-slug' as Route,
                name: 'Category page 2',
            },
            {
                id: randomId(),
                href: '/archive-3/demo-slug' as Route,
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

    // dashboard pages ----------------
    {
        id: randomId(),
        href: '/dashboard',
        name: 'Dashboard Page',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/dashboard/edit-profile',
                name: 'Edit profile page',
            },
            {
                id: randomId(),
                href: '/dashboard/posts',
                name: 'Posts page',
            },
            {
                id: randomId(),
                href: '/dashboard/submit-post',
                name: 'Submit post page',
            },
            {
                id: randomId(),
                href: '/dashboard/subscription',
                name: 'Subscription',
            },
            {
                id: randomId(),
                href: '/dashboard/billing-address',
                name: 'Billing address',
            },
        ],
    },

    // about pages ----------------
    {
        id: randomId(),
        href: '/about',
        name: 'Other Pages',
        type: 'dropdown',
        children: [
            {
                id: randomId(),
                href: '/about',
                name: 'About',
            },
            {
                id: randomId(),
                href: '/contact',
                name: 'Contact us',
            },
            {
                id: randomId(),
                href: '/login',
                name: 'Login',
            },
            {
                id: randomId(),
                href: '/signup',
                name: 'Signup',
            },
            {
                id: randomId(),
                href: '/forgot-pass',
                name: 'Forgot password',
            },
            {
                id: randomId(),
                href: '/subscription',
                name: 'Subscription',
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
        href: '/archive/demo-slug' as Route,
        name: 'Space',
    },
    {
        id: randomId(),
        href: '/archive/demo-slug' as Route,
        name: 'AI',
    },
    {
        id: randomId(),
        href: '/archive/demo-slug' as Route,
        name: 'Robotics',
    },
    {
        id: randomId(),
        href: '/archive/demo-slug' as Route,
        name: 'VR',
    },
    {
        id: randomId(),
        href: '/archive/demo-slug' as Route,
        name: 'Electric Cars',
    },
]
