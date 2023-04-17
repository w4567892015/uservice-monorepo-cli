import chalk from 'chalk';
import { EMOJIS } from './emojis';

export const MESSAGES = {
  PROJECT_INFORMATION_START: `${EMOJIS.ZAP} We will scaffold your app in a few seconds..`,
  GET_STARTED_INFORMATION: `${EMOJIS.POINT_RIGHT} Get started with the following commands:`,
  RUNNER_EXECUTION_ERROR: (command: string) => `\nFailed to execute command: ${command}`,
};

export const AI_MESSAGES = {
  GIT_DIFF: `${EMOJIS.MAG} Detecting staged files...`,
  GIT_COMMIT: `${chalk.green(EMOJIS.HEAVY_CHECK_MARK)} Successfully committed!`,
  GIT_KIND_MESSAGES: () => {
    console.info(`${chalk.red(EMOJIS.TWO_HEARTS)} If you want to edit the commit message. you can use the \`git commit --amend\` command.`);
  },
  GIT_COMMIT_SKIPPED: `${EMOJIS.HEAVY_CHECK_MARK} Cancelled commit`,
  AI_ANALYZING_START: `${EMOJIS.ROBOT_FACE} The AI is analyzing your changes...`,
  AI_ANALYZING_MESSAGES: (message: string, usage: any): void => {
    console.info(chalk.blue(`${EMOJIS.ZAP} ${message}`));
    console.info(chalk.magenta(`${EMOJIS.ZAP} PromptTokens: ${usage.prompt_tokens}, CompletionTokens: ${usage.completion_tokens}, TotalTokens: ${usage.total_tokens}`));
  },
  AI_ANALYZING_END: `${chalk.yellow(EMOJIS.ZAP)} Changes analyzed!`,
  AI_ANALYZING_COST: (total_tokens: number): void => {
    // Azure OpenAi pricing
    // Region: East US
    // Currency: TWD
    // https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/
    console.info(chalk.red(`${EMOJIS.MONEY_WITH_WINGS} Cost: NT$${(total_tokens / 1000) * 0.060873}`));
  },
};

export const ERROR_MESSAGE = {
  ERROR_HANDLER: (error: string): void => {
    console.error(chalk.red(`${EMOJIS.HEAVY_MULTIPLICATION_X} ${error}`));
    process.exit(0);
  },
};
