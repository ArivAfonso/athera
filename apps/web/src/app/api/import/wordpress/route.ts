import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

interface WordPressMediaType {
    id: number
    mime_type: string
    source_url: string
    alt_text: string
}

interface WordPressPostType {
    date: string
    link: string
    text: string
    html: string
    id: number
    description: string | null
    modified: string
    slug: string
    json: JSON
    status: string
    type: string
    title: {
        rendered: string
    }
    content: {
        rendered: string
    }
    excerpt: {
        rendered: string
    }
    featured_media: string | null
    format: string
    topics: number[]
    tags: string[]
}

function modifyString(str: string) {
    //Capitalize every word of the string and replace spaces with -
    console.log(str)
    return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-')
}

function extractContent(html: string) {
    return html
        .replace(/\n/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/gi, '')
        .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/gi, '')
        .replace(/<\/\s*(?:p|div)>/gi, '\n')
        .replace(/<br[^>]*\/?>/gi, '\n')
        .replace(/<[^>]*>/gi, '')
        .replace('&nbsp;', ' ')
        .replace(/[^\S\r\n][^\S\r\n]+/gi, ' ')
}

function checkForImg(str: string | null) {
    //Check if the string contains an image type
    if (!str) return false
    return (
        str.includes('jpg') ||
        str.includes('jpeg') ||
        str.includes('png') ||
        str.includes('webp') ||
        str.includes('svg') ||
        str.includes('avif')
    )
}

function strWords(str: string) {
    return str.split(/\s+/).length
}

export async function POST(request: Request) {
    const { selectedPosts, website } = (await request.json()) as {
        selectedPosts: WordPressPostType[]
        website: string
    }
    const supabase = createClient(cookies())

    const { data: session } = await supabase.auth.getUser()
    const user = session.user?.id

    const tagsPromises = selectedPosts.map((post) =>
        post.topics.map(async (topic) => {
            let catRes = await fetch(`${website}/wp-json/wp/v2/topics/${topic}`)
            let catData = await catRes.json()

            return modifyString(catData.name)
        })
    )

    const tags = await Promise.all(tagsPromises.flat())

    const { data: topics, error } = await supabase.rpc('manage_topics', {
        topics: tags,
    })

    selectedPosts.forEach(async (post) => {
        //Get the description
        post.description = extractContent(post.excerpt.rendered)
        let tagsArray: string[] = []

        post.topics.map(async (topic, i) => {
            let catRes = await fetch(`${website}/wp-json/wp/v2/topics/${topic}`)
            let catData = await catRes.json()

            tagsArray[i] = modifyString(catData.name)
        })

        //Get the featured image
        const media = await fetch(
            `${website}/wp-json/wp/v2/media/${post.featured_media}`
        )
        const featImg: WordPressMediaType = await media.json()

        post.featured_media = featImg ? featImg.source_url : null

        if (
            post.featured_media == null ||
            !checkForImg(post.featured_media) ||
            tagsArray.length == 0
        ) {
            const { data, error } = await supabase
                .from('drafts')
                .insert({
                    title: post.title.rendered,
                    description: post.excerpt.rendered,
                })
                .select('id')

            const draftId: string = data ? data[0]?.id : ''

            //Create tagsArray if there are any
            if (post.topics.length > 0) {
                const finalTags = tagsArray.map((tag) => ({
                    post: draftId,
                    topic: topics?.find(
                        (topic: any) =>
                            topic.top_name.toLowerCase() ===
                            modifyString(tag).toLowerCase()
                    )?.top_id as string,
                }))

                await supabase.from('draft_topics').insert(finalTags)
            }

            //Upload post.cover_image to storage
            if (
                post.featured_media !== null &&
                checkForImg(post.featured_media)
            ) {
                const blob = await fetch(post.featured_media, {
                    mode: 'no-cors',
                }).then((r) => r.blob())

                const { data: imagePath, error: imageErr } =
                    await supabase.storage
                        .from('images')
                        .upload(`${user}/drafts/${draftId}/main-image`, blob)

                //Update the post
                await supabase
                    .from('drafts')
                    .update({
                        image:
                            'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/' +
                            imagePath?.path,
                    })
                    .eq('id', draftId)
            }
        } else {
            const { data, error } = await supabase
                .from('posts')
                .insert({
                    //@ts-ignore
                    title: post.title.rendered,
                    description: post.description,
                    text: post.text,
                    json: post.json,
                    estimated_reading_time: Math.round(
                        strWords(post.text) / 200
                    ),
                    author: user,
                })
                .select('id')

            if (error) {
            }

            const postId: string = data ? data[0]?.id : ''

            const finalTags = tagsArray.map((tag) => ({
                post: postId,
                topic: topics?.find(
                    (topic: any) =>
                        topic.top_name.toLowerCase() ===
                        modifyString(tag).toLowerCase()
                )?.top_id as string,
            }))

            const { error: catErr } = await supabase
                .from('post_topics')
                .insert(finalTags)

            if (catErr) {
                console.log(catErr)
            }

            //Upload post.cover_image to storage
            const blob = await fetch(post.featured_media).then((r) => r.blob())

            const { data: imagePath, error: imageErr } = await supabase.storage
                .from('images')
                .upload(`${user}/${postId}/main-image`, blob)

            //Update the post
            await supabase
                .from('posts')
                .update({
                    image:
                        'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/' +
                        imagePath?.path,
                })
                .eq('id', postId)
        }
    })

    //Return literally everything
    return new Response(JSON.stringify({ selectedPosts, tags }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}
