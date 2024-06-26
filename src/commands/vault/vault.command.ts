import { Command } from 'commander';
import { AbstractCommand } from '../abstract/abstract.command';

import { configCommand } from './libs/config/config.command';
import { loginCommand, getVariableCommand, logoutCommand } from './commands/commands';

export class VaultCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('vault')
      .description('Call Vault.')
      .addCommand(configCommand(program))
      .addCommand(loginCommand(program))
      .addCommand(getVariableCommand(program))
      .addCommand(logoutCommand(program));
  }
}
