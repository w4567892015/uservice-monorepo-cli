import chalk from 'chalk';
import { EMOJIS } from './emojis';

export const ERROR_MESSAGE = {
  ERROR_HANDLER: (error: string, autoExit: boolean = true): void => {
    console.error(chalk.red(`${EMOJIS.HEAVY_MULTIPLICATION_X} ${error}`));
    if (autoExit) process.exit(0);
  },
};
