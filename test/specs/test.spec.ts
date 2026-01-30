const LoginPage = require('../pageobjects/login.page');
const InventoryPage = require('../pageobjects/inventory.page');
const CartPage = require('../pageobjects/cart.page');
const ProductDetailsPage = require('../pageobjects/productDetails.page');
const fs = require('fs');
const path = require('path');

describe('Tests', () => {
    
    before(async () => {
        const screenshotsDir = path.join(process.cwd(), 'test', 'screenshots');
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }
    });

    beforeEach(async () => {
        await LoginPage.open();
        await browser.maximizeWindow();
    });

    afterEach(async function() {
        const testName = this.currentTest.title.replace(/\s+/g, '-').toLowerCase();
        const screenshotsDir = path.join(process.cwd(), 'test', 'screenshots');
        const screenshotPath = path.join(screenshotsDir, `${testName}.png`);
        await browser.saveScreenshot(screenshotPath);
    });

    describe('Autorization', () => {
        
        it('Test 1: Login with valid credentials @smoke @login @positive', async () => {
            await LoginPage.login('standard_user', 'secret_sauce');
            
            await InventoryPage.pageTitle.waitForDisplayed({ timeout: 5000 });

            const url = await browser.getUrl();
            expect(url).toContain('/inventory.html');

            const title = await InventoryPage.pageTitle.getText();
            expect(title).toBe('Products');
            
            const isTitleVisible = await InventoryPage.pageTitle.isDisplayed();
            expect(isTitleVisible).toBe(true);

            await InventoryPage.shoppingCart.waitForDisplayed({ timeout: 5000 });
            const isCartVisible = await InventoryPage.shoppingCart.isDisplayed();
            expect(isCartVisible).toBe(true);

            const items = await InventoryPage.allItems;
            expect(items.length).toBe(6);
        });

        it('Test 2: Show error with invalid credentials @login @negative @validation', async () => {
            await LoginPage.login('invalid_user', 'wrong_password');

            await LoginPage.errorMessage.waitForDisplayed({ timeout: 5000 });

            const isErrorVisible = await LoginPage.errorMessage.isDisplayed();
            expect(isErrorVisible).toBe(true);

            const errorText = await LoginPage.errorMessage.getText();
            expect(errorText).toContain('Username and password do not match');
        });
    });

    describe('Cart functionality', () => {
        
        beforeEach(async () => {
            await LoginPage.login('standard_user', 'secret_sauce');
            await InventoryPage.pageTitle.waitForDisplayed({ timeout: 5000 });
        });

        afterEach(async () => {
            await browser.reloadSession();
        });

        it('Test 3: Add item to cart @smoke @cart @positive', async () => {
            await InventoryPage.addItemToCart('sauce-labs-backpack');
            
            await InventoryPage.cartBadge.waitForDisplayed({ timeout: 5000 });

            const isBadgeVisible = await InventoryPage.cartBadge.isDisplayed();
            expect(isBadgeVisible).toBe(true);

            const badgeText = await InventoryPage.cartBadge.getText();
            expect(badgeText).toBe('1');

            await InventoryPage.goToCart();
            
            await browser.waitUntil(
                async () => (await browser.getUrl()).includes('/cart.html'),
                { timeout: 5000, timeoutMsg: 'Cart page did not load' }
            );

            const url = await browser.getUrl();
            expect(url).toContain('/cart.html');

            const items = await CartPage.items;
            expect(items.length).toBe(1);

            const names = await CartPage.itemNames;
            await names[0].waitForDisplayed({ timeout: 5000 });
            
            const itemName = await names[0].getText();
            expect(itemName).toContain('Sauce Labs Backpack');

            const prices = await CartPage.itemPrices;
            await prices[0].waitForDisplayed({ timeout: 5000 });
            const itemPrice = await prices[0].getText();
            expect(itemPrice).toContain('$29.99');
        });

        it('Test 4: Open product details and verify information @product @details @positive', async () => {
            await InventoryPage.openItem(4);
            
            await ProductDetailsPage.productName.waitForDisplayed({ timeout: 5000 });

            const url = await browser.getUrl();
            expect(url).toContain('/inventory-item.html?id=4');

            const isNameVisible = await ProductDetailsPage.productName.isDisplayed();
            expect(isNameVisible).toBe(true);

            const name = await ProductDetailsPage.productName.getText();
            expect(name).toContain('Sauce Labs Backpack');

            await ProductDetailsPage.productDescription.waitForDisplayed({ timeout: 5000 });
            const isDescVisible = await ProductDetailsPage.productDescription.isDisplayed();
            expect(isDescVisible).toBe(true);

            const description = await ProductDetailsPage.productDescription.getText();
            expect(description.length).toBeGreaterThan(0);

            await ProductDetailsPage.productPrice.waitForDisplayed({ timeout: 5000 });
            const isPriceVisible = await ProductDetailsPage.productPrice.isDisplayed();
            expect(isPriceVisible).toBe(true);

            const price = await ProductDetailsPage.productPrice.getText();
            expect(price).toContain('$29.99');

            await ProductDetailsPage.addToCartButton.waitForDisplayed({ timeout: 5000 });
            const isButtonVisible = await ProductDetailsPage.addToCartButton.isDisplayed();
            expect(isButtonVisible).toBe(true);

            const buttonText = await ProductDetailsPage.addToCartButton.getText();
            expect(buttonText).toMatch(/Add to cart|Remove/);
        });

        it('Test 5: Remove item from cart @cart @remove @positive', async () => {
            await InventoryPage.addItemToCart('sauce-labs-backpack');
            
            await InventoryPage.cartBadge.waitForDisplayed({ timeout: 5000 });

            let badgeText = await InventoryPage.cartBadge.getText();
            expect(badgeText).toBe('1');

            await InventoryPage.goToCart();
            
            await browser.waitUntil(
                async () => (await browser.getUrl()).includes('/cart.html'),
                { timeout: 5000 }
            );

            let items = await CartPage.items;
            expect(items.length).toBe(1);

            await CartPage.removeItem('sauce-labs-backpack');
            
            await browser.waitUntil(
                async () => (await CartPage.items).length === 0,
                { timeout: 5000, timeoutMsg: 'Item was not removed from cart' }
            );

            items = await CartPage.items;
            expect(items.length).toBe(0);

            const isBadgeVisible = await InventoryPage.cartBadge.isDisplayed()
                .catch(() => false);
            expect(isBadgeVisible).toBe(false);
        });
    });
});
