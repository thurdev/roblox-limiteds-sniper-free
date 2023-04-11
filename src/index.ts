import dotenv from 'dotenv'
dotenv.config()

import {
  getItemDetails,
  getItems,
  getMarketplaceDetails,
} from './utils/preparedRequests'
import { buy } from './utils/actions'
import { timeout } from './utils/timers'
import chalk from 'chalk'
import { now } from './utils/timers'

let logSearching = false

;(async () => {
  while (true) {
    if (!logSearching) {
      console.log(
        `${chalk.gray(`[${now()}]`)} ${chalk.yellow(
          `[🔁] Searching for items...`
        )}`
      )
      logSearching = true
    }

    await timeout(1500)
    const items = await getItems().catch(() => {
      console.log(
        `${chalk.gray(`[${now()}]`)} ${chalk.red(`[❌] Failed to get items!`)}`
      )
    })

    if (items && items.length > 0) {
      logSearching = false

      console.log(
        `${chalk.gray(`[${now()}]`)} ${chalk.cyan('[❗] Found items!')}`
      )
      console.log(
        `${chalk.gray(`[${now()}]`)} ${chalk.cyan(
          `[🛒] Getting items details...`
        )}`
      )

      const itemsDetails = await Promise.all(
        items.map(async (item) => {
          return await getItemDetails(item)
        })
      )

      const itemsMarketDetails = await Promise.all(
        itemsDetails.map(async (item) => {
          return await getMarketplaceDetails(item?.collectibleItemId)
        })
      )

      const itemsToBuy = itemsMarketDetails.filter(
        (item) => item?.unitsAvailableForConsumption > 0 && item?.price == 0
      )

      console.log(
        `${chalk.gray(`[${now()}]`)} ${chalk.cyan(
          `[🛒] Buying items ${itemsToBuy.map((i) => i.name).join(',')}...`
        )}`
      )

      await buy(itemsToBuy)
        .then((response: { error: boolean; name: string }) => {
          console.log(
            `${chalk.gray(`[${now()}]`)} ${chalk.green(
              `[✅] Successfully bought item: ${response.name}!`
            )}`
          )
        })
        .catch((err) => {
          console.log(
            `${chalk.gray(`[${now()}]`)} ${chalk.red(
              `[❌] Failed to buy items! Reason: ${err.title}`
            )}`
          )
        })
    } else {
      await timeout(1500)
    }
  }
})()
;(async () => {
  const buyWhenAvailable: string[] = ['13066756593']

  for (const id of buyWhenAvailable) {
    const itemDetails = await getItemDetails({ itemType: 'Asset', id: id })
    while (true) {
      await timeout(10000)
      const itemMarketDetails = await getMarketplaceDetails(
        itemDetails?.collectibleItemId
      )

      if (itemMarketDetails?.unitsAvailableForConsumption > 0) {
        console.log(
          `${chalk.gray(`[${now()}]`)} ${chalk.cyan(
            `[❗] Item: ${itemDetails.name} has ${itemMarketDetails.unitsAvailableForConsumption} units available!`
          )}`
        )
        console.log(
          `${chalk.gray(`[${now()}]`)} ${chalk.cyan(
            `[🛒] Buying item ${itemDetails.name}...`
          )}`
        )
        await buy([itemMarketDetails])
          .then((response: { error: boolean; name: string }) => {
            console.log(
              `${chalk.gray(`[${now()}]`)} ${chalk.green(
                `[✅] Successfully bought item: ${response.name}!`
              )}`
            )
          })
          .catch((err) => {
            console.log(
              `${chalk.gray(`[${now()}]`)} ${chalk.red(
                `[❌] Failed to buy items! Reason: ${err.title}`
              )}`
            )
          })
      } else {
        console.log(
          `${chalk.gray(`[${now()}]`)} ${chalk.red(
            `[❌] Item: ${itemDetails.name}is not available anymore!`
          )}`
        )
      }
    }
  }
})()
