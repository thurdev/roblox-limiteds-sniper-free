import { Item } from "../types";

import { getItemDetails, buyItem } from "./preparedRequests";

export const buy = async (items: Item[]) => {
  return new Promise(async (resolve, reject) => {
    for (const item of items) {
      const itemDetails = await getItemDetails(item);

      if (itemDetails.price === 0) {
        await buyItem(itemDetails);
        resolve(true);
      } else {
        reject(false);
      }
    }
  });
};
