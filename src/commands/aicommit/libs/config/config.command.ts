import { Command, OptionValues } from 'commander';

import { getConfig, setConfig } from './config.action';

export const configCommand = (program: Command): Command => {
  const commander = program
    .command('config')
    .description('OpenAI configuration')
    .option('-g, --get', 'Get openAI configuration.')
    .option('-s, --set [key=value...]', 'Set openAI configuration.')
    .action(async (opt: OptionValues) => {
      if (opt.get) {
        const config = await getConfig();
        for (const [key, value] of Object.entries(config)) {
          console.log(`${key}=${value}`);
        }
      } else if (opt.set) {
        const keyValues = opt.set;
        await setConfig(keyValues.map((keyValue: string) => keyValue.split(/=(.*)/, 2) as [string, string]));
      } else {
        commander.help();
      }
    });
  return commander;
};
