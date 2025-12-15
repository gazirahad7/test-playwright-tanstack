import { expect, test } from '@playwright/test'

test('increment count', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  // Wait for hydration to complete
  await page.waitForLoadState('networkidle') // or domcontentloaded

  // Verify initial state
  await expect(page.getByText('Current Count: 0')).toBeVisible()

  // Click the button
  const button = page.getByRole('button', { name: 'Increment Count +' })
  // Click multiple times wait 2 seconds between clicks
  for (let i = 0; i < 5; i++) {
    await button.click()
    await page.waitForTimeout(200)
  }

  // Verify count updated
  await expect(page.getByText('Current Count: 5')).toBeVisible()
})
