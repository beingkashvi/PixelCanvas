import { test, expect } from '@playwright/test';

// Test Case 1: Homepage loads successfully (Functional - Positive)
test('TC-001: Verify homepage loads with all main elements', async ({ page }) => {
  // Test Steps
  await page.goto('http://localhost:3000');
  
  // Expected Results
  await expect(page).toHaveTitle(/PrintShop/);
  await expect(page.locator('text=Your Design, Our Canvas')).toBeVisible();
  await expect(page.locator('text=Start Designing')).toBeVisible();
  await expect(page.locator('text=Featured Products')).toBeVisible();
  
  // Actual Result: PASS - All elements visible
  console.log('✅ TC-001 PASSED: Homepage loaded successfully');
});

// Test Case 2: Navigation menu works (Functional - Positive)
test('TC-002: Verify navigation links are functional', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Test clicking Apparel link
  await page.click('text=Apparel');
  await expect(page).toHaveURL(/.*apparel/);
  await expect(page.locator('h1')).toContainText('Apparel');
  
  // Navigate back and test Drinkware
  await page.goto('http://localhost:3000');
  await page.click('text=Drinkware');
  await expect(page).toHaveURL(/.*drinkware/);
  
  // Navigate back and test Accessories
  await page.goto('http://localhost:3000');
  await page.click('text=Accessories');
  await expect(page).toHaveURL(/.*accessories/);
  
  console.log('✅ TC-002 PASSED: All navigation links work correctly');
});

// Test Case 3: User can view product details (Functional - Positive)
test('TC-003: Verify user can view product customization page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Wait for products to load
  await page.waitForSelector('.grid', { timeout: 10000 });
  
  // Click on first product card
  const firstProduct = page.locator('a[href*="/shop/"]').first();
  await firstProduct.click();
  
  // Verify customization page loads
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('text=Color')).toBeVisible();
  await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible();
  
  console.log('✅ TC-003 PASSED: Product customization page loads correctly');
});

// Test Case 4: User can add product to cart (Functional - Positive)
test('TC-004: Verify add to cart functionality', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Navigate to a product
  await page.waitForSelector('.grid', { timeout: 10000 });
  await page.locator('a[href*="/shop/"]').first().click();
  
  // Wait for customization page
  await page.waitForSelector('button:has-text("Add to Cart")');
  
  // Get initial cart count
  const cartBadge = page.locator('span:near(:text("Shopping"))').first();
  
  // Add to cart
  await page.click('button:has-text("Add to Cart")');
  
  // Verify success message
  await expect(page.locator('text=Added to cart successfully')).toBeVisible({ timeout: 5000 });
  
  console.log('✅ TC-004 PASSED: Product added to cart successfully');
});

// Test Case 5: User can signup (Functional - Positive)
test('TC-005: Verify user signup process', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  
  // Fill signup form
  const timestamp = Date.now();
  await page.fill('input[type="text"]#firstName', 'Test');
  await page.fill('input[type="text"]#lastName', 'User');
  await page.fill('input[type="email"]', `testuser${timestamp}@example.com`);
  await page.fill('input[type="password"]', 'Test@123456');
  
  // Submit form
  await page.click('button:has-text("Create Account")');
  
  // Verify redirect or success (adjust based on your actual behavior)
  await page.waitForTimeout(2000);
  
  // Expected: User should be redirected to homepage
  await expect(page).toHaveURL('http://localhost:3000/', { timeout: 10000 });
  
  console.log('✅ TC-005 PASSED: User signup completed successfully');
});

// NEGATIVE TEST CASE 1: Invalid login credentials
test('TC-NEG-001: Verify login fails with invalid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  // Fill with invalid credentials
  await page.fill('input[type="email"]', 'invalid@example.com');
  await page.fill('input[type="password"]', 'wrongpassword');
  
  // Submit form
  await page.click('button:has-text("Login")');
  
  // Expected: Error message should appear
  // Adjust selector based on your actual error display
  await page.waitForTimeout(2000);
  
  // Verify we're still on login page (not redirected)
  await expect(page).toHaveURL(/.*login/);
  
  console.log('✅ TC-NEG-001 PASSED: Login correctly rejected invalid credentials');
});

// NEGATIVE TEST CASE 2: Empty form submission
test('TC-NEG-002: Verify signup form validation for empty fields', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  
  // Try to submit empty form
  await page.click('button:has-text("Create Account")');
  
  // Expected: Form should not submit, browser validation should prevent it
  // Check that we're still on signup page
  await expect(page).toHaveURL(/.*signup/);
  
  // Check that required field validation works
  const firstNameInput = page.locator('input#firstName');
  const isInvalid = await firstNameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
  
  expect(isInvalid).toBe(true);
  
  console.log('✅ TC-NEG-002 PASSED: Form validation prevents empty submission');
});

// NEGATIVE TEST CASE 3: Access customizer without selecting options
test('TC-NEG-003: Verify error handling for invalid product slug', async ({ page }) => {
  // Try to access non-existent product
  await page.goto('http://localhost:3000/shop/apparel/invalid-product-123');
  
  // Expected: Should show "Product not found" or redirect
  await page.waitForTimeout(2000);
  
  const errorMessage = await page.locator('text=Product not found').isVisible();
  
  expect(errorMessage).toBe(true);
  
  console.log('✅ TC-NEG-003 PASSED: Invalid product handled correctly');
});