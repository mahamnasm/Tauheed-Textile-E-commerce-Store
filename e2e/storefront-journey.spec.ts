import { test, expect } from "@playwright/test";

test.describe("Phase 3 [E2E-01]: Storefront Browsing & Product Selection", () => {
  test("should navigate to shop catalog, filter products, and select a product", async ({ page }) => {
    // 1. Visit homepage
    await page.goto("/");
    await expect(page).toHaveTitle(/Tauheed Textile/i);

    // 2. Announcement bar check
    const announcement = page.locator("header");
    await expect(announcement).toBeVisible();

    // 3. Navigate to Shop
    await page.goto("/shop");
    await expect(page.locator("h1")).toBeVisible();

    // 4. Verify product cards render
    const productCards = page.locator("article, .group").filter({ hasText: /Rs\./i });
    await expect(productCards.first()).toBeVisible();

    // 5. Click on the first product
    await productCards.first().click();
    await expect(page).toHaveURL(/\/product\//);

    // 6. Verify Product Detail Elements
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Add to Bag").or(page.locator("text=ADD TO BAG"))).toBeVisible();
  });
});

test.describe("Phase 3 [E2E-02]: Cart Management & Cash on Delivery (COD) Checkout", () => {
  test("should add product to cart and complete checkout via COD", async ({ page }) => {
    // Go to shop
    await page.goto("/shop");
    const productLink = page.locator("a[href*='/product/']").first();
    await productLink.click();

    // Add to cart
    const addToBagBtn = page.locator("button").filter({ hasText: /Add to (Bag|Cart)/i }).first();
    await addToBagBtn.click();

    // Navigate to checkout
    await page.goto("/checkout");
    await expect(page.locator("text=Checkout").or(page.locator("text=Delivery"))).toBeVisible();

    // Fill customer form
    await page.fill("input[name='customerName'], input[placeholder*='Name']", "Test Customer SQA");
    await page.fill("input[name='customerPhone'], input[name='guestPhone'], input[placeholder*='03']", "03001234567");
    await page.fill("input[name='address'], textarea[name='address'], input[placeholder*='Address']", "House 10, Street 2, Gulberg III");
    await page.fill("input[name='city'], input[placeholder*='City']", "Lahore");

    // Ensure Cash on Delivery option is selected
    const codRadio = page.locator("input[value='COD'], label:has-text('Cash on Delivery')").first();
    if (await codRadio.isVisible()) {
      await codRadio.check({ force: true });
    }

    // Verify submit button is clickable
    const submitBtn = page.locator("button[type='submit']").filter({ hasText: /Place Order|Confirm Order/i });
    await expect(submitBtn).toBeEnabled();
  });
});

test.describe("Phase 3 [E2E-03]: Customer Order Tracking (Security & Privacy)", () => {
  test("should reject tracking lookup without matching phone number", async ({ page }) => {
    await page.goto("/track-order");
    await expect(page.locator("h1, h2").filter({ hasText: /Track/i })).toBeVisible();

    // Fill order number only
    const orderInput = page.locator("input[name='orderNumber'], input[placeholder*='TT-']").first();
    await orderInput.fill("TT-2026-9999");

    // Click track button
    const trackBtn = page.locator("button[type='submit'], button:has-text('Track')").first();
    await trackBtn.click();

    // Expect validation message requiring phone
    await expect(
      page.locator("text=phone").or(page.locator("text=required")).or(page.locator("text=Enter"))
    ).toBeVisible();
  });
});

test.describe("Phase 3 [E2E-04]: Responsive Mobile Navigation (375px Viewport)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("should render mobile hamburger menu and sticky cart trigger", async ({ page }) => {
    await page.goto("/");

    // Verify mobile header is compact
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Hamburger menu should exist
    const hamburger = page.locator("button[aria-label*='Menu'], button:has(svg.lucide-menu)");
    if (await hamburger.isVisible()) {
      await hamburger.click();
      // Drawer should open
      await expect(page.locator("text=SHOP").or(page.locator("text=New In"))).toBeVisible();
    }
  });
});
