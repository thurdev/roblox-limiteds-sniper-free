import { CurrentUser } from "./types/types";

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
