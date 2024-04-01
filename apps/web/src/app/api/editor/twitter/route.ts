import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get('url')
    if (url) {
        const urlWithParams = `https://publish.twitter.com/oembed?${url.toString()}`

        const response = await fetch(urlWithParams)

        if (!response.ok) {
            throw new Error('Failed to fetch oEmbed HTML')
        }

        const data = await response.json()
        return new Response(
            data.html.replace(
                '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
                ''
            ),
            {
                status: 200,
                headers: {
                    'Content-Type': 'text/html',
                },
            }
        )
    } else {
        return (
            new Response(),
            {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }
}
