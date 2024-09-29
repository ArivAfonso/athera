import * as nsfwjs from 'nsfwjs'

// This worker is dedicated to loading the NSFWJS model into IndexedDB

async function loadModelIntoIndexedDB() {
    let model: nsfwjs.NSFWJS | null = null
    try {
        // Attempt to load the model directly from IndexedDB first
        model = await nsfwjs.load('indexeddb://model')
    } catch (error) {
        // If the model is not found in IndexedDB, load it from the URL
        model = await nsfwjs.load()
        // Once loaded, save the model to IndexedDB for future use
        await model.model.save('indexeddb://model')
    }
    // Notify the main thread that the model has been loaded (or if it failed)
    if (model) {
        postMessage('Model successfully loaded into IndexedDB')
    } else {
        postMessage('Failed to load model into IndexedDB')
    }
}

// Start the model loading process when the worker is initialized
loadModelIntoIndexedDB()
