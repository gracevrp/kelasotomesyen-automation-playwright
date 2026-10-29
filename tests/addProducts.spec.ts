import { test, expect, Locator} from '@playwright/test';
import { login } from './helpers/login';

test.describe('Add Product', () => {
    let emptyMessage : Locator;
    let addFirstProductButton : Locator;
    let password : Locator;
    let konfirmasiPassword : Locator;
    let registerButton : Locator;
    let checkBox : Locator;
    
    test.beforeEach(async ({ page }) => {
        await login(page);
        emptyMessage = page.getByTestId('products-empty');
        addFirstProductButton = page.getByTestId('add-first-product-button');
    });

    test('add first product', async ({ page }) => {
        await expect(emptyMessage).toBeVisible({ timeout: 15_000 });

        if (await emptyMessage.isVisible()) {
            await addFirstProductButton.click();
        } else {
            await expect(addFirstProductButton).toBeHidden();
        }
    });
    
});