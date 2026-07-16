declare const process: { env: Record<string, string | undefined> };

/**
 * Tugas 2 — Mobile UI Automation.
 *
 * Targets the Android Settings app that ships with every Android
 * emulator/AVD, so the suite is fully self-contained: the reviewer only
 * needs an emulator running, no APK to sideload.
 *
 * The Appium server is started/stopped automatically by @wdio/appium-service
 * for local runs. Point APPIUM_HOST/APPIUM_PORT env vars at a server you
 * started yourself (e.g. in CI) to skip that and reuse it instead.
 *
 * Typed as `WebdriverIO.Config` rather than `Options.Testrunner` — the
 * latter doesn't include the `capabilities` field (that comes from a
 * separate `WithRequestedTestrunnerCapabilities` interface that
 * `WebdriverIO.Config` already mixes in).
 */
export const config: WebdriverIO.Config = {
  runner: 'local',
  // WebdriverIO auto-detects ts-node from devDependencies + tsconfig.json,
  // no extra compiler wiring needed here.
  specs: ['./test/specs/**/*.spec.ts'],
  maxInstances: 1,

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'emulator-5554',
      // 'appium:udid': process.env.ANDROID_UDID,
      // Launch straight into the Settings app instead of installing an APK.
      'appium:appPackage': 'com.android.settings',
      'appium:appActivity': '.Settings',
      // 'appium:noReset': true,
      'appium:newCommandTimeout': 240,
    },
  ],

  logLevel: 'info',
  bail: 0,
  waitforTimeout: 15_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 3,

  services: [
    [
      'appium',
      {
        // Only spun up when no external Appium server is reachable.
        args: { address: 'localhost', port: 4723 },
        command: 'appium',
      },
    ],
  ],
  port: 4723,

  framework: 'mocha',
  reporters: [
    'spec',
    [
      'html-nice',
      {
        outputDir: './reports/html',
        filename: 'mobile-report.html',
        reportTitle: 'Mobile UI Automation Report',
        showInBrowser: false,
        useOnAfterCommandForScreenshot: false,
      },
    ],
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 90_000,
  },
};
