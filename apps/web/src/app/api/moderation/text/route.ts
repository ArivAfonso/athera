import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const text = searchParams.get('text')
    if (!text) {
        return Response.json({ error: 'text is required' }, { status: 400 })
    }

    console.log(text)

    try {
        const response = await fetch(
            `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    comment: { text: text },
                    languages: ['en'],
                    requestedAttributes: {
                        TOXICITY: {},
                        IDENTITY_ATTACK: {},
                    },
                }),
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(
                `HTTP error! status: ${response.status}, message: ${errorData.error.message}`
            )
        }

        const data = await response.json()
        console.log(data)

        return new Response(JSON.stringify(data), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: error }), {
            status: 500,
        })
    }
}
