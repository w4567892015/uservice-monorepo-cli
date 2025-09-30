import { Command, OptionValues } from 'commander';
import { Input } from '../../interfaces';

import { configCommand } from './libs/config/config.command';
import { getConfig } from './libs/config/config.action';

import { testerAction } from './tester.action';

export const testerCommand = (): Command => {
  const commander = new Command('tester')
    .alias('tr')
    .description('Generate unit test.')
    .requiredOption('-f, --file [path]', 'Target file path.')
    .option('-o, --output [path]', 'Output file path.')
    .option('-p, --preview', 'Preview ai unit test.', false)
    .addCommand(configCommand())
    .action(async (opt: OptionValues) => {
      const config = await getConfig();

      const options: Input[] = [];
      options.push({ name: 'url', value: config.OPENAI_URL });
      options.push({ name: 'key', value: config.OPENAI_KEY });
      options.push({ name: 'file', value: opt.file });
      options.push({ name: 'output', value: opt.output });
      options.push({ name: 'preview', value: opt.preview });

      await testerAction(options);
    });
  return commander;
};
