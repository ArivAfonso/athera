import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const host = searchParams.get('host')
    let postData: any = []

    for (let i = 1; i < 2; i++) {
        const query = `
            query Publication {
                publication(host: "${host}") {
                    posts(first: 20) {
                        edges {
                            node {
                                title
                                brief
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

        console.log(res)

        const data = await res.json()
        console.log(data)

        data.data.publication.posts.edges.forEach((post: any, i: number) => {
            postData[i] = post.node
        })

        if (!data.data.publication.posts.pageInfo.hasNextPage) break
    }
    return postData
}
