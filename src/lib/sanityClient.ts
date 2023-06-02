import { ClientConfig, createClient } from '@sanity/client'

const config: ClientConfig = {
    projectId: 'yq8cnat4',
    dataset: 'production',
    apiVersion: '2021-08-31',
    useCdn: true, // Enable this for production
}

const client = createClient(config)

export { client as sanityClient }
