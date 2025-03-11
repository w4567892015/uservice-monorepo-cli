import { Command } from 'commander';
import { Input } from '../interfaces';
import { AbstractCommand } from '../abstract/abstract.command';

import { triggerCommand } from './libs/trigger/trigger.command';

export class PipelineCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('pipeline [app_name]')
      .alias('ap')
      .description('Generate azure pipeline yml.')
      .addCommand(triggerCommand())
      .action(async (name) => {
        const inputs: Input[] = [];
        inputs.push({ name: 'name', value: name });

        await this.action.handle(inputs);
      });
  }
}
