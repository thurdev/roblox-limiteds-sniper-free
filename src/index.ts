import dotenv from 'dotenv';
dotenv.config();

import {
  getItemDetails,
  getItems,
  getMarketplaceDetails,
} from './utils/preparedRequests';
import { buy } from './utils/actions';
import { generateXCSRFToken } from './utils/token';
import chalk from 'chalk';
import { Item, ItemDetails, MarketPlaceItemDetail } from './types/types';
import { log, title } from './utils/terminal';
import Job from './class/job';
import { getCurrentUser } from './utils/preparedRequests';
import art from 'ascii-art';
import fs from 'fs';

const cronExpressionFiveSeconds = '*/5 * * * * *';
let itemsBought = 0;
let isSearching = false;
let isRunning = false;
const hasNoStock: number[] = [];

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
    return;
  }

  if (!isSearching) {
    log(`[⌛] Searching for items...`, chalk.yellow);
    title(0, itemsBought, user);
  }
  isSearching = true;

  const items = await getItems({}).catch(() => {
    log(`[❌] Failed to get items!`, chalk.red);
    isRunning = false;
    return [];
  });

  const filterItemsThatProbablyHaveStock = items.filter((item) => {
    if (hasNoStock.includes(item.id)) {
      return false;
    }
    return true;
  });

  if (filterItemsThatProbablyHaveStock.length > 0) {
    title(items.length, itemsBought, user);
    isSearching = false;
    log(`[❗] Found items!`, chalk.cyan);

    const itemsDetails = await Promise.all(
      items.map(async (item: Item) => {
        return await getItemDetails(item).catch(() => {
          log(`[❌] Failed to get item details!`, chalk.red);
          isRunning = false;
          return null;
        });
      })
    );

    let itemsMarketDetails = await Promise.all(
      itemsDetails.map(async (item: ItemDetails | null) => {
        if (!item) return null;
        return await getMarketplaceDetails(item.collectibleItemId).catch(() => {
          log(`[❌] Failed to get marketplace details!`, chalk.red);
          isRunning = false;
          return null;
        });
      })
    );

    itemsMarketDetails = itemsMarketDetails.filter((item) => item !== null);
    const itemsWithNoStock = itemsMarketDetails.filter(
      (item) => item && item.unitsAvailableForConsumption <= 0
    );

    if (itemsWithNoStock.length > 0) {
      itemsWithNoStock.forEach((item) => {
        if (!item) return;
        if (!hasNoStock.includes(item.itemTargetId)) {
          hasNoStock.push(item.itemTargetId);
          log(
            `[❗] Item with id ${item.itemTargetId} (${item.name}) has no stock!`,
            chalk.red
          );
        }
      });
      isRunning = false;
      return;
    }

    await buy(itemsMarketDetails as MarketPlaceItemDetail[], user)
      .then((boughtResponse) => {
        if (boughtResponse?.success) {
          log(`[✔] Bought items: ${boughtResponse.names}`, chalk.green);
          itemsBought += boughtResponse.itemsLenght as number;
          title(0, itemsBought, user);
          isRunning = false;
        }
      })
      .catch((err) => {
        log(
          `[❌] Failed to buy item, reason: ${err?.errorMessage}!`,
          chalk.red
        );
        isRunning = false;
      });
  } else {
    isRunning = false;
  }
}).run();

let isRunning2 = false;
let isChecking = false;

new Job(
  'Search for items in their page',
  cronExpressionFiveSeconds,
  async () => {
    if (isRunning2) {
      return;
    }

    const itemsIds = JSON.parse(
      fs.readFileSync('./items.json', 'utf8')
    ) as number[];

    if (itemsIds.length <= 0) {
      return;
    }

    for (let i = 0; i < itemsIds.length; i++) {
      if (hasNoStock.includes(itemsIds[i])) {
        itemsIds.splice(i, 1);
        fs.writeFileSync('./items.json', JSON.stringify(itemsIds), 'utf8');
        isChecking = false;
        return;
      }
    }

    if (!isChecking) {
      log(
        `[⌛] Detected items at ${chalk.bold('items.json')}, checking...`,
        chalk.yellow
      );
    }
    isChecking = true;

    isRunning2 = true;
    const user = await getCurrentUser().catch(() => {
      log(`[❌] Failed to get user!`, chalk.red);
      return null;
    });

    if (!user) {
      isRunning2 = false;
      return;
    }

    const itemsDetails = await Promise.all(
      itemsIds.map(async (itemId) => {
        return await getItemDetails({ id: itemId, itemType: 'Asset' }).catch(
          () => {
            log(
              `[❌] Failed to get details from items at ${chalk.bold(
                'items.json'
              )}!`,
              chalk.red
            );
            isRunning2 = false;
            return null;
          }
        );
      })
    );

    let itemsMarketDetails = await Promise.all(
      itemsDetails.map(async (item: ItemDetails | null) => {
        if (!item) return null;
        return await getMarketplaceDetails(item.collectibleItemId).catch(() => {
          log(`[❌] Failed to get marketplace details!`, chalk.red);
          isRunning2 = false;
          return null;
        });
      })
    );

    itemsMarketDetails = itemsMarketDetails.filter((item) => item !== null);

    const itemsWithNoStock = itemsMarketDetails.filter(
      (item) => item && item.unitsAvailableForConsumption <= 0
    );

    if (itemsWithNoStock.length > 0) {
      itemsWithNoStock.forEach((item) => {
        if (!item) return;
        if (!hasNoStock.includes(item.itemTargetId)) {
          hasNoStock.push(item.itemTargetId);
          log(
            `[❗] Item with id ${item.itemTargetId} (${item.name}) has no stock!`,
            chalk.red
          );
          isChecking = false;
        }
      });
      isRunning2 = false;
      return;
    }

    await buy(itemsMarketDetails as MarketPlaceItemDetail[], user)
      .then((boughtResponse) => {
        if (boughtResponse?.success) {
          log(`[✔] Bought items: ${boughtResponse.names}`, chalk.green);
          itemsBought += boughtResponse.itemsLenght as number;
          title(0, itemsBought, user);
          isRunning2 = false;
        }
      })
      .catch((err) => {
        log(
          `[❌] Failed to buy item, reason: ${err?.errorMessage}!`,
          chalk.red
        );
        isRunning2 = false;
      });
  }
).run();
