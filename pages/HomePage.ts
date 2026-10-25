import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly skipToMain: Locator;
  readonly bagSummary: Locator;
  readonly searchInput: Locator;

  constructor(private readonly page: Page) {
    this.skipToMain = page.getByRole('link', { name: 'Skip to main content' });
    this.bagSummary = page.getByText(/My Bag \(\d+ Items?\)/).first();
    // Desktop and mobile headers each render their own search box; use whichever is on screen.
    this.searchInput = page.getByPlaceholder('Search').and(page.locator(':visible')).first();
  }

  async open() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  topNavLink(name: string): Locator {
    return this.page.locator('header').getByRole('link', { name, exact: true }).first();
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
    await this.page.waitForURL(/\/search\?text=/);
  }
}
