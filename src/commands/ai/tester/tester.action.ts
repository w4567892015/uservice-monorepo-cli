import fs from 'fs';
import path from 'path';
import inquirer, { Answers, PromptModule } from 'inquirer';

import { Input } from '../../interfaces';

import { AI_MESSAGES, ERROR_MESSAGE } from '../../../libs/handler';

import { createCompletion } from '../../../libs/openai';

import { merge } from '../template/template.action';

const itemsFinder = (name: string, items: Input[]) => items.find((item) => item.name === name);

export const testerAction = async (options: Input[]): Promise<void> => {
  const url = itemsFinder('url', options).value as string;
  const key = itemsFinder('key', options).value as string;

  const filePath = itemsFinder('file', options).value as string;
  const targetFilePath = path.join(process.cwd(), filePath);

  const tmp = path.parse(targetFilePath);

  const content = fs.readFileSync(targetFilePath, { encoding: 'utf8', flag: 'r' });

  console.info(AI_MESSAGES.AI_ANALYZING_START);
  const { message, usage } = await createCompletion(url, key, merge('ai_unit_test_message', { content, ext: tmp.ext }));

  const unit_test_summary: string = merge('ai_unit_test_summary', {
    message,
  });

  const total_usage = [usage].reduce((t, c) => ({
    prompt_tokens: t.prompt_tokens + c.prompt_tokens,
    completion_tokens: t.completion_tokens + c.completion_tokens,
    total_tokens: t.total_tokens + c.total_tokens,
  }));

  AI_MESSAGES.AI_ANALYZING_MESSAGES('Total Token Usage:', total_usage);
  console.info(AI_MESSAGES.AI_ANALYZING_END);
  await AI_MESSAGES.AI_ANALYZING_COST(total_usage.total_tokens);

  const isPreview = itemsFinder('preview', options).value as boolean;
  let outputPath = itemsFinder('output', options).value as string;

  if (isPreview) {
    console.info('================ Preview Summary ====================\n');
    console.info(unit_test_summary);
    console.info('====================================================');
  } else {
    if (!outputPath) outputPath = targetFilePath.replace(tmp.ext, `.spec${tmp.ext}`);

    const prompt: PromptModule = inquirer.createPromptModule();
    const confirm: Answers = await prompt([{
      type: 'confirm',
      name: 'isSave',
      message: `Save unit test summary to ${outputPath.replace(process.cwd(), '.')}`,
      default: true,
    }]);

    if (confirm.isSave) fs.writeFileSync(outputPath, unit_test_summary, { encoding: 'utf8' });
  }
  process.exit(0);
};
