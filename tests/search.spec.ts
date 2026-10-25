import { test, expect } from '../fixtures/test';

test.describe('Search', () => {
  test('returns relevant products for a header search @smoke @mobile', async ({ page, home, search }) => {
    await home.open();
    await home.searchFor('linen shirt');

    await expect(page).toHaveURL(/\/search\?text=linen\+shirt/);
    expect(await search.resultCount()).toBeGreaterThan(0);

    // Relevance check: most of the first page should be linen products.
    const names = await search.productNames.allInnerTexts();
    const linen = names.filter((n) => /linen/i.test(n));
    expect(linen.length / names.length, `linen share of: ${names.join(' | ')}`).toBeGreaterThanOrEqual(0.5);
  });

  test('tells the shopper when nothing matches', async ({ search }) => {
    await search.open('zzqxvbnm');

    await expect(search.resultsSummary).toContainText('0 results');
    await expect(search.noResultsMessage).toBeVisible();
    await expect(search.productNames).toHaveCount(0);
  });
});
