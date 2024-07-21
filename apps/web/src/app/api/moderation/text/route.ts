import { NextRequest } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const text = searchParams.get('text')
    if (!text) {
        return Response.json({ error: 'text is required' }, { status: 400 })
    }

    console.log(text)

    try {
        const PERSPECTIVE_API_URL = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`

        axios
            .post(PERSPECTIVE_API_URL, {
                comment: {
                    text: text,
                },
                languages: ['en'],
                requestedAttributes: {
                    TOXICITY: {},
                },
            })
            .then((res) => {
                console.log(res)
            })
            .catch(() => {
                console.log('error')
            })

        return new Response(JSON.stringify('data'), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: error }), {
            status: 500,
        })
    }
}

// import * as nsfwjs from 'nsfwjs'

// let model: nsfwjs.NSFWJS | null = null

// // Initialize the model
// async function loadModel() {
//     // Assuming the model is hosted at a specific URL
//     model = await nsfwjs.load()
// }

// loadModel()

// onmessage = async function (e: MessageEvent) {
//     const imageUrl: string = e.data
//     // Wait for 10-15 seconds before processing
//     await new Promise((resolve) =>
//         setTimeout(resolve, Math.random() * (15000 - 10000) + 10000)
//     )

//     console.log('Processing image')

//     if (model) {
//         // Load the image
//         const img = new Image()
//         img.crossOrigin = 'anonymous'
//         img.src = imageUrl
//         await img.decode() // Ensure the image is loaded before classification

//         const classificationResults = await model.classify(img)
//         postMessage(classificationResults)
//     } else {
//         postMessage({ error: 'Model not loaded yet.' })
//     }
// }
