import { Browser } from "../__puppeteer";
import { CurrentUser } from "../types/types";

const puppeteer = require("puppeteer");

export const getCurrentUser = async (): Promise<CurrentUser> => {
  return puppeteer.launch().then(async (browser: Browser) => {
    const page = await browser.newPage();
    await page.goto(process.env.ROBLOX_HTML_PATH); // Change this to your path
    const data = await page.evaluate(() => {
      return window.Roblox.CurrentUser;
    });
    await browser.close();
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
    await browser.close();
    return data;
  });
};
