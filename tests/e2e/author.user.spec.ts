import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
    await page.goto('/author/Ariv')
    await page.waitForSelector('text=Ariv Afonso')

    //Click the follow button
    await page.click('text=Follow')
    await page.waitForSelector('text=Following')

    //Click the very first button that has PostCardLikeAction class
    await page.click('.PostCardLikeAction')

    //Check if the button has the text "1 like"
    await page.getByTitle('Unlike').isVisible()

    //Click the button with the text "Unlike"
    await page.getByTitle('Unlike').click()

    await page.goto('/')
})
