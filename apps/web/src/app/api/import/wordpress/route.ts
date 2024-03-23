import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
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
    categories: number[]
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

function extractContent(html:string) {
    return new DOMParser()
        .parseFromString(html, "text/html")
        .documentElement.textContent;
}

function checkForImg(str: string | null) {
    //Check if the string contains an image type 
    if (!str) return false
    return str.includes('jpg') || str.includes('jpeg') || str.includes('png') || str.includes('webp') || str.includes('svg') || str.includes('avif')
}

export async function POST(request: Request) {
    const { selectedPosts, website } = await request.json() as { selectedPosts: WordPressPostType[], website:string };
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: session } = await supabase.auth.getSession()
    const user = session?.session?.user.id

    const tags = selectedPosts.map((post) => 
            post.categories.map(async (category) => {
                let catRes = await fetch(`${website}/wp-json/wp/v2/categories/${category}`)
                let catData = await catRes.json()

                return modifyString(catData.name)
            })
        )

    const { data: categories, error } = await supabase.rpc('manage_categories', {
        categories: tags,
    })

    selectedPosts.forEach(async (post) => {

        //Get the description
        post.description = extractContent(post.excerpt.rendered)
        let tagsArray: string[] = []

        post.categories.map(async (category, i) => {
            let catRes = await fetch(`${website}/wp-json/wp/v2/categories/${category}`, {mode:'no-cors'})
            let catData = await catRes.json()

            tagsArray[i] = modifyString(catData.name)
        })

        //Get the featured image
        const media = await fetch(`${website}/wp-json/wp/v2/media/${post.featured_media}`, {mode:'no-cors'})
        const featImg: WordPressMediaType = await media.json()

        post.featured_media = featImg ? featImg.source_url : null

        if (post.featured_media == null || !checkForImg(post.featured_media) || post.tags === null) {
            const { data, error } = await supabase.from('drafts').insert({
                title: post.title,
                description: post.excerpt,
            }).select('id')

            const draftId: string = data ? data[0]?.id : null

            //Create tagsArray if there are any
            if (post.categories.length > 0) {
                const finalTags = await tagsArray.map((tag) => ({
                    post: draftId,
                    category: categories.find((category: any) => category.cat_name.toLowerCase() === modifyString(tag).toLowerCase()).cat_id,
                }))

                await supabase
                    .from('draft_categories')
                    .insert(finalTags)
            }

            //Upload post.cover_image to storage
            if (post.featured_media !== null && checkForImg(post.featured_media)) {
                const blob = await fetch(post.featured_media, {mode:'no-cors'}).then((r) => r.blob())

                const { data: imagePath, error: imageErr } = await supabase.storage
                    .from('images')
                    .upload(`${user}/drafts/${draftId}/main-image`, blob)

                //Update the post
                await supabase.from('drafts').update({
                    image: "https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/" + imagePath?.path,
                }).eq('id', draftId)
            }
        }
        else {

            const { data, error } = await supabase.from('posts').insert({
                title: post.title,
                description: post.description,
                text: post.text,
                json: post.json,
                author: user,
            }).select('id')

            const postId: string = data ? data[0]?.id : null

            console.log(tagsArray)

            await supabase
                .from('post_categories')
                .insert(tagsArray)


            //Upload post.cover_image to storage
            const blob = await fetch(post.featured_media).then((r) => r.blob())

            const { data: imagePath, error: imageErr } = await supabase.storage
                .from('images')
                .upload(`${user}/${postId}/main-image`, blob)

            //Update the post
            await supabase.from('posts').update({
                image: "https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/images/" + imagePath?.path,
            }).eq('id', postId)

        }
    })
    
    //Return status 200
    return new Response('Success!', {
        status: 200,
    })
}