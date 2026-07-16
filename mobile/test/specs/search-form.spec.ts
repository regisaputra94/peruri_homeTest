import { expect } from '@wdio/globals';
import { SettingsScreen } from '../../pageobjects/SettingsScreen';

describe('Mobile UI Automation - Basic Interaction', () => {
  const settingsScreen = new SettingsScreen();

  beforeEach(async () => {
    await settingsScreen.open();
  });

  it('opens the app and fills a text field on the search form', async () => {
    await settingsScreen.searchFor('battery');

    const text =
      (await settingsScreen.searchInput.getAttribute('text')) ??
      (await settingsScreen.searchInput.getText());

    expect(text.toLowerCase()).toContain('battery');

    await settingsScreen.waitForSearchResults();

    expect(await settingsScreen.getSearchResultsCount()).toBeGreaterThan(0);

    await settingsScreen.goBackToSettingsHome();
  });
});