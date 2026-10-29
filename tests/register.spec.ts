import { test, expect, Locator} from '@playwright/test';
import { buatEmailUnik, ambilLinkKonfirmasi } from './helpers/email';

test.describe('register', () => {
    let namaLengkap : Locator;
    let email : Locator;
    let password : Locator;
    let konfirmasiPassword : Locator;
    let registerButton : Locator;
    let checkBox : Locator;
    
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByTestId('register-link').click();
        await expect(page).toHaveURL(/register/);
        
        namaLengkap = page.getByTestId('register-fullname-input');
        email = page.getByTestId('register-email-input');
        password = page.getByTestId('register-password-input');
        konfirmasiPassword = page.getByTestId('register-confirm-password-input');
        registerButton = page.getByTestId('register-submit-button');
        checkBox = page.getByTestId('register-terms-checkbox');
    });
    
    test('register unsuccessful (blank fields)', async ({ page }) => {
        // Input ditandai kosong padahal wajib diisi
        const isMissing = await namaLengkap.evaluate(
            (el: HTMLInputElement) => el.validity.valueMissing
        );
        expect(isMissing).toBe(true);
                await registerButton.click();

        await expect(page).toHaveURL(/\/register/);

    });

    test('register unsuccessful (password mismatch)', async ({ page }) => {
        await namaLengkap.fill('Data Testing');
        await email.fill('gracepanjaitan18@gmail.com');
        await password.fill('password123');
        await konfirmasiPassword.fill('password456');
        await registerButton.click();

        await checkBox.check();
        await expect(checkBox).toBeChecked();
        await registerButton.click();
        await expect(page.getByTestId('register-error')).toHaveText('Kata sandi tidak cocok');
    });

        test('register unsuccessful (checkbox does not checked)', async ({ page }) => {
        await namaLengkap.fill('Data Testing');
        await email.fill('gracepanjaitan18@gmail.com');
        await password.fill('password123');
        await konfirmasiPassword.fill('password456');
        await registerButton.click();

        await registerButton.click();
        await expect(page.getByTestId('register-error')).toHaveText('Anda harus menyetujui Syarat & Ketentuan');
    });

    test('register succesfull + email confirmation', async ({ page }) => {
        test.setTimeout(90_000);
        const emailBaru = buatEmailUnik();
        const successAlert = page.getByTestId('register-success');

        await namaLengkap.fill('Data Testing');
        await email.fill(emailBaru);
        await password.fill('password123');
        await konfirmasiPassword.fill('password123');
        await checkBox.check();
        await registerButton.click();

        await expect(successAlert).toContainText('Cek email Anda.');
        await expect(successAlert).toContainText(
            'Klik tombol konfirmasi di email, lalu kembali ke halaman masuk.');
        

        const link = await ambilLinkKonfirmasi(emailBaru);
         await page.goto(link);

        // sesuaikan dengan halaman tujuan setelah konfirmasi
         await expect(page).toHaveURL(/login/);
    });


    test('Already have an account', async ({ page }) => {
        await page.getByTestId('login-link').click();
        await expect(page).toHaveURL(/login/);
        await expect(page.getByTestId('login-title')).toHaveText('Lanjutkan sesi latihanmu');
    });

});