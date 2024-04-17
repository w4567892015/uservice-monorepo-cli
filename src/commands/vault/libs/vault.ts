import { format } from 'util';
import { join } from 'path';
import { VaultRunner } from '../../../libs/runners';

import { VaultLoginOptions } from './vault.type';

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
      throw new Error('Please install vault first.');
    }
    throw new Error(error);
  }
};

export const logout = async () => {

};
