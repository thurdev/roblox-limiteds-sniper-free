import { exec } from 'child_process';
import chalk, { ChalkFunction } from 'chalk';
import { now } from './timers';
import { CurrentUser } from '../types/types';

export const log = (
  message: string,
  chalkColor: ChalkFunction,
  timestamp = true
) => {
  let timestampTitle = '';
  if (timestamp) {
    timestampTitle = chalk.gray(`[${now()}]`);
  }
  console.log(timestampTitle + chalkColor(message));
};

export const title = (
  itemsFound: number,
  itemsBought: number,
  user: CurrentUser | null
) => {
  exec(
    `title Roblox Limited Sniper  -  ${
      user ? `Logged in as ${user.Name}` : 'Not logged in'
    }  -  ${itemsFound} items found  -  ${itemsBought} items bought`
  );
};
