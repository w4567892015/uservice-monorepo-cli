import { Command } from 'commander';
import { AbstractCommand } from '../abstract/abstract.command';

import { commitCommand } from './commit/commit.command';
import { testerCommand } from './tester/tester.command';

export class AICommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('ai')
      .description('Call OpenAI.')
      .addCommand(commitCommand())
      .addCommand(testerCommand());
  }
}
