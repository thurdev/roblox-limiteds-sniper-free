import { Item } from "../types";

import {
  getItemDetails,
  getMarketplaceDetails,
  buyItem,
} from "./preparedRequests";

import { getCurrentUser, generateRandomUUID } from "../utils/roblox";

export const buy = async (
  items: Item[]
): Promise<{ [key: string]: unknown; error: boolean; name: string }> => {
  return new Promise(async (resolve, reject) => {
    // for (const item of items) {
    const item = items[0];
    const itemDetails = await getItemDetails(item);
    if (itemDetails.price === 0) {
      let marketPlaceDetails = await getMarketplaceDetails(
        itemDetails.collectibleItemId
      );

      let user = await getCurrentUser();

      let buyPayload = {
        expectedCurrency: 1,
        expectedPrice: itemDetails?.price,
        collectibleItemId: itemDetails?.collectibleItemId,
        expectedPurchaserId: user.userId,
        expectedPurchaserType: "User",
        expectedSellerId: itemDetails?.creatorTargetId,
        expectedSellerType: "User",
        idempotencyKey: await generateRandomUUID(), // random uuid from de.uuidService.generateRandomUuid() or CoreUtilities.uuidService.generateRandomUuid()
        collectibleProductId: marketPlaceDetails?.collectibleProductId, // wrong
      };

      await buyItem(buyPayload).then((res) => {
        console.log(res);
        if (res?.purchased === true) {
          resolve({
            error:
              res?.purchased === false ? true : !res?.purchased ? true : false,
            name: itemDetails.name,
            title: res?.purchaseResult,
          });
        } else {
          console.log(res);
          reject({
            error: true,
            ...res,
          });
        }
      });
      resolve({
        error: false,
        name: itemDetails.name,
      });
    } else {
      reject({
        error: true,
        ...itemDetails,
        title: "Item price above 0",
      });
    }
    // }
  });
};
