import { expect, request, test } from '@playwright/test'
import { uniqueId } from 'lodash'
const INBUCKET_URL = `http://localhost:54324`

// async function getResetPasswordEmail(username: string): Promise<{
//     url: string
// }> {
//     const requestContext = await request.newContext()
//     const messages = await requestContext
//         .get(`${INBUCKET_URL}/api/v1/mailbox/${username}`)
//         .then((res) => res.json())
//         // InBucket doesn't have any params for sorting, so here
//         // we're sorting the messages by date
//         .then((items) =>
//             [...items].sort((a, b) => {
//                 if (a.date < b.date) {
//                     return 1
//                 }

//                 if (a.date > b.date) {
//                     return -1
//                 }

//                 return 0
//             })
//         )

//     const latestMessageId = messages[0]?.id

//     if (latestMessageId) {
//         const message = await requestContext
//             .get(
//                 `${INBUCKET_URL}/api/v1/mailbox/${username}/${latestMessageId}`
//             )
//             .then((res) => res.json())

//         // We've got the latest email. We're going to use regular
//         // expressions to match the bits we need.

//         // match this text and extract url
//         // --------------\nReset password\n--------------\n\nFollow this link to reset the password for your user:\n\nReset password ( http://127.0.0.1:54321/auth/v1/verify?token=pkce_e2df68ace87a16abf48dd04aca116f9ee35612772ab190212a27ac88&type=recovery&redirect_to=http://localhost:3000/update-password )\n\nAlternatively, enter the code: 719963
//         const url = message.body.text.match(/Reset password \( (.+) \)/)[1]

//         return { url }
//     }

//     throw new Error('No email received')
// }

async function getConfirmEmail(username: string): Promise<{
    token: string
    url: string
}> {
    const requestContext = await request.newContext()
    const messages = await requestContext
        .get(`${INBUCKET_URL}/api/v1/mailbox/${username}`)
        .then((res) => res.json())
        // InBucket doesn't have any params for sorting, so here
        // we're sorting the messages by date
        .then((items) =>
            [...items].sort((a, b) => {
                if (a.date < b.date) {
                    return 1
                }

                if (a.date > b.date) {
                    return -1
                }

                return 0
            })
        )

    const latestMessageId = messages[0]?.id

    if (latestMessageId) {
        const message = await requestContext
            .get(
                `${INBUCKET_URL}/api/v1/mailbox/${username}/${latestMessageId}`
            )
            .then((res) => res.json())

        // We've got the latest email. We're going to use regular
        // expressions to match the bits we need.
        const token = message.body.text.match(/enter the code: ([0-9]+)/)[1]
        const url = message.body.text.match(/Log In \( (.+) \)/)[1]

        return { token, url }
    }

    throw new Error('No email received')
}

test.describe('authentication works correctly', () => {
    test('login works correctly', async ({ page }) => {
        await page.goto(`/login`)

        // Input email value in the input field
        await page.locator('input[name="email"]').fill('AN EMAIL ADDRESS')

        // Input password value in the input field
        await page.locator('input[name="password"]').fill('password')

        // Click on the button with text "Continue"
        await page.getByRole('button', { name: 'Continue' }).click()

        // Expect page to redirect to /dashboard
        await page.waitForURL(`/`)
    })

    test('logout works correctly', async ({ page }) => {
        await page.goto('/')
        await page.locator('button:has-text("Log out")').click()
        await page.waitForSelector('text=Sign Up')
    })

    // test('update password should work', async ({ page }) => {
    //     // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
    //     await page.goto('/dashboard')

    //     await page.goto(`/settings/security`)

    //     // read email value in the input field
    //     const emailInput = page.locator('input[name="email"]')
    //     const email = await emailInput.getAttribute('value')
    //     if (!email) {
    //         throw new Error('Email is empty')
    //     }
    //     const newPassword = `password-${uniqueId()}`

    //     await page.fill('input[name="password"]', newPassword)
    //     await page.click('button:has-text("Update Password")')

    //     await page.waitForSelector('text=Password updated!')

    //     await page.goto(`/logout`)

    //     await page.goto(`/login`)

    //     await page.fill('input[data-strategy="email-password"]', email)
    //     // fill in the password
    //     await page.fill('input[name="password"]', newPassword)

    //     // click on button with text exact: Login
    //     await page.click('button:text-is("Login")')
    //     await page.waitForSelector('text=Logged in!')

    //     await page.waitForURL(`/dashboard`)
    // })

    // test('forgot password works correctly', async ({ page }) => {
    //     // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
    //     const constants = {
    //         resetPasswordConfirmation:
    //             'A password reset link has been sent to your email!',
    //         resetPasswordButtonlabel: 'Reset password',
    //         confirmPasswordButtonLabel: 'Confirm Password',
    //     }

    //     await page.goto(`/settings/security`)

    //     // read email value in the input field
    //     const emailInput = page.locator('input[name="email"]')
    //     const email = await emailInput.getAttribute('value')

    //     await page.goto(`/logout`)

    //     await page.goto(`/forgot-password`)

    //     if (!email) {
    //         throw new Error('Email is empty')
    //     }

    //     // fill in the email
    //     await page.fill('input[name="email"]', email)

    //     // click button with text Reset password
    //     await page.click(
    //         `button:has-text("${constants.resetPasswordButtonlabel}")`
    //     )

    //     await page.waitForSelector(
    //         `text=${constants.resetPasswordConfirmation}`
    //     )

    //     const identifier = email.split('@')[0]
    //     let url
    //     await expect
    //         .poll(
    //             async () => {
    //                 try {
    //                     const { url: urlFromCheck } =
    //                         await getResetPasswordEmail(identifier)
    //                     url = urlFromCheck
    //                     return typeof urlFromCheck
    //                 } catch (e) {
    //                     return null
    //                 }
    //             },
    //             {
    //                 message: 'make sure the email is received',
    //                 intervals: [1000, 2000, 5000, 10000, 20000],
    //             }
    //         )
    //         .toBe('string')

    //     // await page.goto(url);

    //     await page.waitForURL(`/update-password`)

    //     // wait for text = Reset Password
    //     await page.waitForSelector(`text=${constants.resetPasswordButtonlabel}`)

    //     // fill in a new password in the input field with name password
    //     const newPassword = 'password'
    //     await page.fill('input[name="password"]', newPassword)

    //     // click on button with text Confirm Password
    //     await page.click(
    //         `button:has-text("${constants.confirmPasswordButtonLabel}")`
    //     )

    //     await page.waitForURL(`/dashboard`)

    //     await page.goto(`/logout`)

    //     await page.goto(`/login`)

    //     // find form element with data-testid password-form
    //     const form = await page.waitForSelector(
    //         'form[data-testid="password-form"]'
    //     )
    //     const emailInput2 = await form.$(
    //         'input[data-strategy="email-password"]'
    //     )
    //     const passwordInput = await form.$('input[name="password"]')

    //     if (!emailInput2) {
    //         throw new Error('Email input is empty')
    //     }

    //     if (!passwordInput) {
    //         throw new Error('Password input is empty')
    //     }

    //     await emailInput2.fill(email)
    //     // fill in the password
    //     await passwordInput.fill(newPassword)

    //     // click on button of type submit in form
    //     const submitButton = await form.waitForSelector('button[type="submit"]')

    //     if (!submitButton) {
    //         throw new Error('Submit button is empty')
    //     }

    //     await submitButton.click()

    //     await page.waitForURL(`/dashboard`)

    //     await page.goto(`/settings/security`)
    // })
})
