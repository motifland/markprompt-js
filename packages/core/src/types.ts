import type { DocSearchHit } from './docsearch.js';

export type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;

export const OPENAI_CHAT_COMPLETIONS_MODELS = [
  'gpt-3.5-turbo',
  'gpt-4-1106-preview',
  'gpt-4-32k',
  'gpt-4',
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
  file: FileReferenceFileData;
}

export interface FileSectionReferenceSectionData {
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
  title?: string;
  path: string;
  meta?: object;
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

export interface PromptFeedback {
  vote: '1' | '-1';
}

export interface ChatCompletionMetadata {
  conversationId?: string;
  promptId?: string;
  references?: FileSectionReference[];
}
