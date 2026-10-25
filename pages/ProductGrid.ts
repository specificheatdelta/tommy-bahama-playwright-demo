import { type Locator, type Page } from '@playwright/test';

/** Product listing behavior shared by category pages and search results. */
export class ProductGrid {
  readonly productNames: Locator;
  readonly productCount: Locator;
  readonly sortSelect: Locator;

  constructor(protected readonly page: Page) {
    this.productNames = page.locator('.tbr-product-name a');
    this.productCount = page.locator('.top-product-count').first();
    this.sortSelect = page.locator('select[name="sortBy"]').first();
  }

  async sortBy(option: 'Featured' | 'Newest' | 'Price Low-High' | 'Price High-Low') {
    await this.sortSelect.selectOption({ label: option });
    await this.page.waitForURL(/sortBy=/, { waitUntil: 'domcontentloaded' });
  }

  /** Price shown on each tile, in grid order. Sale tiles list the current (lowest) price. */
  async tilePrices(limit = 12): Promise<number[]> {
    await this.productNames.first().waitFor();
    return this.productNames.evaluateAll((links, max) =>
      links.slice(0, max).map((link) => {
        let tile: Element | null = link;
        // Walk up to the tile that holds both the name and a price.
        while (tile && !/\$\d/.test(tile.textContent ?? '')) tile = tile.parentElement;
        const prices = [...(tile?.textContent ?? '').matchAll(/\$([\d,]+(?:\.\d{2})?)/g)].map((m) =>
          Number(m[1].replace(/,/g, '')),
        );
        return Math.min(...prices);
      }), limit);
  }

  async openProduct(index = 0) {
    await this.productNames.nth(index).click();
    await this.page.waitForURL(/\/p\//);
  }
}
