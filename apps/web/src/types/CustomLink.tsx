import { Route } from 'next'

export interface CustomLink {
    label: string
    href: Route
    targetBlank?: boolean
}
