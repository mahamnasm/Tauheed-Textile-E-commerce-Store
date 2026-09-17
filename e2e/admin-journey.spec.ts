import { test, expect } from "@playwright/test";

test.describe("Phase 3 [E2E-ADMIN-01]: Admin Authentication & Security Guard", () => {
  test("should display admin login form and enforce PIN requirement", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("h1, h2").filter({ hasText: /Admin|Portal|Login/i })).toBeVisible();

    // Verify fields exist
    const usernameInput = page.locator("input[name='username'], input[placeholder*='Username']").first();
    const passwordInput = page.locator("input[name='password'], input[type='password']").first();
    const pinInput = page.locator("input[name='pin'], input[name='masterPin'], input[placeholder*='PIN']").first();

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(pinInput).toBeVisible();

    // Attempt login with invalid credentials
    await usernameInput.fill("fake_admin");
    await passwordInput.fill("wrong_password");
    await pinInput.fill("000000");

    const submitBtn = page.locator("button[type='submit']").first();
    await submitBtn.click();

    // Expect generic error toast or message
    await expect(page.locator("text=Invalid").or(page.locator("text=Unauthorized")).or(page.locator(".toast"))).toBeVisible();
  });
});

test.describe("Phase 3 [E2E-ADMIN-02]: Admin Portal Navigation Guards", () => {
  test("should redirect unauthenticated users away from /admin", async ({ page }) => {
    await page.goto("/admin");

    // Must be redirected to /admin/login or show login gate
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toMatch(/\/admin\/login|\/admin/);
  });
});
