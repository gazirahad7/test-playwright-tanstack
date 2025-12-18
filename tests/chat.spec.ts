import { expect, test } from '@playwright/test'

test('should send a message and receive a response', async ({ page }) => {
  // Navigate to the chat page
  await page.goto('http://localhost:3000/chat')

  await page.waitForLoadState('networkidle')

  // Wait for the page to load and verify we're on the chat page
  await expect(page.locator('#chat-title')).toBeVisible()

  // Verify the welcome message is displayed initially
  await expect(
    page.locator("text=👋 Hello! I'm your AI assistant"),
  ).toBeVisible()

  // Find the textarea input
  const textarea = page.locator('textarea[placeholder="Ask me anything..."]')
  await expect(textarea).toBeVisible()

  // Type the message
  const testMessage = 'Can you list 10 todos if completed?'
  await textarea.fill(testMessage)

  // Find and click the send button - use a more specific selector
  // The send button is the one with gradient background classes next to the textarea
  const sendButton = page
    .locator('button.bg-gradient-to-br.from-blue-600')
    .first()
  await sendButton.click()

  // Verify the user message appears in the chat
  // await expect(page.locator(`text=${testMessage}`)).toBeVisible()

  // Wait for the loading indicator to appear
  await expect(page.locator('text=Thinking...')).toBeVisible()

  // Wait for the loading indicator to disappear (response received)
  await expect(page.locator('text=Thinking...')).not.toBeVisible({
    timeout: 30000,
  })

  // Verify that an assistant response appears
  // Look for the bot avatar in the response (not in the header)
  const assistantMessages = page.locator(
    '.flex.gap-4.flex-row .bg-white.rounded-3xl',
  )
  await expect(assistantMessages.last()).toBeVisible()

  // Verify the assistant response has content
  const lastAssistantMessage = assistantMessages.last()
  await expect(lastAssistantMessage).not.toBeEmpty()

  // Optional: Check that the response contains some text (at least a few characters)
  const responseText = await lastAssistantMessage.textContent()
  expect(responseText?.length).toBeGreaterThan(5)

  // Verify the input is cleared after sending
  await expect(textarea).toHaveValue('')
})
