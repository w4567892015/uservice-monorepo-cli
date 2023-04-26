import { Command, OptionValues } from 'commander';
import { Input } from '../interfaces';
import { AbstractCommand } from '../abstract/abstract.command';

import { configCommand } from './libs/config/config.command';
import { getConfig } from './libs/config/config.action';

export class AICommitCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('aicommits')
      .alias('aics')
      .description('Generate git commits.')
      .option('-f, --file [path]', 'Commit message to file.')
      .option('-p, --preview', 'Preview ai commit.', false)
      .addCommand(configCommand(program))
      .action(async (opt: OptionValues) => {
        const config = await getConfig();

        const options: Input[] = [];
        options.push({ name: 'url', value: config.OPENAI_URL });
        options.push({ name: 'key', value: config.OPENAI_KEY });
        options.push({ name: 'locale', value: config.LOCALE });
        options.push({ name: 'file', value: opt.file });
        options.push({ name: 'preview', value: opt.preview });

        await this.action.handle(options);
      });
  }
}
