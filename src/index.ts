import dotenv from "dotenv";
dotenv.config();

import { getItems } from "./utils/preparedRequests";
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
    await timeout(2500);
    const items = await getItems().catch((err) => {
      console.log(
        chalk.gray(`[${now()}]`) + chalk.red(`[❌] Failed to get items!`)
      );
    });
    console.log({ items });
    if (items && items.length > 0) {
      logSearching = false;
      console.log(chalk.gray(`[${now()}]`) + chalk.cyan("[❗] Found items!"));
      console.log(
        chalk.gray(`[${now()}]`) + chalk.cyan(`[🛒] Buying items...`)
      );
      await buy(items)
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
      await timeout(2500);
    }
  }
})();
