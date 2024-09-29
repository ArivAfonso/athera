import { test, expect } from '@playwright/test'
import path from 'path'

test('new-post page', async ({ page }) => {
    await page.goto('/new-post')
    await page.waitForSelector('text=New post')

    // Select all the Tiptap editors and choose the first one
    const editors = await page.locator('.ProseMirror[contenteditable="true"]')

    // Wait for at least one editor to be visible
    await editors.first().waitFor()

    // Focus on the first editor
    await editors.first().click()

    // Type the title into the first editor
    await editors.first().fill('My Post Title')

    // Verify the title was typed into the first editor correctly
    const editorContent = await editors.first().innerText()
    expect(editorContent).toBe('My Post Title')

    // Select the input field using its placeholder
    const topicInput = await page.locator(
        'input[placeholder="Add topics (0/5)..."]'
    )

    // Add the first topic
    await topicInput.fill('Science')
    await topicInput.press('Enter')

    // Add the second topic
    await topicInput.fill('Music')
    await topicInput.press('Enter')

    // Add the third topic
    await topicInput.fill('Art')
    await topicInput.press('Enter')

    // Verify that the topics have been added by checking the visible buttons
    const addedTopics = await page.locator(
        'button:has-text("# Science"), button:has-text("# Music"), button:has-text("# Art")'
    )
    expect(await addedTopics.count()).toBe(3) // Expect 3 topics to be added

    // Locate the file input using its id
    const fileInput = await page.locator('input#file-upload')

    // Define the path to the image you want to upload
    const imagePath = path.resolve(__dirname, 'files/sample-image.png') // Use an actual image file path

    // Upload the image
    await fileInput.setInputFiles(imagePath)

    // Optionally, check that the file was uploaded (this depends on how your app handles uploads)
    await page.getByTitle('Delete image').isVisible()

    //Go to the second editor

    // Focus on the second editor
    await editors.nth(1).click()

    // Type the content into the second editor
    await editors.nth(1).fill('My Post Content')

    // Verify the content was typed into the second editor correctly
    const secondEditorContent = await editors.nth(1).innerText()
    expect(secondEditorContent).toBe('My Post Content')

    //Clik the .PostOptionsBtn button
    await page.click('.PostOptionsBtn')

    expect(await page.locator('text=Post options').isVisible()).toBeTruthy()

    //Fill a textarea with the text "My post description"
    await page.fill('textarea', 'My post description')

    //Click apply
    await page.click('text=Apply')

    //Click the Submit Post button
    await page.click('text=Submit Post')

    //Wait for the redirect to the post page
    await page.waitForURL('/post/')
})
