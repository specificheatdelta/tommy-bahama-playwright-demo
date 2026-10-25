import { ProductGrid } from './ProductGrid';

export class CategoryPage extends ProductGrid {
  async open(path: string) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}
