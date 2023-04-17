import axios from 'axios';
import { ERROR_MESSAGE } from './handler';

interface OpenAI {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
}

interface Choice {
  index: number;
  finish_reason: string,
  message: Message,
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

export const createChatCompletion = async (
  url: string,
  key: string,
  content: string,
  completions?: number,
): Promise<OpenAIResponse> => {
  try {
    const { data } = await axios.post<OpenAI>(
      url,
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
      },
    );
    return {
      message: data.choices
        .filter((choice) => choice.message?.content)
        .map((choice) => sanitizeMessage(choice.message!.content)),
      usage: data.usage,
    };
  } catch (error: any) {
    console.error(ERROR_MESSAGE.ERROR_HANDLER(error.message));
  }
};
