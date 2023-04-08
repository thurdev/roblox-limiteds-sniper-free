import axios from "axios";
import { Item, ItemDetails } from "../types";

export const getItems = async (): Promise<Item[]> => {
  const config = {
    method: "get",
    url: "https://catalog.roblox.com/v1/search/items?category=All&limit=120&maxPrice=0&minPrice=0&salesTypeFilter=2&sortType=4",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      cookie: process.env.ROBLOX_COOKIES,
    },
  };

  const response = await axios(config).catch((err) => {
    console.log("Could not get items", JSON.stringify(err.response.data));
    return err.response;
  });
  return response.data.data;
};

export const getItemDetails = async (itemData: Item): Promise<ItemDetails> => {
  const config = {
    method: "post",
    url: "https://catalog.roblox.com/v1/catalog/items/details",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      cookie: process.env.ROBLOX_COOKIES,
    },
    data: {
      items: [itemData],
    },
  };

  const response = await axios(config).catch((err) => {
    console.log(
      "Could not get item details",
      JSON.stringify(err.response.data)
    );
    return err.response;
  });
  return response.data.data;
};

export const buyItem = async (item: ItemDetails) => {
  const config = {
    method: "post",
    url: "https://economy.roblox.com/v1/purchases/products/" + item.id,
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      cookie: process.env.ROBLOX_COOKIES,
    },
    data: {
      expectedCurrency: 1,
      expectedPrice: item.price,
      expectedSellerId: item.creatorTargetId,
    },
  };

  const response = await axios(config).catch((err) => {
    console.log("Could not buy item", JSON.stringify(err.response.data));
    return err.response;
  });
  return response.data;
};
