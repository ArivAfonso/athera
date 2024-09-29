import { test, expect } from '@playwright/test'

test.describe('Post Page', () => {
    test('should display content on a specific post page', async ({ page }) => {
        // Navigate to the specific post page
        await page.goto('/path/to/specific/post/page')

        // Check if the header is visible
        await expect(page.locator('header.container')).toBeVisible()

        //Check if the post title is avaible in an h1 title attribute
        await expect(page.locator('.PostTitle h1')).toBeVisible()
        const title = await page.locator('.PostTitle h1').textContent()

        // Check if the post content is visible
        await expect(page.locator('.PostContent')).toBeVisible()

        // Check if the post author is visible
        await expect(page.locator('.PostMeta2')).toBeVisible()

        //Click the PostCardLikeAction button
        await page.locator('.PostCardLikeAction').click()

        // Check if the post is liked
        expect(page.locator('.PostCardLikeAction').textContent()).toContain(
            'Unlike'
        )

        //Click the BookmarkBtnButton button
        await page.locator('.BookmarkBtn').click()

        // Check if the post is bookmarked (svg icon should be filled)
        expect(page.locator('.BookmarkBtn svg').getAttribute('fill')).toBe(
            'currentColor'
        )

        //Fill the SingleCommentForm with a comment
        await page
            .locator('.SingleCommentForm textarea')
            .fill('This is a comment')

        //Click the submit button
        await page
            .locator('.SingleCommentForm button', { hasText: 'Submit' })
            .click()
    })
})
