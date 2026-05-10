import { test, expect } from '@playwright/test';

/**
 * INTENTIONAL_VULN_XSS — client/src/components/NoteBody.jsx (raw innerHTML when /api/health reports vulnerableMode)
 * Expectation: fixed build keeps the probe unset. Vulnerable build executes onerror → test fails.
 */
test.describe('Stored XSS (note rendering)', () => {
  test('does not execute inline handlers from note body', async ({ page }) => {
    const user = `pw_${Date.now()}`;
    const pass = 'pwpassword1!';

    await page.goto('/register');
    await page.getByLabel(/username/i).fill(user);
    await page.getByLabel(/password/i).fill(pass);
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page).toHaveURL(/\/app/);

    const payload = `<img src=x onerror="document.documentElement.setAttribute('data-sv-xss','1')">`;

    await page.getByLabel('Title').fill('XSS probe');
    await page.getByLabel('Body').fill(payload);
    await page.getByRole('button', { name: /save note/i }).click();

    await page.getByRole('link', { name: /XSS probe/i }).click();
    await expect(page).toHaveURL(/\/app\/notes\//);

    const articleText = await page.locator('article').innerText();
    // Fixed UI escapes HTML into text nodes, so the literal tag sequence remains visible.
    // Vulnerable UI parses HTML; the angle-bracket payload should not survive as plain text.
    expect(articleText).toMatch(/<img\s+src=x/i);
  });
});
