# Mobile automation plan: Tommy Bahama Island Club

This is a plan, not code. The app is a production loyalty app tied to customers' payment cards, so I would not automate against it from outside the company. This page shows how I would set it up with the team.

## The app

[Tommy Bahama Island Club](https://apps.apple.com/us/app/tommy-bahama-island-club/id1372291776) on the App Store (Tommy Bahama Group, Inc.) is the dining rewards app for Tommy Bahama Restaurants and Marlin Bars. From its listing:

- Sign up and get a $10 dining reward
- Earn points on every visit; redeem 250 points for a $25 reward
- Register a credit or debit card to earn and redeem automatically
- Birthday dessert and member offers

I could not find an Android version on Google Play. The plan covers both platforms so it holds either way.

## What to test

| Priority | Area | Examples |
|---|---|---|
| 1 | Sign-up and sign-in | New member gets the $10 reward once; duplicate email; password reset; session expiry |
| 1 | Card registration | Add, replace, and remove a card using the payment processor's sandbox cards, never real ones; error handling for declined cards |
| 1 | Points and rewards | Balance after a visit; 250-point threshold; reward issued and redeemed exactly once; balance after redemption |
| 2 | Offers | Birthday reward appears in the right window; expired offers disappear |
| 2 | App upgrade | Upgrading from the current store version keeps the member signed in with the same balance |
| 2 | Platform behavior | Push notification permission and deep links into offers; background and resume; poor or no network |
| 3 | Accessibility | VoiceOver and TalkBack labels on every control; Dynamic Type and large fonts |

The rewards math (points earned, thresholds, single-use rewards) belongs mostly in **API tests** against the loyalty backend, where it's fast and exact. The app tests then confirm the screens show what the API returned.

## Tooling

- **Appium + WebdriverIO in TypeScript**, using the XCUITest driver for iOS and UiAutomator2 for Android. Same language as the web suite, same page-object pattern, same reviewers.
- **Accessibility IDs** added by the app developers to key controls. This is the single biggest factor in stable mobile tests, so it's the first thing I'd agree with the mobile team.
- **Simulators and emulators** for fast checks on every pull request.
- **Real devices** on BrowserStack App Automate or Sauce Labs for nightly and release runs. The device matrix comes from the app's analytics: the top iOS versions and devices covering about 90% of members.
- **Test data**: seeded member accounts in a staging loyalty environment, with an API to set points balances so tests don't need real restaurant visits.

## GitHub Actions integration

| Trigger | What runs | Where | Target time |
|---|---|---|---|
| Pull request to the app repo | Unit tests, then Appium smoke (sign-in, balance, rewards list) | iOS simulator on a macOS runner; Android emulator on Linux | Under 15 min |
| Nightly | Full Appium regression | Real devices in the device cloud, in parallel | Under 45 min |
| Release candidate | Full regression on the full device matrix, then a manual exploratory pass | Real devices | Go/no-go input |
| After App Store / Play release | Smoke on the store build | Real devices | Under 10 min |

A sketch of the nightly job is in [`examples/mobile-ci.example.yml`](examples/mobile-ci.example.yml). It isn't active in this repo; it shows the shape:

1. Get the build: download the signed `.ipa` / `.apk` from the app's build workflow artifacts.
2. Upload it to the device cloud through its REST API, storing the returned app ID.
3. Run the WebdriverIO suite with the app ID and device matrix as capabilities, sharded across devices.
4. Publish results: JUnit report to the workflow summary, device videos and logs as artifacts, and a failure alert to the team channel.

Device-cloud credentials live in GitHub Actions secrets, and test member credentials live in the staging secrets store, never in the repo.

## First 90 days for mobile

1. **Weeks 1–3:** Review the current release process and recent app incidents. Agree accessibility IDs with the developers. Set up staging test members.
2. **Weeks 4–8:** Build the smoke set (sign-in, balance, rewards, card registration with sandbox cards) on simulators in PR checks.
3. **Weeks 9–12:** Add real devices and nightly regression, then report escaped defects and run times to the team.
