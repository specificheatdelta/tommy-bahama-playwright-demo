# Test strategy

This repo is a starting point. This page describes how I would grow it into a full automation practice for Tommy Bahama's e-commerce site and Island Club app. It is built from the public site and app listings only. Real priorities would come from the team's incident history, release data, and revenue.

## Strategy vs. plan

The strategy sets how we test the product for the next year or more. A test plan applies it to one release: what gets tested, by whom, and when. If a line would change next release, it belongs in the plan.

| Question | Test strategy (this page) | Test plan |
|---|---|---|
| Scope | Whole product or org, every release | One release, feature, or project |
| Life span | Revisited yearly or when the architecture changes | Closed when the release ships |
| Answers | Why and how: risk approach, test levels, automation, gates, tools, metrics | What, who, when: features in scope, test cases, schedule, owners, environments booked |
| Owner | QA lead or manager, signed off by engineering leadership | QA engineer on the feature team |
| Example line | Every change to checkout runs API and UI smoke in under 10 minutes, blocking merge | Gift card redemption: 12 cases on staging, Nov 18 to 20, sign-off by release manager |

In ISO/IEC/IEEE 29119 terms this is the project test strategy. Each release's test plan cites it rather than repeating it.

## Purpose and scope

Goal: every change to a revenue path is checked in minutes, and every release decision is backed by data. This covers the US and Canada shopping site, its APIs and integrations, and the Island Club app.

| In scope | Out of scope (for now) |
|---|---|
| Web storefront (SAP Commerce): browse, search, bag, checkout, account | Restaurant and resort operations systems |
| Cart, pricing, promotions, inventory, and order APIs | Store POS hardware and in-store devices |
| Third-party scripts: Klaviyo, OneTrust, Bazaarvoice | Product copy and catalog content (owned by content teams) |
| Island Club iOS app (see the [mobile plan](mobile-automation-plan.md)) | Vendor systems beyond their contract with our APIs |
| Order and event data feeding reporting | Corporate IT and back-office tools |
| Replatforming cutover, if and when it happens | |

Open question: how the Aptos ONE POS rollout touches store and online order data. Answer in the first 30 days.

## Quality goals and risk

We test what costs money first: depth of testing follows business risk, not feature count. Three goals drive every choice below.

- **Faster feedback.** Developers know within 10 minutes if a change broke checkout, bag, or pricing.
- **Fewer escaped defects.** P1 and P2 bugs reaching customers trend down each quarter against a measured baseline.
- **Release confidence.** Go/no-go calls use one shared quality report.

| Tier | Area | Why it matters | How we cover it |
|---|---|---|---|
| 1 | Checkout, payment, bag | Every order passes through; payment and inventory integrations | API tests, UI smoke on every PR, test payments on staging |
| 1 | Pricing and promotions | Changes with every sale; a wrong price costs revenue or trust | API rule tests with QA-only test products |
| 1 | Replatforming cutover | Orders, customers, promotions, and history must move intact | Parity tests first, batch-by-batch data reconciliation, flags with rollback |
| 2 | Third-party scripts | Can change without our deploy; can cover a button or slow a page | UI smoke plus production synthetic checks |
| 2 | Holiday peak load | Rare but costly | Yearly load cycle before peak |
| 2 | Account and order status | Sign-in and order history drive support calls | Nightly regression |
| 3 | Search and browsing | Bad results lose sales quietly | API relevance checks, read-only production checks |
| 3 | Order and event data | Reporting and marketing depend on it | Data completeness checks |
| 3 | Island Club app, content pages | Smaller audience, high member trust | Mobile plan; read-only production checks |

The tiers are a starting map to confirm with incident and revenue data in the first 30 days, then reviewed each quarter.

## Test levels and types

Each check runs at the cheapest layer that can catch the bug. API tests carry most of the coverage, and the browser runs only the critical shopper journeys.

```
            /\        Production synthetic   read-only checks after each deploy
           /  \
          /----\      UI end-to-end          PR smoke + nightly regression
         /      \
        /--------\    API and integration    pricing, cart, promos, orders  <- most checks
       /          \
      /------------\  Unit tests             developers, on every commit

  Across every layer: accessibility (axe-core), performance before peak (k6 or JMeter), mobile (Island Club plan)
```

| Layer | Tool | Runs | Covers |
|---|---|---|---|
| Unit | Team's framework | Every commit | Business logic; owned by developers |
| API and integration | Playwright `request` | Every PR | Cart, pricing, promotions, inventory, orders; contract checks with payment and order partners |
| UI end-to-end | Playwright + TypeScript (this repo) | PR smoke, nightly regression | Tier-1 journeys: search, bag, checkout, account |
| Accessibility | axe-core in the same suite | Nightly; gates on critical issues | WCAG checks plus manual screen-reader pass before major releases |
| Performance | k6 or JMeter | Before peak events | Checkout throughput, search response time |
| Mobile | Mobile viewports; Appium for Island Club | Per the [mobile plan](mobile-automation-plan.md) | Responsive web and the native app |
| Production synthetic | Playwright, read-only | After every deploy | Home, search, product page, bag |

Manual exploratory testing covers each client-facing release, focused on new features and tier-1 flows.

## Automation and pipeline

Automate tier-1 flows first, at the cheapest layer that catches the bug, and let the pipeline enforce the standards. A trusted suite comes before a bigger one.

| When | What runs | Time budget | Effect |
|---|---|---|---|
| Every pull request | API tests + UI smoke (tagged `@smoke`) | Under 10 min | Blocks merge |
| Every deploy to staging | Full regression in parallel | Under 45 min | Results posted to team channel |
| Nightly | Regression + accessibility scan | Overnight | Triage by 10 am |
| Before each release | Go/no-go summary: regression, open defects by severity, new risks | n/a | Release decision |
| After each production deploy | Read-only synthetic smoke | Under 5 min | Alerts on failure |
| Before peak | Load tests on checkout and search | Scheduled cycle | Peak-readiness sign-off |

**Standards the pipeline enforces**

- Locators based on what users see, plus test IDs agreed with developers.
- Each test runs on its own: data set up through APIs, no fixed waits.
- Tags decide what runs where (smoke, regression, mobile).
- Test code is reviewed like product code.
- Flaky tests are quarantined with an owner and a fix-by date.
- Done means tests are written and green.

**Ownership model.** QA builds the framework and pipeline; developers add tests on it with no extra setup. By month 12, most new tests come from feature teams.

Open question: the 45-minute regression and 5-minute production budgets are starting targets to confirm against the current pipeline.

## Environments and test data

Anything that writes data runs on staging with test payments; production gets read-only checks only.

| Environment | Used for | Data |
|---|---|---|
| Local / PR preview | Developer runs, PR smoke | Seeded per test through APIs |
| Staging | Regression, checkout with test payments, promotions, accounts | Seeded catalog with QA-only test products; synthetic customers |
| Performance | Peak load cycles | Production-sized, anonymized volumes |
| Production | Read-only synthetic checks, search and browse checks | Real catalog, no orders placed |

**Data rules**

- Test the rules, not catalog content: QA-only products with known prices, so a merchandising change never breaks a test.
- Each test creates and cleans up its own data.
- No real customer data in any test environment or AI tool.
- US and Canada each get their own tax, currency, and shipping fixtures.

## Entry, exit and release criteria

A release ships when tier-1 flows are green and no open P1 or P2 defects remain. Each release's test plan can add criteria but not remove these.

| Gate | Criteria |
|---|---|
| Entry to test | Story has acceptance criteria; build deployed to staging; test data seeded; PR smoke green |
| Exit from test | All planned tier-1 and tier-2 cases run; regression green or every failure triaged; no open P1/P2 |
| Release go/no-go | Exit met; known P3/P4 defects accepted by product owner; rollback plan confirmed; load targets met for peak releases |
| After release | Production synthetic smoke green within 15 minutes of deploy |

**Peak freeze.** Only fixes for P1/P2 defects ship during the holiday freeze, each with full regression.

## Defect management

Severity is set by customer and revenue impact; QA proposes it, product confirms it in triage.

| Severity | Definition | Example | Release impact |
|---|---|---|---|
| P1 | Blocks orders or exposes data; no workaround | Checkout fails for card payments | Blocks release; hotfix |
| P2 | Major flow broken or wrong money shown; workaround exists | Promo code applies wrong discount | Blocks release |
| P3 | Minor flow issue | Filter count off on a category page | Ships with product sign-off |
| P4 | Cosmetic | Misaligned icon | Backlog |

- **Triage:** daily during release week, twice weekly otherwise; QA, dev lead, and product.
- **Every escaped P1/P2** gets a short root-cause review and, where it fits, a new automated test.
- **Failed automated tests** are triaged as product bug, test bug, or environment issue before anyone files a defect.

## Roles and responsibilities

Quality is the whole team's job; QA owns the framework, the risk map, and the release signal.

| Role | Owns |
|---|---|
| QA lead / manager | This strategy, risk map, quality scorecard, go/no-go recommendation |
| Automation engineers | Framework, pipeline gates, API and UI suites, flaky-test fixes |
| Feature-team developers | Unit tests, adding tests on the framework as part of done, test IDs |
| Product owners | Acceptance criteria, severity sign-off, accepting known defects |
| DevOps | Environments, pipeline capacity, production monitoring and alerts |
| Mobile and performance engineers (added as needed) | Island Club suite; peak load cycles |

Contract testers cover holiday peak rather than permanent hires.

## Metrics and reporting

We measure outcomes, not test counts, and report a one-page scorecard to leadership monthly.

| Measure | 12-month target |
|---|---|
| Escaped defects (P1/P2) | Down each quarter vs. baseline |
| Coverage of priority flows | All tier-1 flows automated |
| Commit-to-green time | Under 10 min for PR checks |
| Flaky-test rate | Under 2% |
| Release frequency and change failure rate | Faster releases, fewer rollbacks |

The baseline is captured in the first 30 days. Each escaped defect review feeds the risk map, so the strategy improves from real failures.

## Tools, AI use, and upkeep

One language (TypeScript) across web, API, and mobile, so any engineer can review and fix any test. Tools are piloted before committing.

| Need | Tool | Cost |
|---|---|---|
| Web UI and API automation | Playwright + TypeScript | Open source |
| Native mobile | Appium + WebdriverIO (TypeScript) | Open source |
| Accessibility | axe-core | Open source |
| Load testing | k6 or JMeter | Open source |
| CI/CD | Existing pipeline (GitHub Actions in this repo) | Existing |
| Real devices and browsers | BrowserStack or Sauce Labs | Paid; main tooling cost |
| Test case management | TestRail, or Xray if teams use Jira | Paid per user |
| AI-assisted planning | AI coding assistant + Playwright MCP | Per seat |

**AI policy: AI drafts, people decide.** AI turns tickets, stories, and API specs into draft test plans and tests. A person reviews everything before it merges, and no real customer data goes into any AI tool.

**Keeping this current.** The QA lead reviews this strategy each quarter and after any major architecture change or escaped P1. Release test plans link here instead of copying it.
