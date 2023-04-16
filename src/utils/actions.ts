import {
  BuyItemPayload,
  CurrentUser,
  Item,
  MarketPlaceItemDetail,
} from '../types/types';

import { buyItem } from './preparedRequests';

import { generateRandomUUID } from '../utils/roblox';

export const buy = async (
  items: MarketPlaceItemDetail[],
  user: CurrentUser
): Promise<{ [key: string]: unknown }> => {
  return new Promise(async (resolve, reject) => {
    if (!items)
      return reject({ error: true, message: 'No items to buy', name: '' });

    const boughtItems: BuyItemPayload[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const buyPayload: BuyItemPayload = {
        expectedCurrency: 1,
        expectedPrice: item?.price,
        collectibleItemId: item?.collectibleItemId,
        expectedPurchaserId: user?.UserId,
        expectedPurchaserType: 'User',
        expectedSellerId: item?.creatorId,
        expectedSellerType: 'User',
        idempotencyKey: await generateRandomUUID(),
        collectibleProductId: item?.collectibleProductId,
        name: item?.name,
      };

      await buyItem(buyPayload).then((res) => {
        if (res?.purchased === true) {
          boughtItems.push(buyPayload);
        } else {
          reject({
            error: true,
            ...res,
          });
        }
      });
      if (i === items.length - 1) {
        resolve({
          success: true,
          names: boughtItems.map((item) => item.name).join(', '),
          itemsLenght: boughtItems.length,
        });
      }
    }
  });
};
