import { test, expect } from '../fixtures/test';

// Products sell out, so start from the category page instead of hard-coding a SKU.
test.beforeEach(async ({ category }) => {
  await category.open('/en/c/men-sweaters?q=:');
  await category.openProduct(0);
});

test.describe('Product page', () => {
  test('shows name, price, color, and size choices @smoke @mobile', async ({ product }) => {
    await expect(product.name).not.toBeEmpty();
    await expect(product.price).toHaveText(/^\$\d[\d,]*\.\d{2}$/);
    expect(await product.colorOptions.count()).toBeGreaterThan(0);
    expect(await product.sizeOptions.count()).toBeGreaterThan(0);
    await expect(product.addToBag).toBeEnabled();
  });

  test('asks for a size before adding to the bag', async ({ product }) => {
    await expect(product.sizeError).toBeHidden();

    await product.addToBag.click();

    await expect(product.sizeError).toBeVisible();
    await expect(product.sizeError).toHaveText('Please select a size.');
    await expect(product.bagSummary).toHaveText('My Bag (0 Items)');
  });

  test('marks the chosen size as selected', async ({ product }) => {
    const firstSize = product.sizeOptions.first();
    await firstSize.click();

    await expect(firstSize).toHaveAttribute('aria-checked', 'true');
    await expect(product.selectedSizes).toHaveCount(1);
  });
});
