import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessage,
  ChatCompletionMessageToolCall,
  ChatCompletionMetadata,
  FileSectionReference,
  NoStreamingData,
} from './types.js';

export type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessage,
  ChatCompletionMessageToolCall,
} from 'openai/resources/index.mjs';

export const getErrorMessage = async (res: Response): Promise<string> => {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return json?.error ?? text;
  } catch {
    return text;
  }
};

export const parseEncodedJSONHeader = (
  response: Response,
  name: string,
): unknown | undefined => {
  try {
    const headerValue = response.headers.get(name);
    if (headerValue) {
      const headerArray = new Uint8Array(headerValue.split(',').map(Number));
      const decoder = new TextDecoder();
      const decodedValue = decoder.decode(headerArray);
      return JSON.parse(decodedValue);
    }
  } catch (e) {
    // Do nothing
  }
  return undefined;
};

export function isAbortError(err: unknown): err is DOMException {
  return (
    (err instanceof DOMException && err.name === 'AbortError') ||
    (err instanceof Error && err.message.includes('AbortError'))
  );
}

export function isFileSectionReferences(
  data: unknown,
): data is FileSectionReference[] {
  return (
    Array.isArray(data) &&
    Boolean(data[0]?.file?.path) &&
    Boolean(data[0]?.file?.source?.type)
  );
}

export function isMarkpromptMetadata(
  json: unknown,
): json is ChatCompletionMetadata {
  return (
    typeof json === 'object' &&
    json !== null &&
    (('threadId' in json && typeof json.threadId === 'string') ||
      ('messageId' in json && typeof json.messageId === 'string') ||
      ('references' in json && isFileSectionReferences(json.references)))
  );
}

export function isChatCompletion(json: unknown): json is ChatCompletion {
  return (
    typeof json === 'object' &&
    json !== null &&
    'object' in json &&
    json.object === 'chat.completion'
  );
}

export const isChatCompletionMessage = (
  obj: unknown,
): obj is ChatCompletionMessage => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'content' in obj &&
    (typeof obj.content === 'string' || obj.content === null) &&
    'role' in obj &&
    obj.role === 'assistant'
  );
};

export const isToolCall = (
  tool_call: unknown,
): tool_call is ChatCompletionMessageToolCall => {
  return (
    typeof tool_call === 'object' &&
    tool_call !== null &&
    'id' in tool_call &&
    typeof tool_call.id === 'string' &&
    'type' in tool_call &&
    tool_call.type === 'function' &&
    'function' in tool_call
  );
};

export const isToolCalls = (
  tool_calls: unknown,
): tool_calls is ChatCompletionMessageToolCall[] => {
  return Array.isArray(tool_calls) && tool_calls.every(isToolCall);
};

export const isChatCompletionChunk = (
  json: unknown,
): json is ChatCompletionChunk => {
  return (
    typeof json === 'object' &&
    json !== null &&
    'object' in json &&
    typeof json.object === 'string' &&
    json.object === 'chat.completion.chunk'
  );
};

export const isKeyOf = <T extends object>(
  obj: T,
  key: PropertyKey,
): key is keyof T => key in obj;

export const isNoStreamingData = (data: unknown): data is NoStreamingData => {
  return typeof data === 'object' && data !== null && 'text' in data;
};
