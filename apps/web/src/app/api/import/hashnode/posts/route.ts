import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const host = searchParams.get('host')
    let postData: any = []

    let hasNextPage = true
    let endCursor = null

    while (hasNextPage) {
        const query = `
        query Publication {
            publication(host: "${host}") {
                posts(first: 20, after: ${endCursor ? `"${endCursor}"` : null}) {
                    edges {
                        node {
                            id
                            title
                            subtitle
                            coverImage {
                                url
                            }
                            content {
                                html
                                text
                            }
                            url
                            tags{
                                name
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        }
    `

        const res = await fetch('https://gql.hashnode.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        })

        const data = await res.json()

        data.data.publication.posts.edges.forEach((post: any) => {
            postData.push(post.node)
        })

        hasNextPage = data.data.publication.posts.pageInfo.hasNextPage
        endCursor = data.data.publication.posts.pageInfo.endCursor
    }
    return new Response(
        JSON.stringify({
            postData,
        }),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}
