import util from 'util';
import { join } from 'path';
import chalk from 'chalk';
import * as inquirer from 'inquirer';
import { Answers } from 'inquirer';

import { MESSAGES } from '../../libs/handler';
import { generateInput } from '../../libs/questions/questions';

import { Input } from '../interfaces';
import { AbstractAction } from '../abstract/abstract.action';

import { ShellRunner, GitRunner } from '../../libs/runners';

const itemsFinder = (name: string, items: Input[]) => items.find((item) => item.name === name);

const shouldSkipAction = (name: string, options: Input[]) => options.some(
  (option) => option.name === name && option.value === true,
);

const replaceInputMissingInformation = (
  inputs: Input[],
  answers: Answers,
): Input[] => {
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (input.value === undefined) {
      input.value = answers[input.name];
    }
  }
  return inputs;
};

const askForMissingInformation = async (inputs: Input[], options?: Input[]) => {
  console.info(MESSAGES.PROJECT_INFORMATION_START);
  console.info();

  const prompt: inquirer.PromptModule = inquirer.createPromptModule();

  const nameInput = itemsFinder('name', inputs);
  if (!nameInput!.value) {
    const message = 'What name would you like to use for the new project?';
    const questions = [generateInput('name', message)('mvb-monorepo')];
    const answers: Answers = await prompt(questions);
    replaceInputMissingInformation(inputs, answers);
    console.log(inputs, answers);
  }
};

const getProjectDirectory = (
  applicationNameValue: string,
  directoryOptionValue?: string,
): string => (directoryOptionValue || applicationNameValue);

const ShellDeleteGitFolder = async (dirPath: string) => {
  const runner = new ShellRunner();
  await runner.run('rm -rf .git', true, dirPath).catch(() => {
    console.error(chalk.red('Folder not found'));
  });
};

const initializeGitRepository = async (dir: string) => {
  const runner = new GitRunner();
  await runner.run('init', true, join(process.cwd(), dir)).catch(() => {
    console.error(chalk.red('Git repository has not been initialized'));
  });
};

export class NewAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    // const dryRunOption = optionsFinder('dry-run', options);

    await askForMissingInformation(inputs, options);

    const projectDirectory = getProjectDirectory(
      itemsFinder('name', inputs).value as string,
      itemsFinder('directory', options).value as string,
    );


    // if (!shouldSkipAction('skip-install', options)) {

    // };
    if (!shouldSkipAction('skip-git', options)) {
      await initializeGitRepository(projectDirectory);
    }
    process.exit(0);
  }
}
