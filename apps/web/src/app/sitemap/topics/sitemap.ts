'use server'

import stringToSlug from '@/utils/stringToSlug'
import { createClient } from '@supabase/supabase-js'
import { MetadataRoute } from 'next'

const BASE_URL = 'https://athera.blog'

export async function generateSitemaps() {
    // Fetch the total number of products and calculate the number of sitemaps needed
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
    const { count, error } = await supabase
        .from('topics')
        .select('*', { count: 'exact', head: true })

    if (!count) {
        throw new Error(error?.message)
    }

    //Divide the total number of products by 50,000 to get the number of sitemaps needed
    const sitemapCount = Math.ceil(count / 50000)
    const sitemapArray = Array.from({ length: sitemapCount }, (_, i) => i)

    // Generate the id array for the sitemap function
    const sitemapIds = sitemapArray.map((_, i) => ({ id: i }))

    return sitemapIds
}

export default async function sitemap({
    id = 0,
}: {
    id: number
}): Promise<MetadataRoute.Sitemap> {
    // Google's limit is 50,000 URLs per sitemap
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
    const start = id * 50000
    const end = start + 50000
    const { data, error } = await supabase
        .from('topics')
        .select('id, name')
        .range(start, end)

    if (!data) {
        throw new Error(error.message)
    }

    const sitemap = data.map((topic) => ({
        url: `${BASE_URL}/topic/${stringToSlug(topic.name)}/${topic.id}`,
        lastModified: new Date(),
    }))

    return sitemap
}
