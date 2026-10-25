import { test, expect } from '../fixtures/test';

const MENS_SWEATERS = '/en/c/men-sweaters?q=:';

test.describe('Category page', () => {
  test('lists products with names and prices @smoke', async ({ page, category }) => {
    await category.open(MENS_SWEATERS);

    await expect(page).toHaveTitle(/Men's Sweaters/);
    await expect(category.productCount).toHaveText(/\d+ products/);
    expect(await category.productNames.count()).toBeGreaterThan(0);

    const prices = await category.tilePrices();
    for (const price of prices) expect(price).toBeGreaterThan(0);
  });

  test('sorts by price from low to high', async ({ category }) => {
    await category.open(MENS_SWEATERS);
    await category.sortBy('Price Low-High');

    const prices = await category.tilePrices();
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
