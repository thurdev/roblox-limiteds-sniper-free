import { Item, MarketPlaceItemDetail } from "../types";

import {
  getItemDetails,
  getMarketplaceDetails,
  buyItem,
} from "./preparedRequests";

import { getCurrentUser, generateRandomUUID } from "../utils/roblox";

export const buy = async (
  items: MarketPlaceItemDetail[]
): Promise<{ [key: string]: unknown; error: boolean; name: string }> => {
  return new Promise(async (resolve, reject) => {
    let user = await getCurrentUser();
    for (const item of items) {
      let buyPayload = {
        expectedCurrency: 1,
        expectedPrice: item?.price,
        collectibleItemId: item?.collectibleItemId,
        expectedPurchaserId: user.userId,
        expectedPurchaserType: "User",
        expectedSellerId: item?.creatorId,
        expectedSellerType: "User",
        idempotencyKey: await generateRandomUUID(), // random uuid from de.uuidService.generateRandomUuid() or CoreUtilities.uuidService.generateRandomUuid()
        collectibleProductId: item?.collectibleProductId, // wrong
      };

      await buyItem(buyPayload).then((res) => {
        if (res?.purchased === true) {
          resolve({
            error: false,
            name: item?.name,
          });
        } else {
          console.log(res);
          reject({
            error: true,
            ...res,
          });
        }
      });
    }
  });
};
