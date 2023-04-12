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
import { Item } from './types/types';
import { log, title } from './utils/terminal';
import Job from './job';

const cronExpressionFiveSeconds = '*/5 * * * * *';
let itemsBought = 0;
let itemsFound = 0;
let isSearching = false;

title('Roblox Limited Sniper | Not logged in | 0 items found | 0 items bought');

new Job('Search for items', cronExpressionFiveSeconds, async () => {
  if (!isSearching) {
    log(`[🔁] Searching for items...`, chalk.yellow);
  }
  isSearching = true;
}).run();

// (async () => {
//   while (true) {
//     if (!logSearching) {
//       console.log(
//         chalk.gray(`[${now()}]`) + chalk.yellow(`[🔁] Searching for items...`)
//       );
//       logSearching = true;
//     }
//     await timeout(1500);
//     const items = await getItems().catch((err) => {
//       console.log(
//         chalk.gray(`[${now()}]`) + chalk.red(`[❌] Failed to get items!`)
//       );
//     });
//     if (items && items.length > 0) {
//       logSearching = false;
//       console.log(chalk.gray(`[${now()}]`) + chalk.cyan("[❗] Found items!"));
//       console.log(
//         chalk.gray(`[${now()}]`) + chalk.cyan(`[🛒] Getting items details...`)
//       );

//       let itemsDetails = await Promise.all(
//         items.map(async (item: Item) => {
//           return await getItemDetails(item);
//         })
//       );

//       let itemsMarketDetails = await Promise.all(
//         itemsDetails.map(async (item) => {
//           return await getMarketplaceDetails(item?.collectibleItemId);
//         })
//       );

//       let itemsToBuy = itemsMarketDetails.filter(
//         (item) => item?.unitsAvailableForConsumption > 0 && item?.price == 0
//       );

//       console.log(
//         chalk.gray(`[${now()}]`) +
//           chalk.cyan(
//             `[🛒] Buying items ${itemsToBuy.map((i) => i.name).join(",")} ...`
//           )
//       );

//       await buy(itemsToBuy)
//         .then((response: { error: boolean; name: string }) => {
//           console.log(
//             chalk.gray(`[${now()}]`) +
//               chalk.green(`[✅] Successfully bought item: ${response.name}!`)
//           );
//         })
//         .catch((err) => {
//           console.log(
//             chalk.gray(`[${now()}]`) +
//               chalk.red(`[❌] Failed to buy items! Reason: ${err.title}`)
//           );
//         });
//     } else {
//       await timeout(1500);
//     }
//   }
// })();

// (async () => {
//   const buyWhenAvailable: number[] = [];

//   for (var id of buyWhenAvailable) {
//     const itemDetails = await getItemDetails({ itemType: "Asset", id: id });
//     while (true) {
//       await timeout(10000);
//       const itemMarketDetails = await getMarketplaceDetails(
//         itemDetails?.collectibleItemId
//       );

//       if (itemMarketDetails?.unitsAvailableForConsumption > 0) {
//         console.log(
//           chalk.gray(`[${now()}]`) +
//             chalk.cyan(
//               `[❗] Item: ${itemDetails.name} has ${itemMarketDetails.unitsAvailableForConsumption} units available!`
//             )
//         );
//         console.log(
//           chalk.gray(`[${now()}]`) +
//             chalk.cyan(`[🛒] Buying item ${itemDetails.name}...`)
//         );
//         await buy([itemMarketDetails])
//           .then((response: { error: boolean; name: string }) => {
//             console.log(
//               chalk.gray(`[${now()}]`) +
//                 chalk.green(`[✅] Successfully bought item: ${response.name}!`)
//             );
//           })
//           .catch((err) => {
//             console.log(
//               chalk.gray(`[${now()}]`) +
//                 chalk.red(`[❌] Failed to buy items! Reason: ${err.title}`)
//             );
//           });
//       } else {
//         console.log(
//           chalk.gray(`[${now()}]`) +
//             chalk.red(`[❌] Item: ${itemDetails.name}is not available anymore!`)
//         );
//       }
//     }
//   }
// })();
