import { test, expect } from '../../fixtures/auth.fixture';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { checkoutInfo, products } from '../../fixtures/test-data';

/**
 * Tugas 1 — Checkout E2E:
 * Login -> add 2 products -> Cart -> Checkout -> fill customer info ->
 * validate total price -> Finish -> validate success message.
 *
 * `loggedInPage` (from the auth fixture) already handles login and lands
 * on /inventory.html, so the spec starts from adding products.
 */
test.describe('Checkout E2E', () => {
  test('completes checkout for 2 products and validates the price total @smoke', async ({ loggedInPage }) => {
    const page = loggedInPage;
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    const productsToBuy = [products.backpack, products.bikeLight];

    // --- Add 2 products to the cart -------------------------------------
    let expectedSubtotal = 0;
    for (const productName of productsToBuy) {
      expectedSubtotal += await inventoryPage.getProductPrice(productName);
      await inventoryPage.addProductToCart(productName);
    }
    await expect(page.locator('.shopping_cart_badge')).toHaveText(String(productsToBuy.length));

    // --- Go to cart and confirm both items are present -------------------
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(productsToBuy.length);
    await expect(await cartPage.getItemNames()).toEqual(expect.arrayContaining(productsToBuy));

    // --- Checkout: step one (customer info) ------------------------------
    await cartPage.goToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await checkoutPage.fillCustomerInfo(
      checkoutInfo.valid.firstName,
      checkoutInfo.valid.lastName,
      checkoutInfo.valid.postalCode,
    );
    await checkoutPage.continueToOverview();

    // --- Checkout: step two (overview) — validate total price -----------
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutPage.overviewItems).toHaveCount(productsToBuy.length);

    const totals = await checkoutPage.getTotals();
    expect(totals.subtotal).toBeCloseTo(expectedSubtotal, 2);
    // saucedemo applies a fixed 8% tax rate on top of the subtotal.
    const expectedTax = Math.round(expectedSubtotal * 0.08 * 100) / 100;
    expect(totals.tax).toBeCloseTo(expectedTax, 2);
    const expectedTotal = Math.round((expectedSubtotal + expectedTax) * 100) / 100;
    expect(totals.total).toBeCloseTo(expectedTotal, 2);

    // --- Finish and validate the success message -------------------------
    await checkoutPage.finishOrder();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toBeVisible();
    expect(await checkoutPage.getCompletionMessage()).toBe('Thank you for your order!');
  });

  test('checkout step one rejects submission with missing customer info', async ({ loggedInPage }) => {
    const page = loggedInPage;
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.goToCart();
    await cartPage.goToCheckout();

    // Leave all fields empty and try to continue.
    await checkoutPage.continueToOverview();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    expect(await checkoutPage.getStepOneError()).toContain('First Name is required');
  });
});
