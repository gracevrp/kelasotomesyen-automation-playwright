import { test, expect} from '@playwright/test';

test('login successful', async ({ page }) => {
    const email = process.env.USER_EMAIL!;
    const password = process.env.USER_PASSWORD!;

    await page.goto('https://test.kelasotomesyen.com/login');
    await page.getByTestId('login-email-input').fill(email);
    await page.getByTestId('login-password-input').fill(password);
    await page.getByTestId('login-submit-button').click();

    await expect(page).toHaveURL(/\/products/);

});

test('login unsuccessful (invalid email)', async ({ page }) => {
        
    const password = process.env.USER_PASSWORD!;
    
    await page.goto('https://test.kelasotomesyen.com/login');
    await page.getByTestId('login-email-input').fill('gracepanjaitan@gmail.com');
    await page.getByTestId('login-password-input').fill(password);
    await page.getByTestId('login-submit-button').click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-error')).toHaveText('Invalid login credentials');

});

test('login unsuccessful (invalid password)', async ({ page }) => {
        
    const email = process.env.USER_EMAIL!;
    
    await page.goto('https://test.kelasotomesyen.com/login');
    await page.getByTestId('login-email-input').fill(email);
    await page.getByTestId('login-password-input').fill('grace123');
    await page.getByTestId('login-submit-button').click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-error')).toHaveText('Invalid login credentials');

});

test('email kosong ditolak oleh validasi browser', async ({ page }) => {
  await page.goto('/login');

  const emailInput = page.getByTestId('login-email-input');

  await page.getByTestId('login-submit-button').click();

  // Input ditandai kosong padahal wajib diisi
  const isMissing = await emailInput.evaluate(
    (el: HTMLInputElement) => el.validity.valueMissing
  );
  expect(isMissing).toBe(true);

  // Form tidak terkirim
  await expect(page).toHaveURL(/login/);
});