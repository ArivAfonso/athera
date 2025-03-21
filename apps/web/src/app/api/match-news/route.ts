import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import { OpenAI } from 'openai'

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
})

export async function GET(request: NextRequest) {
    // Parse query parameter
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    console.log('query', query)
    if (!query) {
        return NextResponse.json(
            { error: 'Missing query parameter' },
            { status: 400 }
        )
    }

    // Start timing
    const startTime = performance.now()
    const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-004',
        input: query,
    })

    // Extract the embedding array from the response
    const embeddingVector = embeddingResponse.data[0].embedding

    // Create Supabase client and call RPC "match_news"
    const supabase = createClient()
    const { data, error } = await supabase
        .rpc('match_news', {
            query_embedding: JSON.stringify(embeddingVector),
            match_threshold: 0.4,
            match_count: 10,
            filter_option: 'most_relevant',
        })
        .range(0, 10)

    if (error) {
        console.log('error', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    data?.forEach((item: any) => {
        item.likeCount = item.likecount
        item.commentCount = item.commentcount
    })

    return NextResponse.json(data || [])
}
