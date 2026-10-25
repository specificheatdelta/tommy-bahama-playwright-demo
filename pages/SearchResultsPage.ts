import { type Locator, type Page } from '@playwright/test';
import { ProductGrid } from './ProductGrid';

export class SearchResultsPage extends ProductGrid {
  readonly resultsSummary: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.resultsSummary = page.getByText(/\d+ results for \(/).first();
    this.noResultsMessage = page.getByText(/no results for/i).first();
  }

  async open(term: string) {
    await this.page.goto(`/search?text=${encodeURIComponent(term)}`, { waitUntil: 'domcontentloaded' });
  }

  async resultCount(): Promise<number> {
    const text = await this.resultsSummary.innerText();
    return Number(text.match(/(\d+) results/)?.[1] ?? 0);
  }
}
