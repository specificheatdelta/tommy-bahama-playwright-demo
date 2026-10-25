# Tommy Bahama – Playwright demo

[![Playwright tests](https://github.com/specificheatdelta/tommy-bahama-playwright-demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/specificheatdelta/tommy-bahama-playwright-demo/actions/workflows/playwright.yml)

A small, working example of how I would start a test automation practice for [tommybahama.com](https://www.tommybahama.com/): Playwright and TypeScript, page objects, accessibility checks, mobile web, and a GitHub Actions pipeline with a smoke gate and full regression.

> **Unofficial.** This is a personal portfolio project by Fahad Ahsan. It is not affiliated with or endorsed by Tommy Bahama or Oxford Industries. It only reads public pages and never signs in, adds to the bag, or checks out.

## What it covers

| Area | Tests | Tags |
|---|---|---|
| Homepage | Title, shipping offer, empty bag, main categories, skip link, Men category navigation | `@smoke` `@mobile` |
| Search | Relevant results for "linen shirt"; clear message when nothing matches | `@smoke` `@mobile` |
| Category page | Product names and prices; sort by price low to high | `@smoke` |
| Product page | Name, price, color and size options; size required before Add To Bag; size selection state | `@smoke` `@mobile` |
| Accessibility | No critical WCAG 2 A/AA violations (axe-core) on home, search, and category pages | |
| HTTP | robots.txt guardrails, sitemap, key pages return 200 | `@smoke` |

20 tests: 17 on desktop Chrome (1440×900) and 3 smoke checks on a Pixel 7 mobile viewport. The full run takes about one minute.

The [test strategy](docs/test-strategy.md) explains what a full practice would add, and the [mobile automation plan](docs/mobile-automation-plan.md) covers the native app.

## Run it

Requires Node 20 or newer.

```bash
npm ci
npx playwright install chromium
npm test              # everything
npm run test:smoke    # the fast gate
npm run test:mobile   # mobile viewport only
npm run report        # open the HTML report
```

Point the suite at another environment with `BASE_URL`, for example `BASE_URL=https://staging.example.com npm test`.

## Design choices

- **Page objects** in [`pages/`](pages/) keep selectors in one place. Category and search pages share a `ProductGrid`, because they render the same tiles.
- **User-facing locators first**: roles, accessible names, and visible text, falling back to the site's own `tbr-*` attributes. No XPath, no CSS chains tied to layout.
- **Popups handled once.** The email sign-up popup can appear on any page, so a fixture in [`fixtures/test.ts`](fixtures/test.ts) registers a locator handler that closes it. No test has to know about it.
- **No hard-coded products.** Product tests start from a category page and open the first product, so a sold-out SKU can't break the run.
- **Accessibility as a gate, not noise.** Critical violations fail the run; serious and minor ones are attached to the report for triage.

## Guardrails for a live site

- One browser at a time (`workers: 1`). Against a test environment this suite would run fully parallel.
- Read-only. It never adds to the bag, and it never visits cart, checkout, or account pages, which robots.txt disallows. A test enforces that the suite's assumptions about robots.txt still hold.
- Scheduled runs are weekly, not hourly.
- Nothing tries to hide the browser or get around bot protection.

Cart, checkout, payment, and account flows belong in a staging environment with test payment methods, as described in the [test strategy](docs/test-strategy.md).

## CI

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml):

1. **Smoke** runs on every push and pull request: type check, then `@smoke` tests.
2. **Full regression** runs after smoke passes, on `main`, on a weekly schedule, and on demand.
3. Both upload the Playwright HTML report (traces, screenshots, and video on failure) as a build artifact.
