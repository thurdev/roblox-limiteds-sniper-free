import dotenv from 'dotenv';
dotenv.config();

import {
  getItemDetails,
  getItems,
  getMarketplaceDetails,
} from './utils/preparedRequests';
import { buy } from './utils/actions';
import { timeout } from './utils/timers';
import { generateXCSRFToken } from './utils/token';
import chalk from 'chalk';
import { Item, ItemDetails, MarketPlaceItemDetail } from './types/types';
import { log, title } from './utils/terminal';
import Job from './class/job';
import { getCurrentUser } from './utils/roblox';
import art from 'ascii-art';

const cronExpressionFiveSeconds = '*/5 * * * * *';
let itemsBought = 0;
let isSearching = false;
let isRunning = false;

// clear console
console.clear();
art
  .font('   RBX Limited Sniper', 'doom')
  .toPromise()
  .then((data) => {
    log(data, chalk.magentaBright, false);
  });

title(0, itemsBought, null);

new Job('Search for items', cronExpressionFiveSeconds, async () => {
  if (isRunning) {
    return;
  }
  isRunning = true;
  await generateXCSRFToken();
  const user = await getCurrentUser().catch(() => {
    log(`[❌] Failed to get user!`, chalk.red);
    return null;
  });

  if (!user) {
    isRunning = false;
    return process.exit(0);
  }

  if (!isSearching) {
    log(`[⌛] Searching for items...`, chalk.yellow);
    title(0, itemsBought, user);
  }
  isSearching = true;

  const items = await getItems({}).catch(() => {
    log(`[❌] Failed to get items!`, chalk.red);
    isSearching = false;
    return [];
  });

  if (items.length > 0) {
    title(items.length, itemsBought, user);
    isSearching = false;
    log(`[❗] Found items!`, chalk.cyan);

    const itemsDetails = await Promise.all(
      items.map(async (item: Item) => {
        return await getItemDetails(item).catch(() => {
          log(`[❌] Failed to get item details!`, chalk.red);
          isSearching = false;
          return null;
        });
      })
    );

    let itemsMarketDetails = await Promise.all(
      itemsDetails.map(async (item: ItemDetails | null) => {
        if (!item) return null;
        return await getMarketplaceDetails(item.collectibleItemId).catch(() => {
          log(`[❌] Failed to get marketplace details!`, chalk.red);
          isSearching = false;
          return null;
        });
      })
    );

    itemsMarketDetails = itemsMarketDetails.filter((item) => item !== null);

    await buy(itemsMarketDetails as MarketPlaceItemDetail[], user)
      .then((boughtResponse) => {
        if (boughtResponse?.success) {
          log(`[✔] Bought items: ${boughtResponse.names}`, chalk.green);
          itemsBought += boughtResponse.itemsLenght as number;
          title(0, itemsBought, user);
          isRunning = false;
        }
      })
      .catch(() => {
        log(`[❌] Failed to buy item!`, chalk.red);
        isSearching = false;
      });
  } else {
    isRunning = false;
  }
}).run();
