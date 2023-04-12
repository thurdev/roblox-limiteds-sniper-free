import { exec } from "child_process";
import chalk, { ChalkFunction } from "chalk";
import { now } from "./timers";

export const log = (message: string, chalkColor: ChalkFunction) => {
  console.log(chalk.gray(`[${now()}]`) + chalkColor(message));
};

export const title = (message: string) => {
  exec(`title ${message.replace("|", "|")}`);
};
