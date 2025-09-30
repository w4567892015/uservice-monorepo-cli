import { Command, OptionValues } from 'commander';
import { Input } from '../../interfaces';

import { configCommand } from './libs/config/config.command';
import { getConfig } from './libs/config/config.action';

import { commitAction } from './commit.action';

export const commitCommand = (): Command => {
  const commander = new Command('commits')
    .alias('cs')
    .description('Generate git commits.')
    .option('-f, --file [path]', 'Commit message to file.')
    .option('-p, --preview', 'Preview ai commit.', false)
    .addCommand(configCommand())
    .action(async (opt: OptionValues) => {
      const config = await getConfig();

      const options: Input[] = [];
      options.push({ name: 'url', value: config.OPENAI_URL });
      options.push({ name: 'key', value: config.OPENAI_KEY });
      options.push({ name: 'model', value: config.OPENAI_MODEL });
      options.push({ name: 'locale', value: config.LOCALE });
      options.push({ name: 'file', value: opt.file });
      options.push({ name: 'preview', value: opt.preview });

      await commitAction(options);
    });
  return commander;
};
