import fs from 'fs';
import path from 'path';
import os from 'os';
import ini from 'ini';

import { ERROR_MESSAGE } from '../../../../../libs/handler';

const configName = '.aicommits';

const defaultConfigPath = path.join(process.env.PWD, configName);

const configPath = fs.existsSync(defaultConfigPath)
  ? defaultConfigPath : path.join(os.homedir(), configName);

interface Config {
  OPENAI_URL: string;
  OPENAI_KEY: string;
  LOCALE: string;
}

const configParsers = {
  OPENAI_URL(url: string, error?: Function): string {
    if (!url) {
      error('Please set your OpenAI API url via `aicommits config -s OPENAI_URL=<azure openai url>`');
    }
    return url;
  },
  OPENAI_KEY(key: string, error?: Function) {
    if (!key) {
      error('Please set your OpenAI API key via `aicommits config -s OPENAI_KEY=<azure openai key>`');
    }
    return key;
  },
  LOCALE(locale?: string, error?: Function) {
    // Must be a valid locale (letters and dashes/underscores). You can consult the list of codes in: https://wikipedia.org/wiki/List_of_ISO_639-1_codes
    return locale || 'en-US';
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
