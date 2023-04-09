import { CurrentUser } from "./types";

declare global {
  interface Window {
    Roblox: {
      CurrentUser: CurrentUser;
    };
    CoreUtilities: {
      uuidService: {
        generateRandomUuid: () => string;
      };
    };
  }
}
