import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../fixtures/test';

// Gate on critical WCAG 2 A/AA violations. Serious and lower ones are attached to the
// report for triage instead of failing the run, so the gate stays trustworthy.
const pages = [
  { name: 'homepage', path: '/' },
  { name: 'search results', path: '/search?text=linen+shirt' },
  { name: 'category page', path: '/en/c/men-sweaters?q=:' },
];

test.describe('Accessibility', () => {
  for (const { name, path } of pages) {
    test(`${name} has no critical WCAG A/AA violations`, async ({ page }, testInfo) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.locator('main, #main').first().waitFor();

      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const summary = results.violations.map((v) => `${v.impact}: ${v.id} (${v.nodes.length} nodes)`);
      await testInfo.attach('axe-violations', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
      if (summary.length) testInfo.annotations.push({ type: 'axe', description: summary.join('; ') });

      const critical = results.violations.filter((v) => v.impact === 'critical');
      expect(critical.map((v) => v.id)).toEqual([]);
    });
  }
});
