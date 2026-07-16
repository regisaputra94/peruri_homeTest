import { BasePage } from './BasePage';

export class AboutPhoneScreen extends BasePage {
  get androidVersionEntry() {
    return $('android=new UiSelector().textContains("Device name")');
  }

  async isLoaded(): Promise<boolean> {
    return this.scrollToElement(() => this.androidVersionEntry)
      .then(() => true)
      .catch(() => false);
  }
}
