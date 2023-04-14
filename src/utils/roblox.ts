import { Browser } from '../__puppeteer';
import { CurrentUser } from '../types/types';

import puppeteer from 'puppeteer';

export const getCurrentUser = async (): Promise<CurrentUser> => {
  return puppeteer.launch().then(async (browser: Browser) => {
    const page = await browser.newPage();
    await page.goto(process.env.ROBLOX_HTML_PATH); // Change this to your path
    const data = await page.evaluate(() => {
      return window.Roblox.CurrentUser;
    });
    browser.close();
    return data;
  });
};

export const generateRandomUUID = async () => {
  return puppeteer.launch().then(async (browser: Browser) => {
    const page = await browser.newPage();
    await page.goto(process.env.ROBLOX_HTML_PATH); // Change this to your path
    const data = await page.evaluate(() => {
      return window.CoreUtilities.uuidService.generateRandomUuid();
    });
    browser.close();
    return data;
  });
};
