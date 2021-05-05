import { serializeError } from 'serialize-error';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer';

// Allowed hostnames for URLs
const HOSTNAMES = [
  'neu.seebruecke.org',
  'seebruecke.org',
  'frontend-git-develop-seebruecke-org.vercel.app',
  'localhost:3000'
];

function isValidUrl(string) {
  try {
    const url = new URL(string);

    return url && HOSTNAMES.includes(url.host);
  } catch (_) {
    return false;
  }
}

async function getBrowserInstance() {
  const executablePath = await chromium.executablePath;
  const defaults = {
    defaultViewport: {
      width: 1280,
      height: 640
    }
  };

  if (!executablePath) {
    return puppeteer.launch({
      ...defaults,
      args: chromium.args,
      headless: true,
      ignoreHTTPSErrors: true
    });
  }

  return chromium.puppeteer.launch({
    ...defaults,
    args: chromium.args,
    executablePath,
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
  } catch (error) {
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export default async function handler(req, res) {
  const { query } = req;

  try {
    if (query.url && isValidUrl(query.url)) {
      const screenshot = await takeScreenshot(query.url);

      if (screenshot) {
        res.setHeader('Cache-Control', `public, max-age=${60 * 60 * 24}`);
        res.setHeader('Content-Type', 'image/png');
        res.status(200).send(screenshot);
      }

      res.status(500).send();
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
