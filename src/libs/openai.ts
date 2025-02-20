import axios from 'axios';
import { ERROR_MESSAGE } from './handler/error';

interface OpenAI extends OpenAIChat {
  choices: Choice[];
}

interface Choice {
  text: string,
  index: number;
  finish_reason: string,
}

interface OpenAIChat {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChoiceChat[];
  usage: Usage;
}

interface ChoiceChat {
  index: number;
  finish_reason: string,
  message?: Message,
}

interface Message {
  role: string;
  content: string;
}

interface Usage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}

const sanitizeMessage = (message: string) => message.replace(/^\n+/, '');

interface OpenAIResponse {
  message: string[];
  usage: Usage;
}

type ChatCompletionInput = {
  url: string,
  key: string,
  content: string,
  completions?: number,
  model?: string,
  apiVersion?: string,
};

export const createChatCompletion = async ({
  url,
  key,
  content,
  completions = 1,
  model = 'gpt-35-turbo',
  apiVersion = '2023-03-15-preview',
}: ChatCompletionInput): Promise<OpenAIResponse> => {
  try {
    const { data } = await axios.post<OpenAIChat>(
      `${url}/openai/deployments/${model}/chat/completions`,
      {
        messages: [{
          role: 'user',
          content,
        }],
        max_tokens: 800,
        temperature: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1,
        stop: null,
        n: completions || 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': key,
        },
        params: {
          'api-version': apiVersion,
        },
      },
    );
    return {
      message: data.choices
        .filter((choice) => choice.message?.content)
        .map((choice) => sanitizeMessage(choice.message!.content)),
      usage: data.usage,
    };
  } catch (error: any) {
    console.log(error);
    ERROR_MESSAGE.ERROR_HANDLER(error.message);
  }
};

export const createCompletion = async (
  url: string,
  key: string,
  content: string,
  model = 'gpt-35-turbo-instruct',
  apiVersion = '2024-08-01-preview',
): Promise<OpenAIResponse> => {
  try {
    const { data } = await axios.post<OpenAI>(
      `${url}/openai/deployments/${model}/completions`,
      {
        prompt: content,
        max_tokens: 800,
        temperature: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0,
        best_of: 1,
        top_p: 1,
        stop: null,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': key,
        },
        params: {
          'api-version': apiVersion,
        },
      },
    );
    return {
      message: data.choices
        .filter((choice) => choice.text)
        .map((choice) => sanitizeMessage(choice.text)),
      usage: data.usage,
    };
  } catch (error: any) {
    ERROR_MESSAGE.ERROR_HANDLER(error.message);
  }
};
