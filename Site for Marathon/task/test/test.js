import path from 'path';

const pagePath = new URL("../src/index.html",import.meta.url ) // path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web';

class Test extends StageTest {
  page = this.getPage(pagePath);

  tests = [
    // Test 1 - check iframes still exist
    this.page.execute(() => {
      const youtubeIframe = document.querySelector('.iframe-container iframe[src*="youtube"]');
      const weatherIframe = document.querySelector('.iframe-container iframe[src*="meteoblue"]');

      return youtubeIframe && weatherIframe ?
        correct() :
        wrong('The page must have iframes with content from YouTube and the weather widget. Each of these iframes must have a parent div with the class .iframe-container');
    }),

    // Test 2 - check that there are no indents
    this.page.execute(() => {
      const youtubeIframe = document.querySelector('.iframe-container iframe[src*="youtube"]');
      const weatherIframe = document.querySelector('.iframe-container iframe[src*="meteoblue"]');
      const bodyStyles = window.getComputedStyle(document.body);
      const youtubeIframeStyles = window.getComputedStyle(youtubeIframe);
      const weatherIframeStyles = window.getComputedStyle(weatherIframe);

      return bodyStyles?.margin === '0px' && bodyStyles?.padding === '0px'
      && youtubeIframeStyles?.margin === '0px' && youtubeIframeStyles?.padding === '0px'
      && weatherIframeStyles?.margin === '0px' && weatherIframeStyles?.padding === '0px'?
        correct() :
        wrong('Should remove any margin and padding from the body and iframes');
    }),

    // Test 3 - check that iframes have 100% width
    this.page.execute(() => {
      const windowWidth = `${window.innerWidth}px`;
      const iframeContainer = document.getElementsByClassName('iframe-container');
      if (!iframeContainer || iframeContainer.length !== 2) {
        return wrong('Make sure there are still 2 iframe-containers on the page');
      }
      const youtubeIframeContainerStyle = window.getComputedStyle(iframeContainer[0]);
      const weatherIframeContainerStyle = window.getComputedStyle(iframeContainer[1]);

      return youtubeIframeContainerStyle.width === windowWidth && weatherIframeContainerStyle.width === windowWidth ?
        correct() :
        wrong('Width of both iframes should be set to 100% of the screen width');
    }),

    // Test 4 - check heights of youtube and weather iframes
    this.page.execute(() => {
      const windowHeight = window.innerHeight;
      const youtubeIframe = document.querySelector('.iframe-container iframe[src*="youtube"]');
      const weatherIframe = document.querySelector('.iframe-container iframe[src*="meteoblue"]');
      const youtubeIframeHeight = Number(window.getComputedStyle(youtubeIframe).height.replace('px', ''));
      const weatherIframeHeight = Number(window.getComputedStyle(weatherIframe).height.replace('px', ''));

      const checkHeights = Math.round(((youtubeIframeHeight * 100) / windowHeight)) === 80 && Math.round(((weatherIframeHeight * 100) / windowHeight)) === 40;
      return checkHeights ?
        correct() :
        wrong('Be sure the height of the YouTube iframe is 80% and the height of the Weather iframe is 40% of screen height');
    }),

    // Test 5 - check youtube controls is hidden
    this.page.execute(async () => {
      const youtubeIframe = document.querySelector('.iframe-container iframe[src*="youtube"]');

      return youtubeIframe.src.includes('controls=0') ?
        correct() :
        wrong('Hide the controls for YouTube iframe');
    }),
  ]
}

it("Test stage", async () => {
    await new Test().runTests()
  }
).timeout(30000);
