import { format } from 'util';
import { join } from 'path';
import { VaultRunner } from '../../../libs/runners';

import { VaultLoginOptions } from './vault.type';

import { EMOJIS } from '../../../libs/handler/emojis';
import { ERROR_MESSAGE } from '../../../libs/handler';

const runner = new VaultRunner();

function commandHelp(
  command: string[],
  options: string[] = [],
  path: string[] = [],
  args: string[] = [],
): string {
  return format('%s %s %s %s', command.join(' '), options.join(' '), path.join(' '), args.join(' '));
}

export const login = async ({ method, address, format }: VaultLoginOptions) => {
  const command = ['login'];
  const options = [];
  if (method) options.push(`-method="${method}"`);
  if (address) options.push(`-address="${address}"`);
  if (format) options.push(`-format="${format}"`);

  try {
    return await runner.run<string>(
      commandHelp(command, options),
      true,
      join(process.cwd()),
    );
  } catch (err) {
    const error = err as string;
    if (error.indexOf('vault: not found') > 0) {
      ERROR_MESSAGE.ERROR_HANDLER(`Please install vault first.\n\n${EMOJIS.APPLE} 'sudo brew install vault'\n\n${EMOJIS.LAPTOP} 'sudo apt install vault'`);
      process.exit(1);
    }
    ERROR_MESSAGE.ERROR_HANDLER(error);
    process.exit(1);
  }
};
