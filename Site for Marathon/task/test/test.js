import path from 'path';
import { StageTest, correct, wrong } from 'hs-test-web';

const pagePath = new URL("../src/index.html", import.meta.url);

class Test extends StageTest {
  page = this.getPage(pagePath);

  tests = [
    // Test 1 - check iframes count
    this.node.execute(async () => {
      const iframes = await this.page.findAllBySelector('iframe');

      if (iframes.length === 0) {
        return wrong(`Cannot find iframes on the page.`);
      } else if (iframes.length === 2) {
        return correct();
      }

      return wrong('Your page must contain exactly two iframes.');
    }),

    // Test 2 - check first iframe contains youtube
    this.page.execute(() => {
      const iframes = document.getElementsByTagName('iframe');

      return iframes && iframes[0]?.src.startsWith('https://www.youtube.com/embed/') ?
        correct() :
        wrong('The first iframe must use an embed link to a YouTube video.');
    }),

    // Test 3 - check second iframe contains meteoblue
    this.page.execute(() => {
      const iframes = document.getElementsByTagName('iframe');

      return iframes && iframes[1]?.src.startsWith('https://www.meteoblue.com/en/weather/widget/daily/london_united-kingdom_') ?
        correct() :
        wrong('The second iframe must display the weather widget for London.');
    }),

    // Test 4 - check second iframe show weather for 7 days
    this.page.execute(() => {
      const iframes = document.getElementsByTagName('iframe');

      return iframes && iframes[1]?.src.includes('days=7') ?
        correct() :
        wrong('The weather widget must be configured to display the forecast for 7 days.');
    }),

    // Test 5 - check each iframe is in a separate .iframe-container
    this.page.execute(() => {
      // Select the parent containers directly
      const youtubeContainer = document.querySelector('iframe[src*="youtube"]')?.parentElement;
      const weatherContainer = document.querySelector('iframe[src*="meteoblue"]')?.parentElement;

      // Check if both containers exist
      if (!youtubeContainer || !weatherContainer) {
          return wrong('Could not find a parent element for one or both iframes.');
      }

      // Check if both containers have the correct class
      const youtubeHasClass = youtubeContainer.classList.contains('iframe-container');
      const weatherHasClass = weatherContainer.classList.contains('iframe-container');

      if (!youtubeHasClass || !weatherHasClass) {
          return wrong('Each iframe must be wrapped in a div with the `.iframe-container` class.');
      }

      // **Crucial check:** Ensure the containers are two different elements
      if (youtubeContainer === weatherContainer) {
          return wrong('Each iframe must be wrapped in its own separate div. You cannot place both iframes in the same container div.');
      }

      return correct();
    }),
  ];
}

it("Test stage", async () => {
  await new Test().runTests();
}).timeout(30000);