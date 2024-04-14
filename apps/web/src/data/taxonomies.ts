import { Route } from '@/routers/types'
import __taxonomies from './jsons/__taxonomies.json'
import { TaxonomyType } from './types'

const DEMO_TOPICS: TaxonomyType[] = __taxonomies.map((item) => ({
    ...item,
    taxonomy: 'topic',
    href: item.href as Route,
}))

const DEMO_TAGS: TaxonomyType[] = __taxonomies.map((item) => ({
    ...item,
    taxonomy: 'tag',
    href: item.href as Route,
}))

export { DEMO_TOPICS, DEMO_TAGS }
