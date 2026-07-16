import { BasePage } from './BasePage';

/**
 * Page object for the Android Settings app's home screen. Locators use
 * accessibility id / resource-id where possible (stable across most
 * builds); the "About phone" list entry falls back to a text selector
 * since it has no dedicated resource-id.
 *
 * Assumes the device/emulator locale is English (en-US) — see mobile/README.md.
 */
export class SettingsScreen extends BasePage {
  get searchEntryPoint() {
    return $('id=com.android.settings:id/search_action_bar');
  }

  get searchInput() {
    return $('id=com.google.android.settings.intelligence:id/open_search_view_edit_text');
  }

  get searchResultItems() {
    return $$('android=new UiSelector().resourceIdMatches(".*:id/title")');
  }

  get aboutPhoneListItem() {
    return $('android=new UiSelector().textContains("About")');
  }

  async open(): Promise<void> {
    // noReset:true means Settings may resume on whatever screen it was left on.
    // Force it back to the homepage explicitly rather than assuming a fresh launch.
    await driver.startActivity('com.android.settings', '.Settings');

    await $('android=new UiSelector().resourceIdMatches(".*:id/settings_homepage_container|.*:id/list")').waitForDisplayed({
      timeout: 15_000,
    });
}

  /** Task 2 / Interaksi Dasar: open the search "form" and type into its text field. */
  async searchFor(query: string): Promise<void> {
    await this.searchEntryPoint.waitForDisplayed();
    await this.searchEntryPoint.click();
    await this.searchInput.waitForDisplayed();
    await this.searchInput.setValue(query);
  }

  async waitForSearchResults(timeout = 10000): Promise<void> {
    await browser.waitUntil(
      async () => {
        const results = await this.searchResultItems;

        if (await results.length === 0) {
          return false;
        }

        return await results[0].isDisplayed().catch(() => false);
      },
      {
        timeout,
        timeoutMsg: 'Search results did not appear',
      },
    );
}

  async getSearchResultsCount(): Promise<number> {
    const results = await this.searchResultItems;
    return results.length;
  }

  async goBackToSettingsHome(): Promise<void> {
    await driver.back();
    await driver.back();
  }

  /** Task 2 / Gestur: scroll down until "About phone" is visible, then tap it. */
  async openAboutPhone(): Promise<void> {
    const item = await this.scrollToElement(() => this.aboutPhoneListItem);
    await item.click();
  }
}
