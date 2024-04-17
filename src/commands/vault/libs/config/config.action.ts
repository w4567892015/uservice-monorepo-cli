import fs from 'fs';
import path from 'path';
import os from 'os';
import ini from 'ini';

import { ERROR_MESSAGE } from '../../../../libs/handler/error';

const configName = '.vault-config';

const defaultConfigPath = path.join(process.env.PWD, configName);

const configPath = fs.existsSync(defaultConfigPath)
  ? defaultConfigPath : path.join(os.homedir(), configName);

interface Config {
  VAULT_URL: string;
  USER_TOKEN: string;
  EXPIRE_TIME: string;
}

const configParsers = {
  VAULT_URL(url: string, error?: Function): string {
    if (!url) {
      error('Please set your Vault url via `vault config -s VAULT_URL=<vault url>`');
    }
    return url;
  },
  USER_TOKEN(token: string): string {
    return token;
  },
  EXPIRE_TIME(time: string): string {
    return time;
  },
};

const readConfigFile = async () => {
  const configExists = fs.existsSync(configPath);
  if (!configExists) {
    throw new Error(`The "${configName}" file is not found. Please run "aicommits config -h" to help.`);
  }

  const configString = fs.readFileSync(configPath, 'utf8');
  return ini.parse(configString);
};

export const getConfig = async (): Promise<Config> => {
  const config = await readConfigFile().catch(ERROR_MESSAGE.ERROR_HANDLER);
  const parsedConfig = {};

  for (const key of Object.keys(configParsers)) {
    const parser = configParsers[key];
    const value = config[key];
    parsedConfig[key] = parser(value, ERROR_MESSAGE.ERROR_HANDLER) as string;
  }

  return parsedConfig as Config;
};

export const setConfig = async (keyValues: [key: string, value: string][]) => {
  let config = {} as any;

  try {
    config = await readConfigFile();
  } catch (error) {
    fs.writeFileSync(configPath, '', 'utf8');
  }

  for (const [key, value] of keyValues) {
    const parsed = configParsers[key as string](value, ERROR_MESSAGE.ERROR_HANDLER);
    config[key] = parsed;
  }

  fs.writeFileSync(configPath, ini.stringify(config), 'utf8');
};
