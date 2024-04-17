import chalk from 'chalk';
import { Command } from 'commander';
import { ERROR_PREFIX } from '../libs/handler';
import { NewCommand, NewAction } from './new';
import { AICommand } from './ai/ai.command';
import { PipelineCommand, PipelineAction } from './azure-pipeline';
import { VaultCommand } from './vault/vault.command';

export class CommandLoader {
  public static async load(program: Command): Promise<void> {
    new NewCommand(new NewAction()).load(program);
    new AICommand().load(program);
    new PipelineCommand(new PipelineAction()).load(program);
    new VaultCommand().load(program);

    this.handleInvalidCommand(program);
  }

  private static handleInvalidCommand(program: Command) {
    program.on('command:*', () => {
      console.error(
        `\n${ERROR_PREFIX} Invalid command: ${chalk.red('%s')}`,
        program.args.join(' '),
      );
      console.log(
        `See ${chalk.red('--help')} for a list of available commands.\n`,
      );
      process.exit(1);
    });
  }
}
