import { expect, request, test as setup } from '@playwright/test'

const INBUCKET_URL = `http://localhost:54324`

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
        const url = message.body.text.match(
            /Confirm your email address \( (.+) \)/
        )[1]

        return { token, url }
    }

    throw new Error('No email received')
}

function getIdentifier(): string {
    return `johndoe` + Date.now().toString().slice(-4)
}

setup('create account', async ({ page }) => {
    const identifier = getIdentifier()
    const emailAddress = `${identifier}@myapp.com`
    // Perform authentication steps. Replace these actions with your own.
    await page.goto('/signup')

    await page.locator('input[name="username"]').fill('TestUser')

    await page.getByRole('button', { name: 'Next Step' }).click()

    await page.locator('input[name="full_name"]').fill('Thomas Vaz')
    await page.locator('input[name="email"]').fill(emailAddress)
    await page.locator('input[name="password"]').fill('password')

    await page.getByRole('button', { name: 'Continue' }).click()

    // check for this text - Check your inbox. We just sent you an email
    await page.waitForSelector(
        'text=Check your inbox. We just sent you an email'
    )
    let url
    await expect
        .poll(
            async () => {
                try {
                    const { url: urlFromCheck } =
                        await getConfirmEmail(identifier)
                    url = urlFromCheck
                    return typeof urlFromCheck
                } catch (e) {
                    return null
                }
            },
            {
                message: 'make sure the email is received',
                intervals: [1000, 2000, 5000, 10000, 20000],
            }
        )
        .toBe('string')

    await page.getByRole('button', { name: 'Update Account' }).click()
    await page.goto('/login')
    await page.waitForURL('/')
})
