import { serializeError } from 'serialize-error';
import chromium from 'chrome-aws-lambda';

import { isValidSeebrueckeUrl } from '@/lib/url';

async function getBrowserInstance() {
  return chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: {
      width: 1280,
      height: 640
    },
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true
  });
}

async function takeScreenshot(url) {
  let browser = null;

  try {
    browser = await getBrowserInstance();

    const page = await browser.newPage();

    await page.goto(url);

    return await page.screenshot({ type: 'png' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export default async function handler(req, res) {
  const { query } = req;

  try {
    if (query.url && isValidSeebrueckeUrl(query.url)) {
      const screenshot = await takeScreenshot(query.url);

      if (screenshot) {
        res.setHeader('Cache-Control', `public, max-age=${60 * 60 * 24}`);
        res.setHeader('Content-Type', 'image/png');
        res.status(200).send(screenshot);
      } else {
        res.status(500).send();
      }
    } else {
      throw new Error(
        "Either the url parameter wasn't passed of the URL is not allowed to be screenshotted."
      );
    }
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .send(
        process.env.NODE_ENV !== 'production'
          ? JSON.stringify(serializeError(error))
          : ''
      );
  }

  return {};
}
