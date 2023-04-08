type ItemType = "Asset" | "GamePass";

export type Item = {
  id: number;
  itemType: ItemType;
};

export type ItemDetails = {
  assetType: number;
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
  name: string;
  offSaleDeadline?: unknown;
  price: number;
  priceStatus: string;
  productId: number;
};
