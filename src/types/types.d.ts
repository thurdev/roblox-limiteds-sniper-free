type ItemType = 'Asset' | 'GamePass';

export type Item = {
  id: number;
  itemType: ItemType;
};

export type ItemDetails = {
  assetType: number;
  collectibleItemId: string;
  creatorHasVerifiedBadge: boolean;
  creatorName: string;
  creatorTargetId: number;
  creatorType: string;
  description: string;
  favoriteCount: number;
  genres: string[];
  id: number;
  itemRestrictions: string[];
  itemStatus: string[];
  itemType: ItemType;
  lowestPrice: number;
  name: string;
  offSaleDeadline?: unknown;
  price: number;
  totalQuantity: number;
  priceStatus: string;
  unitsAvailableForConsumption: number;
  productId: number;
};

export type MarketPlaceItemDetail = {
  assetStock: number;
  collectibleItemId: string;
  collectibleProductId: string;
  creatorHasVerifiedBadge: boolean;
  creatorId: number;
  creatorName: string;
  creatorType: string;
  description: string;
  errorCode: null;
  itemRestrictions: null;
  itemTargetId: number;
  lowestPrice: number;
  name: string;
  offSaleDeadline: string;
  price: number;
  unitsAvailableForConsumption: number;
};

export type CurrentUser = {
  displayName: string;
  hasVerifiedBadge: boolean;
  is13orOver: boolean;
  isAuthenticated: boolean;
  isPremiumUser: boolean;
  isUnder13: false;
  name: string;
  userId: string;
};

export type BuyItemPayload = {
  expectedCurrency: number;
  expectedPrice: number;
  collectibleItemId: string;
  expectedPurchaserId: string;
  expectedPurchaserType: string;
  expectedSellerId: number;
  expectedSellerType: string;
  idempotencyKey: string;
  collectibleProductId: string;
  name?: string;
};
