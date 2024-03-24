import type { DocSearchHit } from './docsearch.js';

export type {
  Chat,
  ChatCompletion,
  ChatCompletionAssistantMessageParam,
  ChatCompletionChunk,
  ChatCompletionFunctionMessageParam,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionSystemMessageParam,
  ChatCompletionTool,
  ChatCompletionToolChoiceOption,
  ChatCompletionToolMessageParam,
  ChatCompletionUserMessageParam,
} from 'openai/resources/index.mjs';

export type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;

export const OPENAI_CHAT_COMPLETIONS_MODELS = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo-16k-0613',
  'gpt-4',
  'gpt-4-32k',
  'gpt-4-1106-preview',
  'gpt-4-turbo-preview',
] as const;

export type OpenAIChatCompletionsModelId =
  (typeof OPENAI_CHAT_COMPLETIONS_MODELS)[number];

export const OPENAI_COMPLETIONS_MODELS = [
  'ada',
  'babbage',
  'curie',
  'davinci',
  'text-ada-001',
  'text-babbage-001',
  'text-curie-001',
  'text-davinci-002',
  'text-davinci-003',
] as const;

export type OpenAICompletionsModelId =
  (typeof OPENAI_COMPLETIONS_MODELS)[number];

export const OPENAI_EMBEDDINGS_MODEL = 'text-embedding-ada-002' as const;

export type OpenAIEmbeddingsModelId = typeof OPENAI_EMBEDDINGS_MODEL;

export type OpenAIModelId =
  | OpenAIChatCompletionsModelId
  | OpenAICompletionsModelId
  | OpenAIEmbeddingsModelId;

export type SourceType =
  | 'github'
  | 'motif'
  | 'website'
  | 'file-upload'
  | 'api-upload'
  | 'nango'
  | 'salesforce';

export interface Source {
  type: SourceType;
  data?: {
    url?: string;
    domain?: string;
  };
}

export interface SearchResult extends SearchResultSection {
  file: FileReferenceFileData;
  matchType: 'title' | 'leadHeading' | 'content';
}

export interface SearchResultSection extends FileSectionReferenceSectionData {
  content?: string;
  snippet?: string;
}

export interface FileSectionReference extends FileSectionReferenceSectionData {
  /**
   * Referenced file.
   */
  file: FileReferenceFileData;
}

export interface FileSectionReferenceSectionData {
  /**
   * Metadata associated to the file section.
   */
  meta?: {
    leadHeading?: {
      id?: string;
      depth?: number;
      value?: string;
      slug?: string;
    };
  };
}

export interface FileReferenceFileData {
  /**
   * File title.
   */
  title?: string;
  /**
   * File path, e.g. URL or GitHub file path.
   */
  path: string;
  /**
   * File metadata.
   */
  meta?: object;
  /**
   * File source.
   */
  source: Source;
}

export interface SearchResultsResponse {
  debug?: unknown;
  data: SearchResult[];
}

export type AlgoliaDocSearchHit = DocSearchHit;

export interface AlgoliaDocSearchResultsResponse {
  hits: AlgoliaDocSearchHit[];
}

export interface MessageFeedback {
  vote?: 1 | -1 | 0;
  csat?: 1 | 2 | 3 | 4 | 5 | 0;
}

export interface ChatCompletionMetadata {
  conversationId?: string;
  promptId?: string;
  references?: FileSectionReference[];
}

export interface NoStreamingData {
  text: string;
  references?: FileSectionReference[];
  responseId: string;
}
