/**
 * BasePage holds gesture and wait helpers every screen needs, so concrete
 * page objects only describe *what* is on screen (selectors) and *what
 * you can do* with it, not *how* Appium performs a swipe.
 */
export class BasePage {
  /**
   * Swipes up on the screen (i.e. scrolls the content down) using
   * Appium's UiAutomator2 `mobile: swipeGesture` execute-script command —
   * the modern replacement for the deprecated W3C-actions-by-hand approach.
   */
  // async swipeUp(): Promise<void> {
  //   const { width, height } = await driver.getWindowSize();
  //   await driver.execute('mobile: swipeGesture', {
  //     left: Math.round(width * 0.2),
  //     top: Math.round(height * 0.75),
  //     width: Math.round(width * 0.6),
  //     height: Math.round(height * 0.5),
  //     direction: 'up',
  //     percent: 0.8,
  //   });
  // }

  async swipeUp(percent = 0.8): Promise<void> {
    const { width, height } = await driver.getWindowSize();

    await driver.execute('mobile: swipeGesture', {
      left: Math.floor(width * 0.1),
      top: Math.floor(height * 0.2),
      width: Math.floor(width * 0.8),
      height: Math.floor(height * 0.6),
      direction: 'up',
      percent,
    });
  }

  /**
   * Repeatedly swipes up until `getElement()` resolves to a visible
   * element, or gives up after `maxSwipes` attempts. This is the gesture
   * step required by the take-home spec: find an element that is off
   * screen on first load, without the reviewer's device/list length
   * affecting the test's reliability.
   */
  async scrollToElement(
    getElement: () => ReturnType<typeof $>,
    maxSwipes = 8,
  ): Promise<ReturnType<typeof $>> {
    for (let attempt = 0; attempt < maxSwipes; attempt++) {
      const element = getElement();
      const displayed = await element.isDisplayed().catch(() => false);

      if (displayed) {
        return element;
      }

      await this.swipeUp();
    }

    const element = getElement();
    if (await element.isDisplayed()) return element;
    throw new Error(`Element not found after ${maxSwipes} swipe attempts`);
  }

}
