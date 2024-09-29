import { expect, test } from '@playwright/test'

test('test', async ({ page }) => {
    await page.goto('/import-export')

    // test('hashnode', async ({page}) => {
    //     // Click on the Hashnode button
    //     await page.click('text=Hashnode')

    //     expect(await page.locator('text=Hashnode Importer').isVisible()).toBeTruthy()

    //     // Fill in the Hashnode URL input field
    //     await page.locator('input[name="host"]').fill('https://hashnode.com/post/')

    //     // Click on the Next button
    //     await page.getByRole('button', {name: 'Next'}).click()

    //     // Wait for the next page to load
    //     await page.waitForSelector('text=Importing from Hashnode')
    // })

    test('dev.to', async ({ page }) => {
        // Click on the Dev.to button
        await page.click('text=Dev.to')

        expect(
            await page.locator('text=Dev.to Importer').isVisible()
        ).toBeTruthy()

        // Fill in the Dev.to URL input field
        await page.locator('input[name="username"]').fill('pabloabc')

        // Click on the Next button
        await page.getByRole('button', { name: 'Continue' }).click()

        // Wait for the next page to load
        await page.waitForSelector('text=Choose your posts')

        //Click submit
        await page.click('text=Submit')
        await page.goto('/dashboard/my-posts')

        // Check if the post was imported
        expect(
            await page.locator('text=My Post Title').isVisible()
        ).toBeTruthy()
    })
})
