import { test, expect } from '../fixtures/test';

test.describe('Homepage', () => {
  test('loads with the brand title, shipping offer, and an empty bag @smoke @mobile', async ({ page, home }) => {
    await home.open();

    await expect(page).toHaveTitle(/Tommy Bahama/);
    await expect(page.getByText('Free Shipping on Orders $150+').first()).toBeAttached();
    await expect(home.bagSummary).toHaveText('My Bag (0 Items)');
  });

  test('shows the main shopping categories in the header @smoke', async ({ home }) => {
    await home.open();

    for (const category of ['Women', 'Men', 'Big & Tall', 'Swim', 'Beach & Home']) {
      await expect(home.topNavLink(category), `${category} link`).toBeVisible();
    }
  });

  test('lets keyboard users skip straight to the main content', async ({ page, home }) => {
    await home.open();

    await expect(home.skipToMain).toHaveAttribute('href', '#main');
    await expect(page.locator('#main')).toBeAttached();
  });

  test('navigates from the Men link to a category with products', async ({ page, home, category }) => {
    await home.open();
    await home.topNavLink('Men').click();

    await expect(page).toHaveURL(/\/en\/c\/men-/);
    await expect(category.productNames.first()).toBeVisible();
  });
});
