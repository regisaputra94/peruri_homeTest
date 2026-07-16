import { expect } from '@wdio/globals';
import { SettingsScreen } from '../../pageobjects/SettingsScreen';
import { AboutPhoneScreen } from '../../pageobjects/AboutPhoneScreen';

describe('Mobile UI Automation - Scroll Gesture', () => {
  const settingsScreen = new SettingsScreen();
  const aboutPhoneScreen = new AboutPhoneScreen();

  beforeEach(async () => {
    await settingsScreen.open();
  });

  it('scrolls down to reveal "About phone" (off screen initially) and taps it', async () => {
    await settingsScreen.openAboutPhone();

    expect(await aboutPhoneScreen.isLoaded()).toBe(true);
  });
});
