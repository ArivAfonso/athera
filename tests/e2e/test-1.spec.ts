import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
    await page.getByText('See').first().click()
    await page.goto('https://www.athera.blog/')
    page.getByRole('heading', { name: "See What's happening in |" })
})
