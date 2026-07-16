# QA Automation Take-Home — Senior QA Engineer

Automation framework for three QA take-home tasks:

- **Web UI** — Playwright + TypeScript + Page Object Model
- **Mobile UI** — WebdriverIO + Appium + Page Object Model
- **API** — Playwright API + Zod schema validation

## Tech Stack

- Playwright
- TypeScript
- WebdriverIO
- Appium
- Zod
- GitHub Actions

## Project Structure

```text
.
├── pages/                  # Web Page Objects
├── fixtures/
├── schemas/                # API schemas
├── utils/
├── tests/
│   ├── ui/
│   └── api/
├── mobile/                 # Separate WebdriverIO project
│   ├── pageobjects/
│   ├── test/specs/
│   └── wdio.conf.ts
├── playwright.config.ts
└── .github/workflows/
```

---

# Web UI & API

## Prerequisites

- Node.js 18+

## Installation

```bash
npm install
npx playwright install chromium
```

## Run Tests

```bash
npm test
npm run test:ui
npm run test:api
npm run test:ui:headed
npm run report
```

---

# Mobile UI

The mobile automation is located under the **mobile/** folder because it uses WebdriverIO and Appium independently from Playwright.

## Prerequisites

- Node.js 18+
- Java JDK 11+
- Android SDK
- Android Emulator
- Appium UiAutomator2 Driver

## Installation

```bash
cd mobile
npm install
npx appium driver install uiautomator2
```

Start an Android emulator before running tests.

Verify the device:

```bash
adb devices
```

## Run Tests

```bash
npm test
npm run test:search
npm run test:scroll
```

---

## Notes

- Web UI uses Page Object Model.
- API tests perform complete CRUD with runtime-generated authentication and booking IDs.
- Mobile tests automate the Android Settings application.
- No hardcoded waits (`waitForTimeout`) are used.
- Designed to be scalable and easy to maintain.git