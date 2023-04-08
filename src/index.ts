import dotenv from "dotenv";
dotenv.config();

import { getItems } from "./utils/preparedRequests";
import { buy } from "./utils/actions";
import { timeout } from "./utils/timers";
import chalk from "chalk";

let logSearching = false;

(async () => {
  while (true) {
    if (!logSearching) {
      console.log(chalk.yellow("[🔁] Searching for items..."));
      logSearching = true;
    }

    await timeout(1000);
    const items = await getItems();

    if (items.length > 0) {
      logSearching = false;
      console.log(chalk.cyan("[❗] Found items!"));
      console.log(chalk.cyan("[🛒] Buying items..."));
      await buy(items)
        .then(() => {
          console.log(chalk.green("[✅] Successfully bought items!"));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await timeout(5000);
    }
  }
})();
