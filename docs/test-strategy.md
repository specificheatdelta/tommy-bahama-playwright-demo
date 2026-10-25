# Test strategy: from demo to practice

This repo is a starting point. This page describes how I would grow it into a full automation practice for a retailer with e-commerce, stores, restaurants, and a loyalty app. Everything here is based on the public site and app listings only. Real priorities would come from the team's release history, production incidents, and revenue data.

## What I observed from the outside

- The site runs on SAP Commerce: `/en/c/` category URLs, `/p/` product URLs, and a `j_username` sign-in form.
- Third-party services on the page include Klaviyo (email and SMS sign-up), OneTrust (cookie consent), and Bazaarvoice (reviews). Each one is a dependency that can slow a page, cover a button, or break a flow, and each needs a test strategy of its own.
- The shopping site is US and Canada. The holiday gift shop is live, so peak season is close.
- The public app is **Tommy Bahama Island Club** (iOS), a dining loyalty app. See the [mobile plan](mobile-automation-plan.md).

## Priorities: test what costs money first

| Priority | Flow | Where it runs |
|---|---|---|
| 1 | Checkout: guest and signed-in, card, gift card, promo codes, tax and shipping | Staging, test payments |
| 1 | Add to bag, bag updates, inventory and size availability | Staging |
| 1 | Search, category browsing, filters, sort | Staging and production (read-only) |
| 2 | Account: sign-up, sign-in, password reset, order history, order status | Staging |
| 2 | Promotions: free-shipping threshold, sale pricing, gift cards | Staging |
| 2 | Store finder, buy online / pick up or ship-from-store, if offered | Staging |
| 3 | Restaurants and resort booking pages, content pages | Production (read-only) |
| 3 | Island Club app: sign-up, card registration, points, rewards | See mobile plan |

## Test layers

1. **API and integration tests** (Playwright `request` or a dedicated HTTP client) for cart, pricing, promotions, inventory, and order APIs. They're fast and stable, and they catch most pricing bugs before the UI exists.
2. **UI end-to-end tests** (this repo) for the critical shopper journeys only: a small smoke set that gates every change, and a broader regression run nightly.
3. **Accessibility** with axe-core in the same suite, gating on critical issues, plus manual screen-reader passes before major releases.
4. **Performance and load** with k6 or JMeter before peak events (Black Friday, holiday, big drops). Includes checkout throughput and search response times.
5. **Mobile web and native apps**: mobile viewports here, native apps per the [mobile plan](mobile-automation-plan.md).
6. **Production monitoring**: a handful of read-only synthetic checks after every deploy, wired to alerts.

## Pipeline

- **Every pull request:** API tests plus UI smoke, under 10 minutes, blocking merge.
- **Every deploy to staging:** full regression in parallel, with results posted to the team channel.
- **Before each release:** a go/no-go summary of regression results, open defects by severity, and any new risk.
- **After each production deploy:** read-only smoke against production.

## Quality metrics I would report

- Escaped defects by severity (bugs found in production vs. before)
- Automation coverage of priority flows (not raw test counts)
- Pipeline time from commit to green
- Flaky-test rate, with a quarantine and a fix-by date for each flaky test
- Release frequency and change failure rate

## Tools

| Need | Tool | Cost |
|---|---|---|
| Web UI and API automation | Playwright + TypeScript | Open source |
| Accessibility | axe-core | Open source |
| CI/CD | GitHub Actions | Existing plan minutes |
| Native mobile automation | Appium + WebdriverIO (TypeScript) | Open source |
| Real devices and browsers | BrowserStack or Sauce Labs | Paid; the main tooling line item |
| Load testing | k6 or JMeter | Open source; paid cloud only for very large tests |
| Test case management | TestRail, or Xray if the team lives in Jira | Paid per user |

One language (TypeScript) across web, API, and mobile means any engineer on the team can review and fix any test.
