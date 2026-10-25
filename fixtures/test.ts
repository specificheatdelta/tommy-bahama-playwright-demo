import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductPage } from '../pages/ProductPage';

type Pages = {
  home: HomePage;
  search: SearchResultsPage;
  category: CategoryPage;
  product: ProductPage;
};

export const test = base.extend<Pages>({
  page: async ({ page }, use) => {
    // The email sign-up popup appears a few seconds after load and can cover any element.
    // Close it whenever it shows up instead of adding waits to every test.
    await page.addLocatorHandler(page.getByRole('button', { name: 'Close dialog' }), async (close) => {
      await close.click();
    });
    await use(page);
  },
  home: async ({ page }, use) => use(new HomePage(page)),
  search: async ({ page }, use) => use(new SearchResultsPage(page)),
  category: async ({ page }, use) => use(new CategoryPage(page)),
  product: async ({ page }, use) => use(new ProductPage(page)),
});

export { expect };
