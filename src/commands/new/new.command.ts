// import ora from 'ora';
import { Command, OptionValues } from 'commander';
import { Input } from '../interfaces';
import { AbstractCommand } from '../abstract/abstract.command';

export class NewCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('new [name]')
      .alias('n')
      .description('Generate Nest Lerna monorepo.')
      .option('--directory [directory]', 'Specify the destination directory')
      .option('-g, --skip-git', 'Skip git repository initialization.', false)
      .option('-s, --skip-install', 'Skip package installation.', false)
      .action(async (name: string, opt: OptionValues) => {
        const inputs: Input[] = [];
        inputs.push({ name: 'name', value: name });

        const options: Input[] = [];
        options.push({ name: 'directory', value: opt.directory });
        options.push({ name: 'skip-git', value: opt.skipGit });
        options.push({ name: 'skip-install', value: opt.skipInstall });

        await this.action.handle(inputs, options);
      });
  }
}
