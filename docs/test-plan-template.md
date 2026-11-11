# Test plan: <release or feature name>

> Copy this file for each release or feature (for example `docs/plans/2026-11-holiday-gift-shop.md`) and fill in the brackets. The plan covers **what, who, and when** for one release. **How** we test lives in the [test strategy](test-strategy.md); link to its sections instead of repeating them. If a line would stay true next release, it belongs in the strategy, not here.

| Field | Value |
|---|---|
| Release / feature | <name, version, or ticket> |
| Plan owner | <QA engineer> |
| Release manager | <name> |
| Target release date | <YYYY-MM-DD> |
| Test window | <start> to <end> |
| Status | Draft / In review / Approved / Closed |
| Strategy version | [test-strategy.md](test-strategy.md) as of <commit or date> |

## 1. Summary

<Two or three sentences: what is changing, who it affects, and the riskiest part.>

## 2. Scope

Rate each item with the tiers from the strategy's [risk map](test-strategy.md#quality-goals-and-risk).

| Item | Change | Risk tier | In scope? |
|---|---|---|---|
| <feature or flow> | New / changed / regression only | 1 / 2 / 3 | Yes / No, because <reason> |

**Out of scope for this release:** <items and why>

## 3. Approach

The default approach is in the strategy's [test levels](test-strategy.md#test-levels-and-types) and [pipeline](test-strategy.md#automation-and-pipeline). List only what this release adds or changes.

- **New automated tests:** <layer, flows, tag (`@smoke`, `@regression`)>
- **Manual and exploratory:** <charters, devices, browsers>
- **Non-functional:** <accessibility, performance, security work this release needs, if any>
- **Departures from the strategy:** <none, or what and why, approved by whom>

## 4. Coverage and assignments

| Feature / flow | Tier | Layer | Cases | Automated? | Owner | Status |
|---|---|---|---|---|---|---|
| <Gift card redemption> | <1> | <API + UI> | <12> | <8 of 12> | <name> | Not started / In progress / Done |

Test cases live in <TestRail or Xray link>.

## 5. Environments and test data

Follows the strategy's [environment and data rules](test-strategy.md#environments-and-test-data).

| Environment | Build / URL | Booked dates | Data needed |
|---|---|---|---|
| Staging | <build> | <dates> | <QA-only products, test cards, promo codes, accounts> |

## 6. Schedule

| Milestone | Date | Owner |
|---|---|---|
| Plan approved | <date> | <name> |
| Build in staging (entry) | <date> | <name> |
| Test execution complete | <date> | <name> |
| Go/no-go | <date> | <name> |
| Production deploy + smoke | <date> | <name> |

## 7. Entry and exit criteria

The strategy's [entry, exit and release criteria](test-strategy.md#entry-exit-and-release-criteria) apply. A plan can add criteria but not remove them.

**Extra criteria for this release:** <none, or for example "load test at 2x last peak before the holiday freeze">

## 8. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|
| <Promo service not in staging until Nov 18> | <Med> | <High> | <Contract tests against a mock until then> | <name> |

## 9. Results at exit

Fill in at go/no-go. Severity follows the strategy's [defect definitions](test-strategy.md#defect-management).

| Measure | Result |
|---|---|
| Planned cases run | <x of y> |
| Pass rate | <%> |
| Open defects | P1: <0> · P2: <0> · P3: <n> · P4: <n> |
| Known issues accepted by product | <list with ticket links> |
| Regression run | <link to CI run> |

**Recommendation:** Go / No-go, because <reason>.

## 10. Sign-off

| Role | Name | Decision | Date |
|---|---|---|---|
| QA | <name> | <Approve / Reject> | <date> |
| Engineering | <name> | | |
| Product | <name> | | |
