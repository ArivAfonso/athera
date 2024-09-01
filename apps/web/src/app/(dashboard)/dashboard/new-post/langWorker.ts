// langWorker.ts
import { pipeline } from '@xenova/transformers'

self.onmessage = async (event: MessageEvent) => {
    const text = event.data
    if (!text) {
        self.postMessage([{ label: 'toxic', score: 0 }])
        return
    }
    const classifier = await pipeline(
        'text-classification',
        'Xenova/toxic-bert'
    )
    const results = await classifier(text)
    self.postMessage(results)
}
