#!/usr/bin/env node
import { program } from 'commander';

import { CommandLoader } from '../commands/command.loader';

const { version } = require('../../package.json');

const bootstrap = async () => {
  program
    .name('uservice')
    .description('CLI to some uSerivce tools')
    .version(version, '-v, --version', 'Output the current version.')
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.');

  await CommandLoader.load(program);

  program.parseAsync(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

bootstrap();
