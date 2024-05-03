import { expect, test } from '@playwright/test'

test.describe('Home: /', () => {
    test('should navigate to the Feedback page', async ({ page }) => {
        await page.goto('/')
        await page.click('text=Get in touch!')

        await expect(page).toHaveURL('http://localhost:3000/feedback')
        await expect(page.locator('h1')).toContainText("Let's get in touch!")
    })
})
