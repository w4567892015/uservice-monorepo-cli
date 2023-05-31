import chalk from 'chalk';
import { EMOJIS } from './emojis';

import { getAzurePrices, unitStringToNumber, getAzureItemResponse } from '../azure_price';

export const MESSAGES = {
  PROJECT_INFORMATION_START: `${EMOJIS.ZAP} We will scaffold your app in a few seconds..`,
  GET_STARTED_INFORMATION: `${EMOJIS.POINT_RIGHT} Get started with the following commands:`,
  RUNNER_EXECUTION_ERROR: (command: string) => `\nFailed to execute command: ${command}`,
};

export const AI_MESSAGES = {
  GIT_DIFF: `${EMOJIS.MAG} Detecting staged files...`,
  GIT_COMMIT_WRITE_FILE: (filePath: string) => {
    console.info(`${chalk.green(EMOJIS.HEAVY_CHECK_MARK)} Write the commit message to ${filePath} file`);
  },
  GIT_COMMIT: `${chalk.green(EMOJIS.HEAVY_CHECK_MARK)} Successfully committed!`,
  GIT_KIND_MESSAGES: () => {
    console.info(`${chalk.red(EMOJIS.TWO_HEARTS)} If you want to edit the commit message. you can use the \`git commit --amend\` command.`);
  },
  GIT_COMMIT_SKIPPED: `${EMOJIS.HEAVY_CHECK_MARK} Cancelled commit`,
  AI_ANALYZING_START: `${EMOJIS.ROBOT_FACE} The AI is analyzing your data...`,
  AI_ANALYZING_MESSAGES: (message: string, usage: any): void => {
    console.info(chalk.blue(`${EMOJIS.ZAP} ${message}`));
    console.info(chalk.magenta(`${EMOJIS.ZAP} PromptTokens: ${usage.prompt_tokens}, CompletionTokens: ${usage.completion_tokens}, TotalTokens: ${usage.total_tokens}`));
  },
  AI_ANALYZING_END: `${chalk.yellow(EMOJIS.ZAP)} Changes analyzed!`,
  AI_ANALYZING_COST: async (total_tokens: number): Promise<void> => {
    // Azure OpenAi pricing
    // Region: East US
    // Currency: TWD
    // https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/
    const items = getAzureItemResponse(await getAzurePrices({ currencyCode: 'TWD' }));
    const { retailPrice } = items[0];
    const unitOfMeasure = unitStringToNumber(items[0].unitOfMeasure);
    console.info(chalk.red(`${EMOJIS.MONEY_WITH_WINGS} Cost: NT$${(total_tokens / unitOfMeasure) * retailPrice}`));
  },
  CODE_CONVENTIONAL: (message: string, approve: boolean) => {
    console.info(`${approve ? chalk.green(EMOJIS.HEAVY_CHECK_MARK) : chalk.red(EMOJIS.HEAVY_MULTIPLICATION_X)} ${message}`);
  },
};

export const AZURE_PIPELINE_MESSAGES = {
  PRINT_TRIGGER: ({ count, branch, trigger }) => {
    console.info('%s Found libs:', chalk.green(EMOJIS.HEAVY_CHECK_MARK), count);

    console.info(`\n${chalk.green(EMOJIS.HEAVY_CHECK_MARK)} For Branch Policies PR Filter:`);
    console.info(`${branch.join(';')}`);

    console.info(`\n${chalk.green(EMOJIS.HEAVY_CHECK_MARK)} For Pipelines Trigger:`);
    trigger.forEach((item: string) => {
      console.info(`- '${item}'`);
    });
  },
};
