export default async function isImageFromUrl(url: string): Promise<boolean> {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/

    if (!urlPattern.test(url)) {
        return false
    }

    try {
        const response = await testImage(url, 5000)
        return response === 'success'
    } catch (error) {
        return false
    }
}

function testImage(url: string, timeoutT: number): Promise<string> {
    return new Promise(function (resolve, reject) {
        const timeout = timeoutT || 5000
        let timer: NodeJS.Timeout | null
        const img = new Image()

        img.onerror = img.onabort = function () {
            if (timer) clearTimeout(timer)
            reject('error')
        }

        img.onload = function () {
            if (timer) clearTimeout(timer)
            resolve('success')
        }

        timer = setTimeout(function () {
            if (timer) clearTimeout(timer)
            // reset .src to an invalid URL so it stops previous loading
            // but doesn't trigger a new load
            img.src = '//!!!!/test.jpg'
            reject('timeout')
        }, timeout)

        img.src = url
    })
}
