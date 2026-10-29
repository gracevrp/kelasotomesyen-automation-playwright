import { Page, expect } from '@playwright/test';

export async function login(page: Page) {
    const email = process.env.USER_EMAIL!;
    const password = process.env.USER_PASSWORD!;

    await page.goto('/login');
    await page.getByTestId('login-email-input').fill(email);
    await page.getByTestId('login-password-input').fill(password);
    await page.getByTestId('login-submit-button').click();
    await expect(page).toHaveURL(/products/);
}