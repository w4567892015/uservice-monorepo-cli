import inquirer, { Answers, PromptModule } from 'inquirer';

import load from '@commitlint/load';
import lint from '@commitlint/lint';

import { Input } from '../interfaces';
import { AbstractAction } from '../abstract/abstract.action';

import { AI_MESSAGES, ERROR_MESSAGE } from '../../libs/handler';

import { createChatCompletion } from '../../libs/openai';

import {
  assertGitRepo, getGitStagedDiff, gitCommit, getPrompt,
} from './libs/git';

import { merge } from './libs/template/template.action';

const LOAD_OPTIONS = { cwd: __dirname };
const CONFIG = { extends: ['@commitlint/config-conventional'] };

const itemsFinder = (name: string, items: Input[]) => items.find((item) => item.name === name);

export class AICommitAction extends AbstractAction {
  public async handle(options: Input[]): Promise<void> {
    await assertGitRepo().catch(ERROR_MESSAGE.ERROR_HANDLER);

    console.info(AI_MESSAGES.GIT_DIFF);
    const staged = await getGitStagedDiff();
    if (!staged) {
      ERROR_MESSAGE.ERROR_HANDLER('No staged changes found. Stage your changes manually, or automatically stage all changes with the `--all` flag.');
    }
    const locale = itemsFinder('locale', options).value as string;
    const content = getPrompt(locale, staged);

    const url = itemsFinder('url', options).value as string;
    const key = itemsFinder('key', options).value as string;
    console.info(AI_MESSAGES.AI_ANALYZING_START);

    const { message, usage } = await createChatCompletion(url, key, content);
    AI_MESSAGES.AI_ANALYZING_MESSAGES('We are trying to summarize a git diff', usage);

    const { message: title, usage: t_usage } = await createChatCompletion(url, key, merge('ai_git_commit_subject', { message, locale }));
    AI_MESSAGES.AI_ANALYZING_MESSAGES('We are trying to summarize a title for pull request', t_usage);

    const { message: scope, usage: s_usage } = await createChatCompletion(url, key, merge('ai_git_commit_scope', { message: staged, locale }));
    AI_MESSAGES.AI_ANALYZING_MESSAGES('We are trying to summarize a scope for pull request', s_usage);

    const { message: prefix, usage: p_usage } = await createChatCompletion(url, key, merge('ai_git_commit_prefix', { message, locale }));
    AI_MESSAGES.AI_ANALYZING_MESSAGES('We are trying to get conventional commit prefix', p_usage);

    const total_usage = [usage, t_usage, p_usage].reduce((t, c) => ({
      prompt_tokens: t.prompt_tokens + c.prompt_tokens,
      completion_tokens: t.completion_tokens + c.completion_tokens,
      total_tokens: t.total_tokens + c.total_tokens,
    }));

    AI_MESSAGES.AI_ANALYZING_MESSAGES('Total Token Usage:', total_usage);
    console.info(AI_MESSAGES.AI_ANALYZING_END);
    await AI_MESSAGES.AI_ANALYZING_COST(total_usage.total_tokens);

    const commit_message: string = merge('ai_git_commit_summary', {
      prefix,
      scope: `(${scope})`,
      title,
      message,
    });

    const opts = await load(CONFIG, LOAD_OPTIONS);

    const isPreview = itemsFinder('preview', options).value as boolean;
    console.info(`================ ${isPreview ? 'Preview' : 'Commit'} Summary ====================\n`);
    console.info(commit_message);
    console.info('====================================================');

    const report = await lint(
      commit_message,
      opts.rules,
      opts.parserPreset ? { parserOpts: opts.parserPreset.parserOpts } : {},
    );

    AI_MESSAGES.CODE_CONVENTIONAL('Conventional Commit.', report.valid);

    if (!report.valid) {
      report.errors.forEach((e) => {
        ERROR_MESSAGE.ERROR_HANDLER(`[${e.name}] ${e.message}`, false);
      });
    }

    if (!isPreview) {
      const prompt: PromptModule = inquirer.createPromptModule();

      const editor: Answers = await prompt([{
        type: 'editor',
        name: 'message',
        message: 'Editor commit message.',
        default: commit_message,
        async validate(text) {
          const report = await lint(
            text,
            opts.rules,
            opts.parserPreset ? { parserOpts: opts.parserPreset.parserOpts } : {},
          );
          if (!report.valid) {
            return report.errors.map((e) => (`[${e.name}] ${e.message}`)).join('\n');
          }
          return report.valid;
        },
        waitUserInput: false,
      }]);

      await gitCommit(editor.message);
      console.info(AI_MESSAGES.GIT_COMMIT);
      AI_MESSAGES.GIT_KIND_MESSAGES();
    }
    process.exit(0);
  }
}
