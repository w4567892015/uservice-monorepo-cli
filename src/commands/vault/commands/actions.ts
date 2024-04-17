import inquirer from 'inquirer';
import NodeVault from 'node-vault';
import { Input } from '../../interfaces';

import { ERROR_MESSAGE, VAULT_MESSAGES } from '../../../libs/handler';

import {
  VaultLoginOutput, VaultLoginResponse, VaultMethod, VaultFormat,
} from '../libs/vault.type';

import { envStringify, envCommonStringify } from '../libs/env';

import { login } from '../libs/vault';

const itemsFinder = (name: string, items: Input[]) => items.find((item) => item.name === name);

const parserHelper = (input: string, format: VaultFormat): VaultLoginResponse => {
  switch (format) {
  case VaultFormat.json:
  default:
    return JSON.parse(input) as VaultLoginResponse;
  }
};

export const loginAction = async (options: Input[]): Promise<VaultLoginOutput> => {
  const address = itemsFinder('url', options).value as string;
  const method = itemsFinder('method', options).value as string;
  const format = itemsFinder('format', options).value as string;

  const loginInfo = await login({
    method: VaultMethod[method],
    address,
    format: VaultFormat[format],
  });

  const userData = parserHelper(loginInfo, VaultFormat[format]);

  const user_token = userData.auth.client_token;

  const client = NodeVault({
    endpoint: address,
    apiVersion: 'v1',
    token: user_token,
  });

  const tokenInfo = await client.read('/auth/token/lookup-self');

  const { data: { expire_time } } = tokenInfo;

  VAULT_MESSAGES.LOGIN_SUCCESS(expire_time);

  return {
    user_token,
    expire_time,
  };
};

export const getVariableAction = async (options: Input[]): Promise<void> => {
  const address = itemsFinder('url', options).value as string;
  const user_token = itemsFinder('user_token', options).value as string;

  const database = itemsFinder('db', options).value as boolean;
  const key_value = itemsFinder('kv', options).value as boolean;

  const client = NodeVault({
    endpoint: address,
    apiVersion: 'v1',
    token: user_token,
  });

  const mounts = await client.mounts();
  const mountData = mounts.data;

  if (database) {
    const { database } = await inquirer.prompt([{
      type: 'list',
      name: 'database',
      message: 'Which database would you like to use?',
      choices: Object.keys(mountData).filter((key) => mountData[key].type === 'database'),
    }]);

    const { data: { keys } } = await client.list(`${database}roles`);

    const { role } = await inquirer.prompt([{
      type: 'list',
      name: 'role',
      message: 'Which database role would you like to use?',
      choices: keys,
    }]);

    const result = await client.read(`${database}creds/${role}`);

    const oldDate = new Date();
    const newDate = new Date();
    newDate.setTime(oldDate.getTime() + (result.lease_duration * 1000));

    VAULT_MESSAGES.DATABASE_RESPONSE({
      user: result.data.username,
      pd: result.data.password,
      expire_time: newDate.toISOString(),
    });
  } else if (key_value) {
    const { keyValue } = await inquirer.prompt([{
      type: 'list',
      name: 'keyValue',
      message: 'Which key value would you like to use?',
      choices: Object.keys(mountData).filter((key) => mountData[key].type === 'kv'),
    }]);

    let metadata = '';

    try {
      do {
        // eslint-disable-next-line no-await-in-loop
        const { data: { keys } } = await client.list(`${keyValue}metadata/${metadata}`);
        // eslint-disable-next-line no-await-in-loop
        const data = await inquirer.prompt([{
          type: 'list',
          name: 'metadata',
          message: 'Which metadata would you like to use?',
          choices: keys,
        }]);
        metadata += data.metadata;
      } while (metadata[metadata.length - 1] === '/');
    } catch (error) {
      ERROR_MESSAGE.ERROR_HANDLER(`The key value ${keyValue} doesn't have metadata`);
    }

    const { data: { current_version, versions } } = await client.read(`${keyValue}metadata/${metadata}`);

    const { version } = await inquirer.prompt([{
      type: 'list',
      name: 'version',
      default: current_version.toString(),
      message: 'Which version would you like to use?',
      choices: Object.keys(versions).filter((key) => !versions[key].destroyed),
    }]);

    const result = await client.read(`${keyValue}data/${metadata}?version=${version}`);
    const { data, metadata: md } = result.data;

    VAULT_MESSAGES.KEY_VALUE_RESPONSE({
      data: envStringify(data),
      metadata: envCommonStringify({
        kv: `${keyValue}${metadata}`,
        version: md.version,
        created_time: md.created_time,
        deletion_time: md.deletion_time || 'null',
      }),
    });
  } else {
    ERROR_MESSAGE.ERROR_HANDLER('You must choose a database or key value');
  }

  process.exit(0);
};
