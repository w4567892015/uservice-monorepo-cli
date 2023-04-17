import { spawn, SpawnOptions } from 'child_process';
import chalk from 'chalk';
import { MESSAGES } from '../handler';

export abstract class AbstractRunner {
  constructor(
    protected binary?: string,
    protected args: string[] = [],
  ) {}

  async run<T>(
    command: string,
    collect = false,
    cwd = process.cwd(),
  ): Promise<T> {
    const args = this.binary ? [command] : [];
    const options: SpawnOptions = {
      cwd,
      stdio: collect ? 'pipe' : 'inherit',
      shell: true,
    };
    // console.log(command, args, options);
    return new Promise((resolve, reject) => {
      const child = spawn(
        this.binary ? `${this.binary}` : command,
        [...this.args, ...args],
        options,
      );
      if (collect) {
        child.stdout!.on('data', (data) => resolve(data.toString().replace(/\r\n|\n/, '')));
      }
      child.on('close', (code) => {
        if (code === 0) {
          resolve(null);
        } else {
          console.error(
            chalk.red(
              MESSAGES.RUNNER_EXECUTION_ERROR(`${this.binary} ${command}`),
            ),
          );
          reject();
        }
      });
    });
  }
}
