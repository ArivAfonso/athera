import * as nsfwjs from 'nsfwjs'

let initialLoad: nsfwjs.NSFWJS | null = null

// Function to check and load the model from IndexedDB or URL
async function loadModel() {
    try {
        // Try to load the model from IndexedDB
        initialLoad = await nsfwjs.load('indexeddb://model')
    } catch {
        // If not found in IndexedDB, load from URL and save to IndexedDB
        initialLoad = await nsfwjs.load()
        await initialLoad.model.save('indexeddb://model')
    }
}

// Load the model when the worker starts
loadModel()

onmessage = async function (e: MessageEvent) {
    const imageUrl: string = e.data
    if (!initialLoad) {
        await loadModel()
    }

    if (initialLoad) {
        try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            const imgBitmap = await createImageBitmap(blob)
            const offscreenCanvas = new OffscreenCanvas(
                imgBitmap.width,
                imgBitmap.height
            )
            const canvasContext = offscreenCanvas.getContext('2d')

            if (canvasContext) {
                canvasContext.drawImage(imgBitmap, 0, 0)
                const imageData = canvasContext.getImageData(
                    0,
                    0,
                    offscreenCanvas.width,
                    offscreenCanvas.height
                )
                const classificationResults =
                    await initialLoad.classify(imageData)
                let results = classificationResults.some(
                    (result) =>
                        ['Hentai', 'Porn', 'Sexy'].includes(result.className) &&
                        result.probability > 0.5
                )
                postMessage({ results })
            } else {
                throw new Error('Failed to get canvas context')
            }
        } catch (error) {
            console.error('Error processing image:', error)
            postMessage({ error: 'Error processing image' })
        }
    } else {
        postMessage({ error: 'Model not loaded yet.' })
    }
}
