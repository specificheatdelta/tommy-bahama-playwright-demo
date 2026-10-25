import { type Locator, type Page } from '@playwright/test';

export class ProductPage {
  readonly name: Locator;
  readonly price: Locator;
  readonly colorOptions: Locator;
  readonly sizeOptions: Locator;
  readonly addToBag: Locator;
  readonly sizeError: Locator;
  readonly bagSummary: Locator;
  readonly selectedSizes: Locator;

  constructor(page: Page) {
    this.name = page.locator('h1').first();
    this.price = page.locator('[tbr-pdp--regular-price], [tbr-pdp--sale-price]').first();
    this.colorOptions = page.getByRole('radiogroup', { name: 'Color options' }).getByRole('radio');
    this.sizeOptions = page.getByRole('radiogroup', { name: 'Size options' }).getByRole('radio');
    this.addToBag = page.getByRole('button', { name: 'Add To Bag' });
    this.sizeError = page.locator('[tbr-pdp--size-error-message]');
    this.bagSummary = page.getByText(/My Bag \(\d+ Items?\)/).first();
    this.selectedSizes = page.getByRole('radiogroup', { name: 'Size options' }).getByRole('radio', { checked: true });
  }
}
