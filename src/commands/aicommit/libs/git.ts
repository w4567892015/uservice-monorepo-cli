import fs from 'fs';
import { join } from 'path';
import { GitRunner } from '../../../libs/runners';
import { merge } from './template/template.action';

import { ERROR_MESSAGE } from '../../../libs/handler';

const excludeFromDiff = (path: string) => `':!${path}'`;

const filesToExclude = [
  'package-lock.json',
  'pnpm-lock.yaml',

  // yarn.lock, Cargo.lock, Gemfile.lock, Pipfile.lock, etc.
  '*.lock',
].map(excludeFromDiff);

export const assertGitRepo = async () => {
  const isExist = fs.existsSync(join(process.cwd(), '.git'));
  if (!isExist) {
    throw new Error('The current directory must be a Git repository!');
  }
};

export const getGitStagedDiff = async (excludeFiles?: string[]): Promise<string> => {
  const excludeFilesString = [...filesToExclude, ...(excludeFiles || [])].join(' ');

  const runner = new GitRunner();

  const files = await runner.run<string>(`diff --cached --name-only --diff-algorithm=minimal -- . ${excludeFilesString}`, true, join(process.cwd())).catch(() => {
    console.error(ERROR_MESSAGE.ERROR_HANDLER('Git repository has not been initialized'));
    process.exit(1);
  });
  if (!files) return;

  const diff = await runner.run<string>(`diff --cached --diff-algorithm=minimal -- . ${excludeFilesString}`, true, join(process.cwd())).catch(() => {
    console.error(ERROR_MESSAGE.ERROR_HANDLER('Git repository has not been initialized'));
    process.exit(1);
  });

  return diff as string;
};

export const gitCommit = async (message: string): Promise<void> => {
  const runner = new GitRunner();
  await runner.run<string>(`commit -m '${message}'`, true, join(process.cwd())).catch(() => {
    console.error(ERROR_MESSAGE.ERROR_HANDLER('Git commit error'));
    process.exit(1);
  });
};

export const getPrompt = (locale: string, diff: string) => merge('ai_git_commit_message', { locale, diff });
