import defaults from 'defaults';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import mergeWith from 'lodash-es/mergeWith.js';

import { DEFAULT_OPTIONS } from './index.js';
import type {
  BaseOptions,
  Chat,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMetadata,
  ChatCompletionTool,
  ChatCompletionToolChoiceOption,
  ChatCompletionsModel,
} from './types.js';
import {
  isChatCompletion,
  isChatCompletionChunk,
  isChatCompletionMessage,
  isMarkpromptMetadata,
  isNoStreamingData,
  parseEncodedJSONHeader,
} from './utils.js';

export type {
  ChatCompletionAssistantMessageParam,
  ChatCompletionFunctionMessageParam,
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionToolMessageParam,
  ChatCompletionUserMessageParam,
} from 'openai/resources/index.mjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface PoliciesOptions {
  /**
   * If true, enable the use of policies.
   * @default true
   **/
  enabled?: boolean;
  /**
   * If true, use all policies added in the project.
   * Otherwise, only use the ones excplicitly specified
   * in the `ids` list.
   * @default true
   **/
  useAll?: boolean;
  /**
   * Only use specific policies for retrieval.
   * @default []
   **/
  ids?: string[];
}

export interface RetrievalOptions {
  /**
   * If true, enable retrieval.
   * @default true
   **/
  enabled?: boolean;
  /**
   * If true, use all sources connected in the project.
   * Otherwise, only use the ones excplicitly specified
   * in the `ids` list.
   * @default true
   **/
  useAll?: boolean;
  /**
   * Only use specific sources for retrieval.
   * @default []
   **/
  ids?: string[];
}

export interface SubmitChatOptions {
  /**
   * The assistant ID.
   **/
  assistantId?: string;
  /**
   * The assistant version ID. If not provided, the default version of
   * the assistant will be used.
   **/
  assistantVersionId?: string;
  /**
   * The system prompt.
   **/
  systemPrompt?: string;
  /**
   * Context to use for template variable replacements in the system prompt.
   * @default {}
   **/
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any;
  /**
   * The OpenAI model to use.
   * @default "gpt-4o"
   **/
  model?: ChatCompletionsModel;
  /**
   * Options for the use of policies.
   **/
  policiesOptions?: PoliciesOptions;
  /**
   * Options for retrieval.
   **/
  retrievalOptions?: RetrievalOptions;
  /**
   * The output format of the response.
   * @default "markdown"
   */
  outputFormat?: 'markdown' | 'slack' | 'html';
  /**
   * If true, output the response in JSON format.
   * @default false
   */
  jsonOutput?: boolean;
  /**
   * Remove PII from chat messages.
   * @default false
   */
  redact?: boolean;
  /**
   * The model temperature.
   * @default 0.1
   **/
  temperature?: number;
  /**
   * The model top P.
   * @default 1
   **/
  topP?: number;
  /**
   * The model frequency penalty.
   * @default 0
   **/
  frequencyPenalty?: number;
  /**
   * The model present penalty.
   * @default 0
   **/
  presencePenalty?: number;
  /**
   * The max number of tokens to include in the response.
   * @default 500
   * */
  maxTokens?: number;
  /**
   * The number of sections to include in the prompt context.
   * @default 10
   * */
  sectionsMatchCount?: number;
  /**
   * The similarity threshold between the input question and selected sections.
   * @default 0.5
   * */
  sectionsMatchThreshold?: number;
  /**
   * Thread ID. Returned with the first, and every subsequent, chat response. Used to continue a thread.
   * @default undefined
   */
  threadId?: string;
  /**
   * Metadata to attach to the thread.
   * @default undefined
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  threadMetadata?: any;
  /**
   * A list of tools the model may call. Currently, only functions are
   * supported as a tool. Use this to provide a list of functions the model may
   * generate JSON inputs for.
   */
  tools?: ChatCompletionTool[];
  /**
   * Controls which (if any) function is called by the model. `none` means the
   * model will not call a function and instead generates a message. `auto`
   * means the model can pick between generating a message or calling a
   * function. Specifying a particular function via
   * `{"type: "function", "function": {"name": "my_function"}}` forces the
   * model to call that function. `none` is the default when no functions are present. `auto` is the default if functions are present.
   */
  toolChoice?: ChatCompletionToolChoiceOption;
  /**
   * Whether or not to inject context relevant to the query.
   * @default false
   **/
  doNotInjectContext?: boolean;
  /**
   * If true, the bot may encourage the user to ask a follow-up question, for instance to gather additional information.
   * @default true
   **/
  allowFollowUpQuestions?: boolean;
  /**
   * Whether or not to include message in insights.
   * @default false
   **/
  excludeFromInsights?: boolean;
  /**
   * AbortController signal.
   * @default undefined
   **/
  signal?: AbortSignal;
  /**
   * Enabled debug mode. This will log debug and error information to the console.
   * @default false
   */
  debug?: boolean;
  /**
   * Message returned when the model does not have an answer.
   * @default "Sorry, I am not sure how to answer that."
   * @deprecated Will be removed.
   **/
  iDontKnowMessage?: string;
  /**
   * Disable streaming and return the entire response at once.
   */
  stream?: boolean;
  additionalMetadata?: {
    [key: string]: unknown;
  };
}

export const DEFAULT_SUBMIT_CHAT_OPTIONS = {
  frequencyPenalty: 0,
  iDontKnowMessage: 'Sorry, I am not sure how to answer that.',
  model: 'gpt-4o',
  presencePenalty: 0,
  temperature: 0.1,
  topP: 1,
  stream: true,
  outputFormat: 'markdown',
} as const satisfies SubmitChatOptions;

const validSubmitChatOptionsKeys: (keyof (SubmitChatOptions & BaseOptions))[] =
  [
    'assistantId',
    'assistantVersionId',
    'apiUrl',
    'allowFollowUpQuestions',
    'context',
    'debug',
    'doNotInjectContext',
    'excludeFromInsights',
    'frequencyPenalty',
    'iDontKnowMessage',
    'jsonOutput',
    'maxTokens',
    'model',
    'outputFormat',
    'policiesOptions',
    'presencePenalty',
    'redact',
    'retrievalOptions',
    'sectionsMatchCount',
    'sectionsMatchThreshold',
    'stream',
    'systemPrompt',
    'temperature',
    'threadId',
    'threadMetadata',
    'toolChoice',
    'tools',
    'topP',
    'additionalMetadata',
  ];

const isValidSubmitChatOptionsKey = (
  key: string,
): key is keyof SubmitChatOptions => {
  return validSubmitChatOptionsKeys.includes(key as keyof SubmitChatOptions);
};

export type SubmitChatYield =
  Chat.Completions.ChatCompletionChunk.Choice.Delta & ChatCompletionMetadata;

export type SubmitChatReturn = ChatCompletionMessage & ChatCompletionMetadata;

function checkAbortSignal(signal?: AbortSignal): void {
  if (signal?.aborted) {
    if (signal.reason instanceof Error) {
      throw signal.reason;
    }

    throw new Error(signal.reason);
  }
}

export async function* submitChat(
  messages: ChatCompletionMessageParam[],
  projectKey: string,
  options: SubmitChatOptions & BaseOptions = {},
): AsyncGenerator<SubmitChatYield, SubmitChatReturn | undefined> {
  if (!projectKey) {
    throw new Error('A projectKey is required.');
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return;
  }

  const validOptions: SubmitChatOptions & BaseOptions = Object.fromEntries(
    Object.entries(options).filter(([key]) => isValidSubmitChatOptionsKey(key)),
  );

  const { signal, tools, toolChoice, additionalMetadata, ...cloneableOpts } =
    validOptions;
  const { debug, policiesOptions, retrievalOptions, ...resolvedOptions } =
    defaults(
      {
        ...cloneableOpts,
        // Only include known tool properties
        tools: tools?.map((tool) => ({
          function: tool.function,
          type: tool.type,
        })),
        toolChoice: toolChoice,
      },
      {
        ...DEFAULT_OPTIONS,
        // If assistantId is provided, do not set default values,
        // as it will then override the assistant-provided values
        // in case that allowClientSideOverrides is set for the
        // assistant.
        ...(validOptions.assistantId ? {} : DEFAULT_SUBMIT_CHAT_OPTIONS),
      },
    ) as BaseOptions & SubmitChatOptions;

  const res = await fetch(`${resolvedOptions.apiUrl}/chat`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-Markprompt-API-Version': '2024-05-21',
    }),
    body: JSON.stringify({
      projectKey,
      messages,
      debug,
      ...resolvedOptions,
      policies: policiesOptions,
      retrieval: retrievalOptions,
      additionalMetadata,
    }),
    signal,
  });

  const data = parseEncodedJSONHeader(res, 'x-markprompt-data');

  checkAbortSignal(options.signal);

  if (res.headers.get('Content-Type')?.includes('application/json')) {
    const json = await res.json();

    if (
      isChatCompletion(json) &&
      isMarkpromptMetadata(data) &&
      json.choices?.[0]
    ) {
      return { ...json.choices[0].message, ...data };
    } else {
      if (isMarkpromptMetadata(data)) {
        yield data;
      }

      if (isNoStreamingData(json)) {
        yield {
          content: json.text,
          references: json.references,
          role: 'assistant',
        };

        return;
      }

      throw new Error('Malformed response from Markprompt API', {
        cause: json,
      });
    }
  }

  if (isMarkpromptMetadata(data)) {
    yield data;
  }

  if (!res.ok || !res.body) {
    checkAbortSignal(options.signal);

    const text = await res.text();

    try {
      const json = JSON.parse(text);
      if (json.error) {
        throw new Error(json.error);
      }
    } catch (e) {
      // ignore
    }

    throw new Error(text);
  }

  checkAbortSignal(options.signal);

  // eslint-disable-next-line prefer-const
  let completion = {};

  const stream = res.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
    .getReader();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value: event, done } = await stream.read();

    if (done) break;
    if (!event) continue;

    if (event.data === '[DONE]') {
      continue;
    }

    // eslint-disable-next-line prefer-const
    let json = JSON.parse(event.data);

    if (!isChatCompletionChunk(json)) {
      throw new Error('Malformed response from Markprompt API', {
        cause: json,
      });
    }

    mergeWith(completion, json.choices?.[0]?.delta, concatStrings);

    checkAbortSignal(options.signal);
    /**
     * If we do not yield a structuredClone here, the completion object will
     * become read-only/frozen and TypeErrors will be thrown when trying to
     * merge the next chunk into it.
     */
    yield structuredClone(completion);
  }

  checkAbortSignal(options.signal);

  if (isChatCompletionMessage(completion) && isMarkpromptMetadata(data)) {
    return { ...completion, ...data };
  }
}

function concatStrings(dest: unknown, src: unknown): unknown {
  if (typeof dest === 'string' && typeof src === 'string') {
    return dest + src;
  }

  return undefined;
}
