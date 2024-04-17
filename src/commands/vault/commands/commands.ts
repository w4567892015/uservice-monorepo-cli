import { Command, OptionValues } from 'commander';
import { Input } from '../../interfaces';

import { VAULT_MESSAGES, ERROR_MESSAGE } from '../../../libs/handler';

import { getConfig, setConfig } from '../libs/config/config.action';

import { loginAction, getVariableAction } from './actions';

export const loginCommand = (program: Command): Command => {
  const commander = program
    .command('login')
    .description('Login Vault.')
    .option('-m, --method <method>', 'Login method', 'oidc')
    .option('-f, --format <format>', 'Output format', 'json')
    .action(async (opt: OptionValues) => {
      const config = await getConfig();

      const options: Input[] = [];
      options.push({ name: 'url', value: config.VAULT_URL });
      options.push({ name: 'method', value: opt.method });
      options.push({ name: 'format', value: opt.format });

      const { user_token, expire_time } = await loginAction(options);
      await setConfig([
        ['USER_TOKEN', user_token],
        ['EXPIRE_TIME', expire_time],
      ]);
      process.exit(0);
    });
  return commander;
};

export const getVariableCommand = (program: Command): Command => {
  const commander = program
    .command('get')
    .description('Get variable in Vault.')
    .option('-db, --database', 'get db', false)
    .option('-kv, --key_value', 'get key_value', false)
    .action(async (opt: OptionValues) => {
      const config = await getConfig();

      const now = new Date();
      const expire_time = new Date(config.EXPIRE_TIME);

      if (!config.EXPIRE_TIME || config.EXPIRE_TIME === '') ERROR_MESSAGE.ERROR_HANDLER('Please login again.');

      if (expire_time.getTime() - now.getTime() > 0) {
        const options: Input[] = [];
        options.push({ name: 'url', value: config.VAULT_URL });
        options.push({ name: 'user_token', value: config.USER_TOKEN });
        options.push({ name: 'db', value: opt.database });
        options.push({ name: 'kv', value: opt.key_value });
        await getVariableAction(options);
      } else {
        ERROR_MESSAGE.ERROR_HANDLER(`The token has expired at "${config.EXPIRE_TIME}".\nPlease login again.`);
      }
      process.exit(0);
    });
  return commander;
};

export const logoutCommand = (program: Command): Command => {
  const commander = program
    .command('logout')
    .description('logout Vault.')
    .action(async () => {
      await setConfig([
        ['USER_TOKEN', ''],
        ['EXPIRE_TIME', ''],
      ]);
      console.info(VAULT_MESSAGES.LOGOUT_SUCCESS);
      process.exit(0);
    });
  return commander;
};
