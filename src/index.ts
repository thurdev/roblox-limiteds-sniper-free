import dotenv from "dotenv";
dotenv.config();

import {
  getItemDetails,
  getItems,
  getMarketplaceDetails,
} from "./utils/preparedRequests";
import { buy } from "./utils/actions";
import { timeout } from "./utils/timers";
import chalk from "chalk";
import { generateXCSRFToken } from "./utils/token";
import { now } from "./utils/timers";

let logSearching = false;

(async () => {
  const XCSRFTOKEN = await generateXCSRFToken();
  console.log({ XCSRFTOKEN });
  while (true) {
    if (!logSearching) {
      console.log(
        chalk.gray(`[${now()}]`) + chalk.yellow(`[🔁] Searching for items...`)
      );
      logSearching = true;
    }
    await timeout(1500);
    const items = await getItems().catch((err) => {
      console.log(
        chalk.gray(`[${now()}]`) + chalk.red(`[❌] Failed to get items!`)
      );
    });
    if (items && items.length > 0) {
      logSearching = false;
      console.log(chalk.gray(`[${now()}]`) + chalk.cyan("[❗] Found items!"));
      console.log(
        chalk.gray(`[${now()}]`) + chalk.cyan(`[🛒] Buying items...`)
      );

      let itemsDetails = await Promise.all(
        items.map(async (item) => {
          return await getItemDetails(item);
        })
      );

      let itemsMarketDetails = await Promise.all(
        itemsDetails.map(async (item) => {
          return await getMarketplaceDetails(item.collectibleItemId);
        })
      );

      let itemsToBuy = itemsMarketDetails.filter(
        (item) => item.unitsAvailableForConsumption > 0 && item.price == 0
      );

      await buy(itemsToBuy)
        .then((response: { error: boolean; name: string }) => {
          console.log(
            chalk.gray(`[${now()}]`) +
              chalk.green(`[✅] Successfully bought item: ${response.name}!`)
          );
        })
        .catch((err) => {
          console.log(
            chalk.gray(`[${now()}]`) +
              chalk.red(`[❌] Failed to buy items! Reason: ${err.title}`)
          );
        });
    } else {
      await timeout(1500);
    }
  }
})();

(async () => {
  const buyWhenAvailable = ["13063266647"];

  for (var id of buyWhenAvailable) {
    const itemDetails = await getItemDetails({ itemType: "Asset", id: id });
    while (true) {
      await timeout(2500);
      const itemMarketDetails = await getMarketplaceDetails(
        itemDetails?.collectibleItemId
      );

      if (itemMarketDetails?.unitsAvailableForConsumption > 0) {
        console.log(
          chalk.gray(`[${now()}]`) +
            chalk.cyan(
              `[❗] Item: ${itemDetails.name} has ${itemMarketDetails.unitsAvailableForConsumption} units available!`
            )
        );
        console.log(
          chalk.gray(`[${now()}]`) +
            chalk.cyan(`[🛒] Buying item ${itemDetails.name}...`)
        );
        await buy([itemMarketDetails])
          .then((response: { error: boolean; name: string }) => {
            console.log(
              chalk.gray(`[${now()}]`) +
                chalk.green(`[✅] Successfully bought item: ${response.name}!`)
            );
          })
          .catch((err) => {
            console.log(
              chalk.gray(`[${now()}]`) +
                chalk.red(`[❌] Failed to buy items! Reason: ${err.title}`)
            );
          });
      }
    }
  }
})();
