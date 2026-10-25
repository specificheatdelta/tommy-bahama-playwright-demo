import { test, expect } from '@playwright/test';

// Fast HTTP-level checks with no browser. In a real engagement this layer would call the
// commerce APIs directly; here it covers the public endpoints and this suite's own guardrails.
test.describe('HTTP checks', () => {
  test('robots.txt keeps automation out of cart, checkout, and account pages @smoke', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);

    const body = await res.text();
    for (const path of ['/en/cart', '/en/checkout', '/en/my-account']) {
      expect(body, `robots.txt should disallow ${path}`).toContain(`Disallow: ${path}`);
    }
  });

  test('sitemap is published for search engines', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain('<sitemap');
  });

  test('key shopper pages respond with 200', async ({ request }) => {
    for (const path of ['/', '/search?text=linen', '/en/c/men-sweaters?q=:', '/en/guest-services/returns-and-exchanges']) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
    }
  });
});
